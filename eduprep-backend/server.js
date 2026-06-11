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

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================================
// SÉCURITÉ & MIDDLEWARE GLOBAUX
// ============================================================

// Nécessaire pour Render (reverse proxy)
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

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

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

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'EduPrep CI API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/ai', aiLimiter, aiRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/programmes', programmesRoutes);

// ============================================================
// GESTION D'ERREURS GLOBALE
// ============================================================

app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée.' });
});

app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ERREUR:`, err.message);
  if (process.env.NODE_ENV === 'development') {
    return res.status(500).json({ error: err.message, stack: err.stack });
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
});

module.exports = app;