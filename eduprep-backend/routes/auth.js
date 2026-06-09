const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const validator = require('validator');
const pool = require('../db/pool');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Génère les tokens JWT
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
  const refreshToken = jwt.sign(
    { userId, jti: uuidv4() },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
  );
  return { accessToken, refreshToken };
};

// ============================================================
// POST /api/auth/register
// ============================================================
router.post('/register', async (req, res) => {
  const { email, password, nom, prenoms, telephone, etablissement_id, matieres, niveaux } = req.body;

  if (!email || !password || !nom) {
    return res.status(400).json({ error: 'Email, mot de passe et nom sont obligatoires.' });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Adresse email invalide.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const existing = await client.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length) {
      return res.status(409).json({ error: 'Cette adresse email est déjà utilisée.' });
    }

    const password_hash = await bcrypt.hash(password, 12);

    const result = await client.query(
      `INSERT INTO users (email, password_hash, nom, prenoms, telephone, etablissement_id, matieres, niveaux)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, email, nom, prenoms, role`,
      [
        email.toLowerCase(),
        password_hash,
        nom.trim(),
        prenoms?.trim() || null,
        telephone?.trim() || null,
        etablissement_id || null,
        matieres || [],
        niveaux || [],
      ]
    );

    const user = result.rows[0];

    // Créer un abonnement d'essai de 7 jours
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 7);

    await client.query(
      `INSERT INTO subscriptions (user_id, plan, status, date_debut, date_fin, fiches_limite, devoirs_limite, reset_date)
       VALUES ($1, 'trial', 'trial', CURRENT_DATE, $2, 5, 3, $3)`,
      [user.id, trialEnd.toISOString().split('T')[0], trialEnd.toISOString().split('T')[0]]
    );

    await client.query('COMMIT');

    const { accessToken, refreshToken } = generateTokens(user.id);

    // Sauvegarder le refresh token
    const refreshHash = await bcrypt.hash(refreshToken, 8);
    await pool.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '30 days')`,
      [user.id, refreshHash]
    );

    res.status(201).json({
      message: 'Inscription réussie ! Vous bénéficiez de 7 jours d\'essai gratuit.',
      user: { id: user.id, email: user.email, nom: user.nom, prenoms: user.prenoms, role: user.role },
      accessToken,
      refreshToken,
      trial: { fin: trialEnd.toISOString().split('T')[0], fiches: 5, devoirs: 3 },
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[Register]', err.message);
    res.status(500).json({ error: 'Erreur lors de l\'inscription.' });
  } finally {
    client.release();
  }
});

// ============================================================
// POST /api/auth/login
// ============================================================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis.' });
  }

  try {
    const result = await pool.query(
      `SELECT u.id, u.email, u.password_hash, u.nom, u.prenoms, u.role, u.is_active,
              s.plan, s.status as sub_status, s.date_fin, s.fiches_limite, s.devoirs_limite,
              s.fiches_utilisees, s.devoirs_utilises
       FROM users u
       LEFT JOIN subscriptions s ON s.user_id = u.id
         AND s.status IN ('active', 'trial')
         AND (s.date_fin IS NULL OR s.date_fin >= CURRENT_DATE)
       WHERE u.email = $1
       ORDER BY s.created_at DESC LIMIT 1`,
      [email.toLowerCase()]
    );

    if (!result.rows.length) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(403).json({ error: 'Compte désactivé. Contactez l\'administrateur.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }

    // Mise à jour last_login
    await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

    const { accessToken, refreshToken } = generateTokens(user.id);

    // Sauvegarder le refresh token (max 5 par utilisateur)
    const refreshHash = await bcrypt.hash(refreshToken, 8);
    await pool.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '30 days')`,
      [user.id, refreshHash]
    );
    // Nettoyer les anciens
    await pool.query(
      `DELETE FROM refresh_tokens WHERE user_id = $1
       AND id NOT IN (SELECT id FROM refresh_tokens WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5)`,
      [user.id]
    );

    res.json({
      user: {
        id: user.id,
        email: user.email,
        nom: user.nom,
        prenoms: user.prenoms,
        role: user.role,
      },
      subscription: user.plan ? {
        plan: user.plan,
        status: user.sub_status,
        date_fin: user.date_fin,
        fiches_limite: user.fiches_limite,
        devoirs_limite: user.devoirs_limite,
        fiches_utilisees: user.fiches_utilisees,
        devoirs_utilises: user.devoirs_utilises,
      } : null,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error('[Login]', err.message);
    res.status(500).json({ error: 'Erreur lors de la connexion.' });
  }
});

