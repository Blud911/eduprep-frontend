require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscriptions');
const aiRoutes = require('./routes/ai');
const contentRoutes = require('./routes/content');
const adminRoutes = require('./routes/admin');
const programmesRoutes = require('./routes/programmes');
const { demarrerScheduler } = require('./services/cron');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================
// SÉCURITÉ & MIDDLEWARE GLOBAUX
// ============================================================

// FIX C1 : une seule déclaration trust proxy (supprimé le doublon)
app.set('trust proxy', 1);

app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false,
}));

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5500',
  'http://localhost:3000',
  'http://127.0.0.1:5500',
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

// Rate limiting global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de requêtes, veuillez patienter.' },
});
app.use(globalLimiter);

// Rate limiting strict pour les routes IA (coûteuses)
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