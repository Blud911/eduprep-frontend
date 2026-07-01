const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const validator = require('validator');
const pool = require('../db/pool');
const { requireAuth } = require('../middleware/auth');
const emailService = require('../services/email');

const router = express.Router();

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
  if (nom.trim().length > 100) {
    return res.status(400).json({ error: 'Nom trop long (100 caractères max).' });
  }
  if (prenoms && prenoms.trim().length > 150) {
    return res.status(400).json({ error: 'Prénoms trop longs (150 caractères max).' });
  }
  if (telephone && telephone.trim().length > 25) {
    return res.status(400).json({ error: 'Numéro de téléphone invalide.' });
  }
  if (password.length > 128) {
    return res.status(400).json({ error: 'Mot de passe trop long (128 caractères max).' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const existing = await client.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length) {
      return res.status(409).json({ error: 'Cette adresse email est déjà utilisée.' });
    }

    const password_hash = await bcrypt.hash(password, 12);

    // H3 FIX : générer un token de vérification email sécurisé (32 octets hex = 64 chars)
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    const result = await client.query(
      `INSERT INTO users (
         email, password_hash, nom, prenoms, telephone, etablissement_id, matieres, niveaux,
         email_verified, email_verification_token, email_verification_expires
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, FALSE, $9, $10)
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
        verificationToken,
        verificationExpires,
      ]
    );

    const user = result.rows[0];

    // Créer l'abonnement trial (inactif jusqu'à vérification email)
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 7);

    await client.query(
      `INSERT INTO subscriptions (user_id, plan, status, date_debut, date_fin, fiches_limite, devoirs_limite, reset_date)
       VALUES ($1, 'trial', 'pending', CURRENT_DATE, $2, 5, 3, $3)`,
      [user.id, trialEnd.toISOString().split('T')[0], trialEnd.toISOString().split('T')[0]]
    );

    await client.query('COMMIT');

    // Envoyer email de vérification (non bloquant)
    emailService.sendVerificationEmail(
      { email: email.toLowerCase(), nom: nom.trim() },
      verificationToken
    ).catch(() => {});

    // Envoyer aussi le bienvenue (non bloquant)
    emailService.sendBienvenue({ email: email.toLowerCase(), nom: nom.trim(), prenoms: prenoms?.trim() }).catch(() => {});

    const { accessToken, refreshToken } = generateTokens(user.id);

    const refreshHash = await bcrypt.hash(refreshToken, 8);
    await pool.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '30 days')`,
      [user.id, refreshHash]
    );

    res.status(201).json({
      message: 'Inscription réussie ! Vérifiez votre email pour activer votre essai gratuit.',
      user: { id: user.id, email: user.email, nom: user.nom, prenoms: user.prenoms, role: user.role },
      accessToken,
      refreshToken,
      email_verified: false,
      trial: { fin: trialEnd.toISOString().split('T')[0], fiches: 5, devoirs: 3 },
    });
  } catch (err) {
    await client.query('ROLLBACK');
    if (process.env.NODE_ENV !== 'production') console.error('[Register]', err.message);
    res.status(500).json({ error: 'Erreur lors de l\'inscription.' });
  } finally {
    client.release();
  }
});

