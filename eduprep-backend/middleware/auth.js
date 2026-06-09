const jwt = require('jsonwebtoken');
const pool = require('../db/pool');

// Vérifie le JWT et charge l'utilisateur
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token d\'authentification manquant.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      'SELECT id, email, nom, prenoms, role, is_active FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (!result.rows.length || !result.rows[0].is_active) {
      return res.status(401).json({ error: 'Utilisateur introuvable ou désactivé.' });
    }

    req.user = result.rows[0];
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expirée. Veuillez vous reconnecter.', code: 'TOKEN_EXPIRED' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token invalide.' });
    }
    console.error('[Auth Middleware]', err.message);
    res.status(500).json({ error: 'Erreur d\'authentification.' });
  }
};

// Vérifie que l'utilisateur est admin
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Accès réservé aux administrateurs.' });
  }
  next();
};

// Vérifie que l'utilisateur est admin ou directeur
const requireAdminOrDirector = (req, res, next) => {
  if (!req.user || !['admin', 'director'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Accès non autorisé.' });
  }
  next();
};

module.exports = { requireAuth, requireAdmin, requireAdminOrDirector };
