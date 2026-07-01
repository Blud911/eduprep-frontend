const pool = require('../db/pool');

// Vérifie que l'utilisateur a un abonnement actif
const requireSubscription = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') return next();

    // H3 FIX : bloquer si email non vérifié
    if (!req.user.email_verified) {
      return res.status(403).json({
        error: 'Email non vérifié.',
        code: 'EMAIL_NOT_VERIFIED',
        message: 'Veuillez vérifier votre adresse email pour activer votre essai gratuit. Consultez votre boîte mail.',
      });
    }

    const result = await pool.query(
      `SELECT s.*, u.role FROM subscriptions s
       JOIN users u ON u.id = s.user_id
       WHERE s.user_id = $1
         AND s.status IN ('active', 'trial')
         AND (s.date_fin IS NULL OR s.date_fin >= CURRENT_DATE)
       ORDER BY s.created_at DESC LIMIT 1`,
      [req.user.id]
    );

    if (!result.rows.length) {
      return res.status(403).json({
        error: 'Abonnement requis.',
        code: 'NO_SUBSCRIPTION',
        message: 'Votre abonnement est inactif ou expiré. Veuillez renouveler via Wave, Orange Money ou MTN Money.',
      });
    }

    req.subscription = result.rows[0];
    next();
  } catch (err) {
    console.error('[Subscription Middleware]', err.message);
    res.status(500).json({ error: 'Erreur de vérification d\'abonnement.' });
  }
};

// Vérifie le quota de fiches
const checkFicheQuota = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') return next();

    const sub = req.subscription;
    if (!sub) return res.status(403).json({ error: 'Abonnement requis.' });

    if (sub.fiches_limite === -1) return next();

    if (sub.fiches_utilisees >= sub.fiches_limite) {
      return res.status(403).json({
        error: 'Quota mensuel de fiches atteint.',
        code: 'QUOTA_EXCEEDED',
        quota: sub.fiches_limite,
        utilise: sub.fiches_utilisees,
        message: `Vous avez atteint votre limite de ${sub.fiches_limite} fiches ce mois-ci. Passez au plan Pro pour un accès illimité.`,
      });
    }

    next();
  } catch (err) {
    console.error('[Quota Fiche]', err.message);
    res.status(500).json({ error: 'Erreur de vérification de quota.' });
  }
};

// Vérifie le quota de devoirs
const checkDevoirQuota = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') return next();

    const sub = req.subscription;
    if (!sub) return res.status(403).json({ error: 'Abonnement requis.' });

    if (sub.devoirs_limite === -1) return next();

    if (sub.devoirs_utilises >= sub.devoirs_limite) {
      return res.status(403).json({
        error: 'Quota mensuel de devoirs atteint.',
        code: 'QUOTA_EXCEEDED',
        quota: sub.devoirs_limite,
        utilise: sub.devoirs_utilises,
        message: `Vous avez atteint votre limite de ${sub.devoirs_limite} devoirs ce mois-ci. Passez au plan Pro pour un accès illimité.`,
      });
    }

    next();
  } catch (err) {
    console.error('[Quota Devoir]', err.message);
    res.status(500).json({ error: 'Erreur de vérification de quota.' });
  }
};

// M4 FIX : inclure 'trial' dans le filtre status
const incrementFicheUsage = async (userId) => {
  await pool.query(
    `UPDATE subscriptions
     SET fiches_utilisees = fiches_utilisees + 1
     WHERE user_id = $1
       AND status IN ('active', 'trial')
       AND (date_fin IS NULL OR date_fin >= CURRENT_DATE)`,
    [userId]
  );
};

const incrementDevoirUsage = async (userId) => {
  await pool.query(
    `UPDATE subscriptions
     SET devoirs_utilises = devoirs_utilises + 1
     WHERE user_id = $1
       AND status IN ('active', 'trial')
       AND (date_fin IS NULL OR date_fin >= CURRENT_DATE)`,
    [userId]
  );
};

module.exports = {
  requireSubscription,
  checkFicheQuota,
  checkDevoirQuota,
  incrementFicheUsage,
  incrementDevoirUsage,
};