// ============================================================
// GET /api/auth/verify-email/:token — H3 FIX
// ============================================================
router.get('/verify-email/:token', async (req, res) => {
  const { token } = req.params;

  if (!token || token.length !== 64 || !/^[a-f0-9]+$/.test(token)) {
    return res.status(400).send(`
      <html><body style="font-family:Arial;text-align:center;padding:60px;background:#FFEBEE">
        <h2 style="color:#C62828">❌ Lien invalide</h2>
        <p>Ce lien de vérification est invalide ou malformé.</p>
        <a href="${process.env.FRONTEND_URL || 'https://eduprep-frontend.pages.dev'}" style="color:#1B5E20">Retour à EduPrep CI</a>
      </body></html>
    `);
  }

  try {
    // Chercher l'utilisateur avec ce token non expiré
    const result = await pool.query(
      `SELECT id, nom, email, email_verified
       FROM users
       WHERE email_verification_token = $1
         AND email_verification_expires > NOW()
         AND email_verified = FALSE`,
      [token]
    );

    if (!result.rows.length) {
      return res.status(400).send(`
        <html><body style="font-family:Arial;text-align:center;padding:60px;background:#FFEBEE">
          <h2 style="color:#C62828">❌ Lien expiré ou déjà utilisé</h2>
          <p>Ce lien a expiré (validité 24h) ou votre email est déjà vérifié.</p>
          <a href="${process.env.FRONTEND_URL || 'https://eduprep-frontend.pages.dev'}/app.html" style="color:#1B5E20">
            Se connecter
          </a>
        </body></html>
      `);
    }

    const user = result.rows[0];

    // Marquer email comme vérifié + activer l'abonnement trial
    await pool.query('BEGIN');
    try {
      await pool.query(
        `UPDATE users
         SET email_verified = TRUE,
             email_verification_token = NULL,
             email_verification_expires = NULL
         WHERE id = $1`,
        [user.id]
      );

      // Activer le trial (passer de 'pending' à 'trial')
      await pool.query(
        `UPDATE subscriptions
         SET status = 'trial'
         WHERE user_id = $1 AND status = 'pending'`,
        [user.id]
      );

      await pool.query('COMMIT');
    } catch (e) {
      await pool.query('ROLLBACK');
      throw e;
    }

    // Rediriger vers l'app avec message de succès
    const frontendUrl = process.env.FRONTEND_URL || 'https://eduprep-frontend.pages.dev';
    return res.redirect(`${frontendUrl}/app.html?verified=1`);

  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error('[Verify Email]', err.message);
    return res.status(500).send(`
      <html><body style="font-family:Arial;text-align:center;padding:60px;background:#FFEBEE">
        <h2 style="color:#C62828">❌ Erreur serveur</h2>
        <p>Une erreur est survenue. Réessayez ou contactez le support.</p>
        <a href="${process.env.FRONTEND_URL || 'https://eduprep-frontend.pages.dev'}" style="color:#1B5E20">Retour</a>
      </body></html>
    `);
  }
});

