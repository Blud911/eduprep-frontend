require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');

const authRoutes = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscriptions');
const aiRoutes = require('./routes/ai');
const contentRoutes = require('./routes/content');
const adminRoutes = require('./routes/admin');
const programmesRoutes = require('./routes/programmes');
const pdfRoutes = require('./routes/pdf');
const { demarrerScheduler } = require('./services/cron');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================
// SÉCURITÉ & MIDDLEWARE GLOBAUX
// ============================================================

// FIX C1 : une seule déclaration trust proxy (supprimé le doublon)
app.set('trust proxy', 1);

// FIX SEC-CSP : cette CSP ne s'applique QU'aux réponses HTML envoyées
// directement par ce serveur Express — c'est-à-dire uniquement les 3 pages
// de confirmation de routes/auth.js (GET /api/auth/verify-email/:token,
// res.send(`<html>...`)). Elle n'a AUCUN effet sur app.html/admin.html/
// index.html : ces pages sont servies par un hébergeur statique séparé
// (Cloudflare Pages), qui ne reçoit jamais les en-têtes HTTP de ce backend.
// La CSP qui protège réellement le frontend contre l'XSS (cf. correctif du
// 02/09/2026) doit être configurée côté hébergeur statique (voir le fichier
// _headers fourni séparément), pas ici.
// Risque de cette CSP-ci : très faible — les 3 pages concernées sont
// statiques, sans script, avec uniquement des attributs style="" en ligne.
// Gardée derrière CSP_ENABLED par prudence malgré tout (même logique que
// DB_SSL_STRICT dans db/pool.js) : désactivée par défaut, comportement
// actuel inchangé tant qu'elle n'est pas explicitement activée sur Render.
const cspActivee = process.env.CSP_ENABLED === 'true';

app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: cspActivee ? {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'none'"],
      styleSrc: ["'unsafe-inline'"],
      imgSrc: ["'self'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
    },
  } : false,
}));

// FIX SEC-4 : les origines localhost ne sont whitelistées qu'en développement.
// Un Origin ne peut pas être falsifié par un navigateur distant (il reflète
// la page qui envoie la requête, pas un en-tête contrôlable par un attaquant),
// donc les garder en prod n'était pas exploitable à distance — mais ça
// n'avait aucune raison de rester actif en production non plus.
const allowedOrigins = [
  process.env.FRONTEND_URL,
  ...(process.env.NODE_ENV !== 'production' ? [
    'http://localhost:5500',
    'http://localhost:3000',
    'http://127.0.0.1:5500',
  ] : []),
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('CORS non autorisé'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// FIX M2 : body JSON global limité à 50kb (les routes qui ont besoin de plus ont leur propre limite)
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// ------------------------------------------------------------
// Clé de rate limit partagée : identifie l'utilisateur via son JWT
// quand c'est possible, retombe sur l'IP sinon (requêtes non
// authentifiées : inscription, login, démo publique, health check).
// Ajouté le 22/08/2026, même principe que aiLimiter (routes/ai.js) :
// globalLimiter est monté ICI, avant que requireAuth ne s'exécute
// route par route — req.user n'existe pas encore à ce stade, donc on
// vérifie le JWT directement plutôt que de dépendre du middleware.
// Un enseignant garde son propre quota même si plusieurs collègues
// de son établissement partagent la même IP (même WiFi d'école).
// Échec silencieux sur l'IP en cas de token absent/invalide/expiré —
// ce n'est pas le rôle de ce keyGenerator de rejeter la requête,
// seulement de choisir la meilleure clé de comptage disponible.
// ------------------------------------------------------------
function cleRateLimit(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
      if (decoded && decoded.userId) return decoded.userId;
    } catch (e) {
      // Token invalide/expiré : retombe sur l'IP, pas d'erreur ici —
      // requireAuth (exécuté plus tard sur la route) gère le vrai rejet.
    }
  }
  return req.ip;
}

// Rate limiting global — par utilisateur si authentifié, par IP sinon
// (voir cleRateLimit ci-dessus). Avant le 22/08/2026, comptait
// uniquement par IP, ce qui pénalisait collectivement tous les
// enseignants d'un même établissement partageant le même réseau.
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: cleRateLimit,
  message: { error: 'Trop de requêtes, veuillez patienter.' },
});
app.use(globalLimiter);

// Rate limiting strict pour les routes IA (coûteuses)
// TEMPORAIRE (11/09/2026) : la version par-utilisateur de ce limiter existe
// déjà dans routes/ai.js (montée après requireAuth, cf. session de refonte
// APC), mais routes/ai.js n'est volontairement pas encore déployé (Lot 2 —
// déployé par étapes). Tant que routes/ai.js déployé n'a pas son propre
// aiLimiter, retirer celui-ci laisserait /fiche, /devoir, /corrige,
// /variantes sans limite dédiée (seulement le globalLimiter, 200/15min,
// bien plus large) — donc gardé ici jusqu'au déploiement d'ai.js, qui
// pourra alors être retiré au profit de la version par-utilisateur.
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Limite de génération IA atteinte (10/minute). Veuillez patienter.' },
});

// Rate limiting pour auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Trop de tentatives de connexion.' },
});

// ============================================================
// ROUTES
// ============================================================

// FIX C2 : /health ne révèle plus version, env ni timestamp
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/pdf', express.json({ limit: '2mb' }), pdfRoutes);

// FIX M2 : routes IA limitées à 10kb (inputs texte courts)
app.use('/api/ai', aiLimiter, express.json({ limit: '10kb' }), aiRoutes);

// FIX M2 : content accepte jusqu'à 500kb (sauvegarde fiches/devoirs JSON)
app.use('/api/content', express.json({ limit: '500kb' }), contentRoutes);

app.use('/api/admin', adminRoutes);
app.use('/api/programmes', programmesRoutes);

// ============================================================
// GESTION D'ERREURS GLOBALE
// ============================================================

app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée.' });
});

// FIX H4 : stack trace jamais exposée, même en développement côté client
app.use((err, req, res, next) => {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    console.error(`[${new Date().toISOString()}] ERREUR:`, err.message, err.stack);
  } else {
    console.error(`[${new Date().toISOString()}] ERREUR [${err.code || 'UNKNOWN'}]:`, err.message);
  }
  res.status(500).json({ error: 'Erreur interne du serveur.' });
});

// ============================================================
// DÉMARRAGE
// ============================================================

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║       EduPrep CI — API Backend        ║
║  Port: ${PORT}   Env: ${(process.env.NODE_ENV || 'development').padEnd(11)} ║
╚═══════════════════════════════════════╝
  `);
  demarrerScheduler();
});

module.exports = app;