// ============================================================
// POST /api/auth/refresh
// ============================================================
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token manquant.' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Vérifier que le token existe en base
    const tokens = await pool.query(
      `SELECT * FROM refresh_tokens WHERE user_id = $1 AND expires_at > NOW()`,
      [decoded.userId]
    );

    let valid = false;
    for (const row of tokens.rows) {
      if (await bcrypt.compare(refreshToken, row.token_hash)) {
        valid = true;
        break;
      }
    }

    if (!valid) {
      return res.status(401).json({ error: 'Refresh token invalide ou révoqué.' });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId);

    // Rotation du refresh token
    const newHash = await bcrypt.hash(newRefreshToken, 8);
    await pool.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '30 days')`,
      [decoded.userId, newHash]
    );

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    res.status(401).json({ error: 'Refresh token invalide ou expiré.' });
  }
});

// ============================================================
// GET /api/auth/me
// ============================================================
router.get('/me', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.email, u.nom, u.prenoms, u.telephone, u.role, u.matieres, u.niveaux,
              u.etablissement_id, u.created_at,
              e.nom as etablissement_nom,
              s.plan, s.status as sub_status, s.date_fin,
              s.fiches_limite, s.devoirs_limite,
              s.fiches_utilisees, s.devoirs_utilises
       FROM users u
       LEFT JOIN etablissements e ON e.id = u.etablissement_id
       LEFT JOIN subscriptions s ON s.user_id = u.id
         AND s.status IN ('active','trial')
         AND (s.date_fin IS NULL OR s.date_fin >= CURRENT_DATE)
       WHERE u.id = $1
       ORDER BY s.created_at DESC LIMIT 1`,
      [req.user.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Utilisateur introuvable.' });
    }

    const u = result.rows[0];
    res.json({
      user: {
        id: u.id, email: u.email, nom: u.nom, prenoms: u.prenoms,
        telephone: u.telephone, role: u.role, matieres: u.matieres,
        niveaux: u.niveaux, etablissement: u.etablissement_nom,
        created_at: u.created_at,
      },
      subscription: u.plan ? {
        plan: u.plan, status: u.sub_status, date_fin: u.date_fin,
        fiches_limite: u.fiches_limite, devoirs_limite: u.devoirs_limite,
        fiches_utilisees: u.fiches_utilisees, devoirs_utilises: u.devoirs_utilises,
      } : null,
    });
  } catch (err) {
    console.error('[Me]', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ============================================================
// PUT /api/auth/profile — Modifier son profil
// ============================================================
router.put('/profile', requireAuth, async (req, res) => {
  const { nom, prenoms, telephone, matieres, niveaux, password, new_password } = req.body;

  try {
    const updates = [];
    const values = [];
    let idx = 1;

    if (nom) { updates.push(`nom = $${idx++}`); values.push(nom.trim()); }
    if (prenoms !== undefined) { updates.push(`prenoms = $${idx++}`); values.push(prenoms?.trim() || null); }
    if (telephone !== undefined) { updates.push(`telephone = $${idx++}`); values.push(telephone?.trim() || null); }
    if (matieres) { updates.push(`matieres = $${idx++}`); values.push(matieres); }
    if (niveaux) { updates.push(`niveaux = $${idx++}`); values.push(niveaux); }

    // Changement de mot de passe
    if (new_password) {
      if (!password) return res.status(400).json({ error: 'Mot de passe actuel requis.' });
      if (new_password.length < 8) return res.status(400).json({ error: 'Nouveau mot de passe trop court (8 caractères min).' });

      const userResult = await pool.query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
      const match = await bcrypt.compare(password, userResult.rows[0].password_hash);
      if (!match) return res.status(401).json({ error: 'Mot de passe actuel incorrect.' });

      const newHash = await bcrypt.hash(new_password, 12);
      updates.push(`password_hash = $${idx++}`);
      values.push(newHash);
    }

    if (!updates.length) {
      return res.status(400).json({ error: 'Aucune modification fournie.' });
    }

    values.push(req.user.id);
    await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${idx}`,
      values
    );

    res.json({ message: 'Profil mis à jour avec succès.' });
  } catch (err) {
    console.error('[Profile Update]', err.message);
    res.status(500).json({ error: 'Erreur lors de la mise à jour.' });
  }
});

// ============================================================
// POST /api/auth/logout
// ============================================================
router.post('/logout', requireAuth, async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      const tokens = await pool.query(
        'SELECT * FROM refresh_tokens WHERE user_id = $1',
        [req.user.id]
      );
      for (const row of tokens.rows) {
        if (await bcrypt.compare(refreshToken, row.token_hash)) {
          await pool.query('DELETE FROM refresh_tokens WHERE id = $1', [row.id]);
          break;
        }
      }
    }
    res.json({ message: 'Déconnexion réussie.' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la déconnexion.' });
  }
});

module.exports = router;
