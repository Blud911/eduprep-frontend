// routes/admin.js
const express = require('express');
const pool = require('../db/pool');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Dashboard stats
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
              s.plan, s.status as sub_status, s.date_fin
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

// Activer/désactiver un utilisateur
router.patch('/users/:id/toggle', requireAuth, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE users SET is_active = NOT is_active WHERE id = $1 AND role != $2 RETURNING id, is_active, nom',
      [req.params.id, 'admin']
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Utilisateur introuvable.' });
    const u = result.rows[0];
    res.json({ message: `Compte de ${u.nom} ${u.is_active ? 'activé' : 'désactivé'}.`, is_active: u.is_active });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Tous les paiements (historique complet)
router.get('/payments', requireAuth, requireAdmin, async (req, res) => {
  const { status, page = 1, limit = 30 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    const conditions = status ? [`p.status = $1`] : [];
    const values = status ? [status] : [];
    let idx = values.length + 1;
    values.push(parseInt(limit), offset);

    const result = await pool.query(
      `SELECT p.*, u.nom, u.prenoms, u.email,
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
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Statistiques génération IA (coûts)
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
