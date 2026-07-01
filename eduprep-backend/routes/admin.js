// routes/admin.js
const express = require('express');
const pool = require('../db/pool');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// ============================================================
// STATS DASHBOARD
// ============================================================

router.get('/stats', requireAuth, requireAdmin, async (req, res) => {
  try {
    const [users, activeSubs, pendingPayments, fiches, devoirs, genToday] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users WHERE role != $1', ['admin']),
      pool.query(`SELECT COUNT(*) FROM subscriptions WHERE status = 'active' AND (date_fin IS NULL OR date_fin >= CURRENT_DATE)`),
      pool.query(`SELECT COUNT(*) FROM payments WHERE status = 'pending'`),
      pool.query('SELECT COUNT(*) FROM fiches'),
      pool.query('SELECT COUNT(*) FROM devoirs'),
      pool.query(`SELECT COUNT(*) FROM generation_logs WHERE created_at >= CURRENT_DATE`),
    ]);

    const revenueResult = await pool.query(
      `SELECT SUM(montant) as total FROM payments WHERE status = 'confirmed' AND created_at >= DATE_TRUNC('month', NOW())`
    );

    const planDist = await pool.query(
      `SELECT plan, COUNT(*) as nb FROM subscriptions WHERE status = 'active' GROUP BY plan ORDER BY nb DESC`
    );

    res.json({
      users: parseInt(users.rows[0].count),
      active_subscriptions: parseInt(activeSubs.rows[0].count),
      pending_payments: parseInt(pendingPayments.rows[0].count),
      fiches: parseInt(fiches.rows[0].count),
      devoirs: parseInt(devoirs.rows[0].count),
      generations_today: parseInt(genToday.rows[0].count),
      revenue_month: parseInt(revenueResult.rows[0].total) || 0,
      plan_distribution: planDist.rows,
    });
  } catch (err) {
    console.error('[Admin Stats]', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ============================================================
// UTILISATEURS
// ============================================================

// Liste utilisateurs
router.get('/users', requireAuth, requireAdmin, async (req, res) => {
  const { search, role, page = 1, limit = 30 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    const conditions = ['u.role != $1'];
    const values = ['admin'];
    let idx = 2;

    if (search) {
      conditions.push(`(u.nom ILIKE $${idx} OR u.email ILIKE $${idx} OR u.prenoms ILIKE $${idx})`);
      values.push(`%${search}%`);
      idx++;
    }
    if (role) { conditions.push(`u.role = $${idx++}`); values.push(role); }

    values.push(parseInt(limit), offset);

    const result = await pool.query(
      `SELECT u.id, u.email, u.nom, u.prenoms, u.telephone, u.role, u.is_active,
              u.matieres, u.last_login, u.created_at,
              s.id as sub_id, s.plan, s.status as sub_status, s.date_debut, s.date_fin,
              s.fiches_utilisees, s.fiches_limite, s.devoirs_utilises, s.devoirs_limite
       FROM users u
       LEFT JOIN subscriptions s ON s.user_id = u.id
         AND s.status IN ('active','trial')
         AND (s.date_fin IS NULL OR s.date_fin >= CURRENT_DATE)
       WHERE ${conditions.join(' AND ')}
       ORDER BY u.created_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      values
    );

    res.json({ users: result.rows });
  } catch (err) {
    console.error('[Admin Users]', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Détail d'un utilisateur
router.get('/users/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const user = await pool.query(
      `SELECT u.id, u.email, u.nom, u.prenoms, u.telephone, u.role, u.is_active,
              u.matieres, u.niveaux, u.last_login, u.created_at
       FROM users u WHERE u.id = $1`,
      [req.params.id]
    );
    if (!user.rows.length) return res.status(404).json({ error: 'Utilisateur introuvable.' });

    const subs = await pool.query(
      `SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.params.id]
    );

    const payments = await pool.query(
      `SELECT p.*, confirme.nom as confirme_par_nom
       FROM payments p
       LEFT JOIN users confirme ON confirme.id = p.confirme_par
       WHERE p.user_id = $1 ORDER BY p.created_at DESC`,
      [req.params.id]
    );

    res.json({
      user: user.rows[0],
      subscriptions: subs.rows,
      payments: payments.rows,
    });
  } catch (err) {
    console.error('[Admin User Detail]', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Activer/désactiver un compte utilisateur
router.patch('/users/:id/toggle', requireAuth, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE users SET is_active = NOT is_active WHERE id = $1 AND role != $2 RETURNING id, is_active, nom',
      [req.params.id, 'admin']
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Utilisateur introuvable.' });
    const u = result.rows[0];
    res.json({
      message: `Compte de ${u.nom} ${u.is_active ? 'activé' : 'désactivé'}.`,
      is_active: u.is_active,
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Résiliation définitive du compte (suppression)
router.delete('/users/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const check = await pool.query(
      'SELECT nom, prenoms, email, role FROM users WHERE id = $1',
      [req.params.id]
    );
    if (!check.rows.length) return res.status(404).json({ error: 'Utilisateur introuvable.' });
    if (check.rows[0].role === 'admin') return res.status(403).json({ error: 'Impossible de supprimer un admin.' });

    await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);

    res.json({
      message: `Compte de ${check.rows[0].nom} ${check.rows[0].prenoms || ''} (${check.rows[0].email}) supprimé définitivement.`,
    });
  } catch (err) {
    console.error('[Admin Delete User]', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ============================================================
// ABONNEMENTS
// ============================================================

// Liste tous les abonnements
router.get('/subscriptions', requireAuth, requireAdmin, async (req, res) => {
  const { status, plan, page = 1, limit = 30 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    const conditions = [];
    const values = [];
    let idx = 1;

    if (status) { conditions.push(`s.status = $${idx++}`); values.push(status); }
    if (plan) { conditions.push(`s.plan = $${idx++}`); values.push(plan); }

    values.push(parseInt(limit), offset);

    const result = await pool.query(
      `SELECT s.*, u.nom, u.prenoms, u.email, u.telephone
       FROM subscriptions s
       JOIN users u ON u.id = s.user_id
       ${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''}
       ORDER BY s.created_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      values
    );

    res.json({ subscriptions: result.rows });
  } catch (err) {
    console.error('[Admin Subscriptions]', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Créer un abonnement manuellement pour un utilisateur
router.post('/subscriptions', requireAuth, requireAdmin, async (req, res) => {
  const { user_id, plan, duree_mois = 1, note } = req.body;

  if (!user_id || !plan) {
    return res.status(400).json({ error: 'user_id et plan sont requis.' });
  }

  const limites = {
    trial:         { fiches: 5,  devoirs: 3  },
    starter:       { fiches: 20, devoirs: 10 },
    pro:           { fiches: -1, devoirs: -1 },
    etablissement: { fiches: -1, devoirs: -1 },
  };

  const limite = limites[plan];
  if (!limite) return res.status(400).json({ error: 'Plan invalide.' });

  try {
    // Expirer les abonnements actifs existants
    await pool.query(
      `UPDATE subscriptions SET status = 'cancelled' WHERE user_id = $1 AND status IN ('active','trial')`,
      [user_id]
    );

    const dateDebut = new Date();
    const dateFin = new Date();
    dateFin.setMonth(dateFin.getMonth() + parseInt(duree_mois));

    const result = await pool.query(
      `INSERT INTO subscriptions
         (user_id, plan, status, date_debut, date_fin, fiches_limite, devoirs_limite, notes)
       VALUES ($1, $2, 'active', $3, $4, $5, $6, $7)
       RETURNING *`,
      [user_id, plan, dateDebut, dateFin, limite.fiches, limite.devoirs, note || null]
    );

    res.status(201).json({
      message: `Abonnement ${plan} créé pour ${duree_mois} mois.`,
      subscription: result.rows[0],
    });
  } catch (err) {
    console.error('[Admin Create Sub]', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Réabonnement — prolonger un abonnement existant
router.patch('/subscriptions/:id/renouveler', requireAuth, requireAdmin, async (req, res) => {
  const { duree_mois = 1, plan, note } = req.body;

  try {
    const sub = await pool.query('SELECT * FROM subscriptions WHERE id = $1', [req.params.id]);
    if (!sub.rows.length) return res.status(404).json({ error: 'Abonnement introuvable.' });

    const s = sub.rows[0];
    const newPlan = plan || s.plan;

    const limites = {
      trial:         { fiches: 5,  devoirs: 3  },
      starter:       { fiches: 20, devoirs: 10 },
      pro:           { fiches: -1, devoirs: -1 },
      etablissement: { fiches: -1, devoirs: -1 },
    };
    const limite = limites[newPlan] || limites[s.plan];

    // Date de départ = aujourd'hui ou date_fin si encore active
    const baseDate = s.date_fin && new Date(s.date_fin) > new Date()
      ? new Date(s.date_fin)
      : new Date();

    const newDateFin = new Date(baseDate);
    newDateFin.setMonth(newDateFin.getMonth() + parseInt(duree_mois));

    const result = await pool.query(
      `UPDATE subscriptions
       SET status = 'active', plan = $1, date_fin = $2,
           fiches_limite = $3, devoirs_limite = $4,
           fiches_utilisees = 0, devoirs_utilises = 0,
           notes = COALESCE($5, notes), updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [newPlan, newDateFin, limite.fiches, limite.devoirs, note || null, req.params.id]
    );

    res.json({
      message: `Abonnement renouvelé en ${newPlan} jusqu'au ${newDateFin.toLocaleDateString('fr-FR')}.`,
      subscription: result.rows[0],
    });
  } catch (err) {
    console.error('[Admin Renouveler Sub]', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Résiliation d'un abonnement
router.patch('/subscriptions/:id/resilier', requireAuth, requireAdmin, async (req, res) => {
  const { note } = req.body;

  try {
    const result = await pool.query(
      `UPDATE subscriptions
       SET status = 'cancelled', notes = COALESCE($1, notes), updated_at = NOW()
       WHERE id = $2
       RETURNING id, plan, status, user_id`,
      [note || null, req.params.id]
    );

    if (!result.rows.length) return res.status(404).json({ error: 'Abonnement introuvable.' });

    res.json({
      message: 'Abonnement résilié.',
      subscription: result.rows[0],
    });
  } catch (err) {
    console.error('[Admin Resilier Sub]', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Modifier manuellement les quotas d'un abonnement
router.patch('/subscriptions/:id/quotas', requireAuth, requireAdmin, async (req, res) => {
  const { fiches_limite, devoirs_limite, fiches_utilisees, devoirs_utilises } = req.body;

  try {
    const updates = [];
    const values = [];
    let idx = 1;

    if (fiches_limite !== undefined)   { updates.push(`fiches_limite = $${idx++}`);    values.push(fiches_limite); }
    if (devoirs_limite !== undefined)  { updates.push(`devoirs_limite = $${idx++}`);   values.push(devoirs_limite); }
    if (fiches_utilisees !== undefined){ updates.push(`fiches_utilisees = $${idx++}`); values.push(fiches_utilisees); }
    if (devoirs_utilises !== undefined){ updates.push(`devoirs_utilises = $${idx++}`); values.push(devoirs_utilises); }

    if (!updates.length) return res.status(400).json({ error: 'Aucune modification.' });

    updates.push(`updated_at = NOW()`);
    values.push(req.params.id);

    const result = await pool.query(
      `UPDATE subscriptions SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );

    if (!result.rows.length) return res.status(404).json({ error: 'Abonnement introuvable.' });
    res.json({ message: 'Quotas mis à jour.', subscription: result.rows[0] });
  } catch (err) {
    console.error('[Admin Quotas]', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ============================================================
// PAIEMENTS
// ============================================================

// Liste paiements
router.get('/payments', requireAuth, requireAdmin, async (req, res) => {
  const { status, page = 1, limit = 30 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    const conditions = status ? [`p.status = $1`] : [];
    const values = status ? [status] : [];
    let idx = values.length + 1;
    values.push(parseInt(limit), offset);

    const result = await pool.query(
      `SELECT p.*, u.nom, u.prenoms, u.email, u.telephone,
              confirme.nom as confirme_par_nom
       FROM payments p
       JOIN users u ON u.id = p.user_id
       LEFT JOIN users confirme ON confirme.id = p.confirme_par
       ${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''}
       ORDER BY p.created_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      values
    );

    res.json({ payments: result.rows });
  } catch (err) {
    console.error('[Admin Payments]', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Confirmer un paiement → activer l'abonnement
router.patch('/payments/:id/confirm', requireAuth, requireAdmin, async (req, res) => {
  const { note } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const payResult = await client.query(
      `UPDATE payments
       SET status = 'confirmed', confirme_par = $1, confirme_le = NOW(), note_admin = COALESCE($2, note_admin)
       WHERE id = $3 AND status = 'pending'
       RETURNING *`,
      [req.user.id, note || null, req.params.id]
    );

    if (!payResult.rows.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Paiement introuvable ou déjà traité.' });
    }

    const payment = payResult.rows[0];

    const limites = {
      trial:         { fiches: 5,  devoirs: 3  },
      starter:       { fiches: 20, devoirs: 10 },
      pro:           { fiches: -1, devoirs: -1 },
      etablissement: { fiches: -1, devoirs: -1 },
    };
    const limite = limites[payment.plan] || { fiches: 20, devoirs: 10 };

    const dateDebut = payment.periode_debut || new Date();
    const dateFin   = payment.periode_fin   || (() => {
      const d = new Date(); d.setMonth(d.getMonth() + 1); return d;
    })();

    // Expirer abonnements actifs existants
    await client.query(
      `UPDATE subscriptions SET status = 'cancelled' WHERE user_id = $1 AND status IN ('active','trial')`,
      [payment.user_id]
    );

    // Activer le nouvel abonnement lié au paiement
    await client.query(
      `UPDATE subscriptions
       SET status = 'active', date_debut = $1, date_fin = $2,
           fiches_limite = $3, devoirs_limite = $4,
           fiches_utilisees = 0, devoirs_utilises = 0, updated_at = NOW()
       WHERE id = $5`,
      [dateDebut, dateFin, limite.fiches, limite.devoirs, payment.subscription_id]
    );

    await client.query('COMMIT');

    res.json({ message: `Paiement confirmé. Abonnement ${payment.plan} activé.` });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[Admin Confirm Payment]', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  } finally {
    client.release();
  }
});

// Rejeter un paiement
router.patch('/payments/:id/reject', requireAuth, requireAdmin, async (req, res) => {
  const { note } = req.body;

  try {
    const result = await pool.query(
      `UPDATE payments
       SET status = 'rejected', confirme_par = $1, confirme_le = NOW(), note_admin = COALESCE($2, note_admin)
       WHERE id = $3 AND status = 'pending'
       RETURNING id, plan, user_id`,
      [req.user.id, note || null, req.params.id]
    );

    if (!result.rows.length) return res.status(404).json({ error: 'Paiement introuvable ou déjà traité.' });

    res.json({ message: 'Paiement rejeté.' });
  } catch (err) {
    console.error('[Admin Reject Payment]', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ============================================================
// STATS IA
// ============================================================

router.get('/ai-stats', requireAuth, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         type_gen,
         COUNT(*) as nb,
         SUM(tokens_input) as total_tokens_in,
         SUM(tokens_output) as total_tokens_out,
         AVG(latence_ms)::INTEGER as latence_moy,
         SUM(CASE WHEN success = FALSE THEN 1 ELSE 0 END) as erreurs,
         DATE_TRUNC('day', created_at) as jour
       FROM generation_logs
       WHERE created_at >= NOW() - INTERVAL '30 days'
       GROUP BY type_gen, jour
       ORDER BY jour DESC`
    );
    res.json({ stats: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

module.exports = router;