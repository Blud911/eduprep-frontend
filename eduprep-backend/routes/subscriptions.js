const express = require('express');
const pool = require('../db/pool');
const { requireAuth } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Tarifs et quotas par plan
const PLANS = {
  starter: {
    nom: 'Starter',
    prix: parseInt(process.env.PRICE_STARTER) || 1000,
    fiches_limite: parseInt(process.env.QUOTA_STARTER_FICHES) || 20,
    devoirs_limite: parseInt(process.env.QUOTA_STARTER_DEVOIRS) || 10,
    description: '20 fiches/mois · 10 devoirs/mois',
  },
  pro: {
    nom: 'Pro',
    prix: parseInt(process.env.PRICE_PRO) || 2500,
    fiches_limite: -1,
    devoirs_limite: -1,
    description: 'Illimité · Export PDF · Banque de questions',
  },
  etablissement: {
    nom: 'Établissement',
    prix: parseInt(process.env.PRICE_ETABLISSEMENT) || 15000,
    fiches_limite: -1,
    devoirs_limite: -1,
    description: 'Jusqu\'à 20 enseignants · Tableau directeur',
  },
  formation: {
    nom: 'Formation',
    prix: 0,
    fiches_limite: -1,
    devoirs_limite: -1,
    description: 'CAFOP / DREN — Sur devis',
  },
};

// ============================================================
// GET /api/subscriptions/plans — Plans disponibles
// ============================================================
router.get('/plans', (req, res) => {
  const plans = Object.entries(PLANS).map(([key, val]) => ({
    id: key,
    ...val,
    contacts: {
      wave: process.env.WAVE_NUMBER || 'Contacter le support',
      orange_money: process.env.OM_NUMBER || 'Contacter le support',
      mtn_money: process.env.MTN_NUMBER || 'Contacter le support',
    },
  }));
  res.json({ plans });
});