// ============================================================
// POST /api/auth/resend-verification — Renvoyer le lien
// ============================================================
router.post('/resend-verification', requireAuth, async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT id, email, nom, email_verified FROM users WHERE id = $1',
      [req.user.id]
    );

    if (!user.rows.length) return res.status(404).json({ error: 'Utilisateur introuvable.' });
    if (user.rows[0].email_verified) {
      return res.status(400).json({ error: 'Email déjà vérifié.' });
    }

    const newToken = crypto.randomBytes(32).toString('hex');
    const newExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await pool.query(
      `UPDATE users
       SET email_verification_token = $1, email_verification_expires = $2
       WHERE id = $3`,
      [newToken, newExpires, req.user.id]
    );

    emailService.sendVerificationEmail(
      { email: user.rows[0].email, nom: user.rows[0].nom },
      newToken
    ).catch(() => {});

    res.json({ message: 'Email de vérification renvoyé. Vérifiez votre boîte mail.' });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error('[Resend Verification]', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
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
  if (email.length > 255 || password.length > 128) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
  }

  try {
    const result = await pool.query(
      `SELECT u.id, u.email, u.password_hash, u.nom, u.prenoms, u.role, u.is_active, u.email_verified,
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

    await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

    const { accessToken, refreshToken } = generateTokens(user.id);

    const refreshHash = await bcrypt.hash(refreshToken, 8);
    await pool.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '30 days')`,
      [user.id, refreshHash]
    );
    await pool.query(
      `DELETE FROM refresh_tokens WHERE user_id = $1
       AND id NOT IN (SELECT id FROM refresh_tokens WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5)`,
      [user.id]
    );

    res.json({
      user: {
        id: user.id, email: user.email, nom: user.nom, prenoms: user.prenoms, role: user.role,
        email_verified: user.email_verified,
      },
      subscription: user.plan ? {
        plan: user.plan, status: user.sub_status, date_fin: user.date_fin,
        fiches_limite: user.fiches_limite, devoirs_limite: user.devoirs_limite,
        fiches_utilisees: user.fiches_utilisees, devoirs_utilises: user.devoirs_utilises,
      } : null,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error('[Login]', err.message);
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

    if (!valid) return res.status(401).json({ error: 'Refresh token invalide ou révoqué.' });

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.userId);
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
              u.etablissement_id, u.created_at, u.email_verified,
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

    if (!result.rows.length) return res.status(404).json({ error: 'Utilisateur introuvable.' });

    const u = result.rows[0];
    res.json({
      user: {
        id: u.id, email: u.email, nom: u.nom, prenoms: u.prenoms,
        telephone: u.telephone, role: u.role, matieres: u.matieres,
        niveaux: u.niveaux, etablissement: u.etablissement_nom,
        created_at: u.created_at, email_verified: u.email_verified,
      },
      subscription: u.plan ? {
        plan: u.plan, status: u.sub_status, date_fin: u.date_fin,
        fiches_limite: u.fiches_limite, devoirs_limite: u.devoirs_limite,
        fiches_utilisees: u.fiches_utilisees, devoirs_utilises: u.devoirs_utilises,
      } : null,
    });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error('[Me]', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ============================================================
// PUT /api/auth/profile
// ============================================================
router.put('/profile', requireAuth, async (req, res) => {
  const { nom, prenoms, telephone, matieres, niveaux, password, new_password } = req.body;

  if (nom && nom.trim().length > 100) return res.status(400).json({ error: 'Nom trop long (100 caractères max).' });
  if (prenoms && prenoms.trim().length > 150) return res.status(400).json({ error: 'Prénoms trop longs (150 caractères max).' });
  if (telephone && telephone.trim().length > 25) return res.status(400).json({ error: 'Numéro de téléphone invalide.' });
  if (new_password && new_password.length > 128) return res.status(400).json({ error: 'Nouveau mot de passe trop long.' });

  try {
    const updates = [];
    const values = [];
    let idx = 1;

    if (nom) { updates.push(`nom = $${idx++}`); values.push(nom.trim()); }
    if (prenoms !== undefined) { updates.push(`prenoms = $${idx++}`); values.push(prenoms?.trim() || null); }
    if (telephone !== undefined) { updates.push(`telephone = $${idx++}`); values.push(telephone?.trim() || null); }
    if (matieres) { updates.push(`matieres = $${idx++}`); values.push(matieres); }
    if (niveaux) { updates.push(`niveaux = $${idx++}`); values.push(niveaux); }

    if (new_password) {
      if (!password) return res.status(400).json({ error: 'Mot de passe actuel requis.' });
      if (new_password.length < 8) return res.status(400).json({ error: 'Nouveau mot de passe trop court (8 caractères min).' });

      const userResult = await pool.query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
      const match = await bcrypt.compare(password, userResult.rows[0].password_hash);
      if (!match) return res.status(401).json({ error: 'Mot de passe actuel incorrect.' });

      const newHash = await bcrypt.hash(new_password, 12);
      updates.push(`password_hash = $${idx++}`);
      values.push(newHash);

      // H1 FIX : révoquer tous les refresh tokens
      await pool.query('DELETE FROM refresh_tokens WHERE user_id = $1', [req.user.id]);
    }

    if (!updates.length) return res.status(400).json({ error: 'Aucune modification fournie.' });

    values.push(req.user.id);
    await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = $${idx}`, values);

    res.json({ message: 'Profil mis à jour avec succès.', sessions_revoked: !!new_password });
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.error('[Profile Update]', err.message);
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
      const tokens = await pool.query('SELECT * FROM refresh_tokens WHERE user_id = $1', [req.user.id]);
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