// ============================================================
// GET /api/subscriptions/my — Mon abonnement actuel
// ============================================================
router.get('/my', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, p.montant as dernier_paiement, p.methode as derniere_methode, p.confirme_le
       FROM subscriptions s
       LEFT JOIN payments p ON p.subscription_id = s.id AND p.status = 'confirmed'
       WHERE s.user_id = $1
       ORDER BY s.created_at DESC LIMIT 1`,
      [req.user.id]
    );

    if (!result.rows.length) {
      return res.json({ subscription: null, message: 'Aucun abonnement trouvé.' });
    }

    const sub = result.rows[0];
    const jours_restants = sub.date_fin
      ? Math.max(0, Math.ceil((new Date(sub.date_fin) - new Date()) / (1000 * 60 * 60 * 24)))
      : null;

    res.json({
      subscription: {
        ...sub,
        jours_restants,
        plan_info: PLANS[sub.plan] || null,
      },
    });
  } catch (err) {
    console.error('[My Subscription]', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ============================================================
// POST /api/subscriptions/request — Demander un abonnement
// L'enseignant envoie la référence de son paiement Mobile Money
// ============================================================
router.post('/request', requireAuth, async (req, res) => {
  const { plan, methode, reference_mm, telephone_mm } = req.body;

  if (!plan || !methode || !reference_mm || !telephone_mm) {
    return res.status(400).json({
      error: 'Plan, méthode de paiement, référence de transaction et numéro de téléphone sont requis.',
    });
  }

  if (!PLANS[plan]) {
    return res.status(400).json({ error: 'Plan invalide.' });
  }

  if (!['wave', 'orange_money', 'mtn_money'].includes(methode)) {
    return res.status(400).json({ error: 'Méthode de paiement invalide.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Vérifier si la référence n'est pas déjà utilisée
    const refExist = await client.query(
      'SELECT id FROM payments WHERE reference_mm = $1',
      [reference_mm.trim()]
    );
    if (refExist.rows.length) {
      return res.status(409).json({ error: 'Cette référence de transaction a déjà été soumise.' });
    }

    // Calculer la période
    const dateDebut = new Date();
    const dateFin = new Date();
    dateFin.setMonth(dateFin.getMonth() + 1);

    // Créer ou renouveler l'abonnement (statut pending en attendant confirmation admin)
    const subResult = await client.query(
      `INSERT INTO subscriptions
         (user_id, plan, status, date_debut, date_fin, fiches_limite, devoirs_limite, reset_date)
       VALUES ($1, $2, 'pending', $3, $4, $5, $6, $4)
       RETURNING id`,
      [
        req.user.id,
        plan,
        dateDebut.toISOString().split('T')[0],
        dateFin.toISOString().split('T')[0],
        PLANS[plan].fiches_limite,
        PLANS[plan].devoirs_limite,
      ]
    );

    const subscriptionId = subResult.rows[0].id;

    // Enregistrer le paiement
    await client.query(
      `INSERT INTO payments
         (subscription_id, user_id, montant, plan, methode, status, reference_mm, telephone_mm, periode_debut, periode_fin)
       VALUES ($1, $2, $3, $4, $5, 'pending', $6, $7, $8, $9)`,
      [
        subscriptionId,
        req.user.id,
        PLANS[plan].prix,
        plan,
        methode,
        reference_mm.trim(),
        telephone_mm.trim(),
        dateDebut.toISOString().split('T')[0],
        dateFin.toISOString().split('T')[0],
      ]
    );

    // Notification admin
    await client.query(
      `INSERT INTO notifications (user_id, titre, message, type)
       SELECT id, 'Nouveau paiement à confirmer', $1, 'payment'
       FROM users WHERE role = 'admin'`,
      [`Paiement ${PLANS[plan].nom} reçu de ${req.user.nom} — Réf: ${reference_mm} via ${methode}`]
    );

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Demande d\'abonnement soumise avec succès. Votre accès sera activé dans les 24h après vérification du paiement.',
      subscription_id: subscriptionId,
      status: 'pending',
      plan: { ...PLANS[plan], id: plan },
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[Subscription Request]', err.message);
    res.status(500).json({ error: 'Erreur lors de la soumission.' });
  } finally {
    client.release();
  }
});

// ============================================================
// GET /api/subscriptions/history — Historique paiements
// ============================================================
router.get('/history', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, s.plan, s.status as sub_status
       FROM payments p
       JOIN subscriptions s ON s.id = p.subscription_id
       WHERE p.user_id = $1
       ORDER BY p.created_at DESC
       LIMIT 20`,
      [req.user.id]
    );

    res.json({ payments: result.rows });
  } catch (err) {
    console.error('[Payment History]', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ============================================================
// ADMIN — Confirmer un paiement
// POST /api/subscriptions/admin/confirm/:paymentId
// ============================================================
router.post('/admin/confirm/:paymentId', requireAuth, requireAdmin, async (req, res) => {
  const { paymentId } = req.params;
  const { note } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Récupérer le paiement
    const payResult = await client.query(
      'SELECT * FROM payments WHERE id = $1',
      [paymentId]
    );
    if (!payResult.rows.length) {
      return res.status(404).json({ error: 'Paiement introuvable.' });
    }
    const payment = payResult.rows[0];

    if (payment.status === 'confirmed') {
      return res.status(409).json({ error: 'Ce paiement est déjà confirmé.' });
    }

    // Confirmer le paiement
    await client.query(
      `UPDATE payments SET status = 'confirmed', confirme_par = $1, confirme_le = NOW(), note_admin = $2
       WHERE id = $3`,
      [req.user.id, note || null, paymentId]
    );

    // Activer l'abonnement
    await client.query(
      `UPDATE subscriptions SET status = 'active'
       WHERE id = $1`,
      [payment.subscription_id]
    );

    // Désactiver les anciens abonnements du même utilisateur
    await client.query(
      `UPDATE subscriptions SET status = 'expired'
       WHERE user_id = $1 AND id != $2 AND status IN ('active', 'trial')`,
      [payment.user_id, payment.subscription_id]
    );

    // Notifier l'enseignant
    const planInfo = PLANS[payment.plan];
    await client.query(
      `INSERT INTO notifications (user_id, titre, message, type)
       VALUES ($1, 'Abonnement activé !', $2, 'success')`,
      [
        payment.user_id,
        `Votre abonnement ${planInfo?.nom || payment.plan} a été activé. Bon travail !`,
      ]
    );

    // Email de confirmation (non bloquant)
    pool.query(`SELECT u.email, u.nom, u.prenoms, s.date_fin, s.plan
      FROM users u JOIN subscriptions s ON s.id = $1 WHERE u.id = $2`,
      [payment.subscription_id, payment.user_id])
      .then(ur => {
        if (ur.rows.length) {
          emailService.sendActivation(ur.rows[0], ur.rows[0].plan, ur.rows[0].date_fin).catch(() => {});
        }
      }).catch(() => {});

    await client.query('COMMIT');

    res.json({
      message: 'Paiement confirmé et abonnement activé.',
      subscription_id: payment.subscription_id,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[Confirm Payment]', err.message);
    res.status(500).json({ error: 'Erreur lors de la confirmation.' });
  } finally {
    client.release();
  }
});

// ============================================================
// ADMIN — Rejeter un paiement
// POST /api/subscriptions/admin/reject/:paymentId
// ============================================================
router.post('/admin/reject/:paymentId', requireAuth, requireAdmin, async (req, res) => {
  const { paymentId } = req.params;
  const { raison } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const payResult = await client.query('SELECT * FROM payments WHERE id = $1', [paymentId]);
    if (!payResult.rows.length) {
      return res.status(404).json({ error: 'Paiement introuvable.' });
    }
    const payment = payResult.rows[0];

    await client.query(
      `UPDATE payments SET status = 'rejected', confirme_par = $1, confirme_le = NOW(), note_admin = $2
       WHERE id = $3`,
      [req.user.id, raison || 'Référence non vérifiable', paymentId]
    );

    await client.query(
      `UPDATE subscriptions SET status = 'cancelled' WHERE id = $1`,
      [payment.subscription_id]
    );

    await client.query(
      `INSERT INTO notifications (user_id, titre, message, type)
       VALUES ($1, 'Paiement non confirmé', $2, 'warning')`,
      [
        payment.user_id,
        `Votre paiement (réf. ${payment.reference_mm}) n'a pas pu être vérifié. Raison : ${raison || 'Référence introuvable'}. Contactez-nous.`,
      ]
    );

    await client.query('COMMIT');
    res.json({ message: 'Paiement rejeté.' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[Reject Payment]', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  } finally {
    client.release();
  }
});

// ============================================================
// ADMIN — Liste des paiements en attente
// ============================================================
router.get('/admin/pending', requireAuth, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.nom, u.prenoms, u.email, u.telephone
       FROM payments p
       JOIN users u ON u.id = p.user_id
       WHERE p.status = 'pending'
       ORDER BY p.created_at ASC`
    );
    res.json({ payments: result.rows, total: result.rows.length });
  } catch (err) {
    console.error('[Pending Payments]', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

module.exports = router;