const pool = require('../db/pool');
const { sendExpiration, sendActivation } = require('./email');

// ============================================================
// UTILITAIRES
// ============================================================
const log = (msg) => console.log(`[Cron ${new Date().toISOString()}] ${msg}`);
const logErr = (msg, err) => console.error(`[Cron ERROR ${new Date().toISOString()}] ${msg}`, err?.message || err);

// ============================================================
// JOB 1 — Notifications d'expiration (J-3 et J-1)
// Doit tourner 1x/jour à 8h00
// ============================================================
async function jobNotificationsExpiration() {
  log('Début job notifications expiration...');
  let envoyes = 0;
  let erreurs = 0;

  try {
    // Récupérer les abonnements qui expirent dans 1 ou 3 jours
    const result = await pool.query(`
      SELECT
        s.id as sub_id,
        s.user_id,
        s.plan,
        s.date_fin,
        s.status,
        u.email,
        u.nom,
        u.prenoms,
        COALESCE(u.prenoms, u.nom) as prenom_ou_nom,
        (s.date_fin::date - CURRENT_DATE) as jours_restants
      FROM subscriptions s
      JOIN users u ON u.id = s.user_id
      WHERE s.status = 'active'
        AND s.date_fin IS NOT NULL
        AND (s.date_fin::date - CURRENT_DATE) IN (1, 3)
        AND u.is_active = TRUE
      ORDER BY s.date_fin ASC
    `);

    log(`${result.rows.length} abonnements arrivent à expiration (J-1 ou J-3)`);

    for (const sub of result.rows) {
      try {
        // Vérifier qu'on n'a pas déjà envoyé cette notification aujourd'hui
        const dejaEnvoye = await pool.query(`
          SELECT id FROM notifications
          WHERE user_id = $1
            AND type = 'warning'
            AND titre LIKE '%expiration%'
            AND created_at::date = CURRENT_DATE
          LIMIT 1
        `, [sub.user_id]);

        if (dejaEnvoye.rows.length > 0) {
          log(`Notification déjà envoyée aujourd'hui pour ${sub.email} — skipped`);
          continue;
        }

        // Envoyer l'email
        const emailOk = await sendExpiration(sub, sub.jours_restants);

        // Créer la notification in-app
        const message = sub.jours_restants === 1
          ? `Votre abonnement expire demain ! Renouvelez dans l'onglet Abonnement.`
          : `Votre abonnement expire dans 3 jours (${new Date(sub.date_fin).toLocaleDateString('fr-FR')}). Pensez à renouveler.`;

        await pool.query(`
          INSERT INTO notifications (user_id, titre, message, type)
          VALUES ($1, $2, $3, 'warning')
        `, [
          sub.user_id,
          `Abonnement ${sub.plan} — expiration J-${sub.jours_restants}`,
          message,
        ]);

        log(`✓ Notifié ${sub.email} (J-${sub.jours_restants}) — email: ${emailOk ? 'ok' : 'échoué'}`);
        envoyes++;
      } catch (err) {
        logErr(`Erreur pour ${sub.email}`, err);
        erreurs++;
      }
    }

    log(`Job expiration terminé — ${envoyes} envoyés, ${erreurs} erreurs`);
    return { envoyes, erreurs };
  } catch (err) {
    logErr('Job expiration — erreur critique', err);
    return { envoyes: 0, erreurs: 1 };
  }
}

// ============================================================
// JOB 2 — Expirer les abonnements dépassés
// Doit tourner 1x/jour à 0h01
// ============================================================
async function jobExpirerAbonnements() {
  log('Début job expiration abonnements...');

  try {
    const result = await pool.query(`
      UPDATE subscriptions
      SET status = 'expired'
      WHERE status = 'active'
        AND date_fin IS NOT NULL
        AND date_fin < CURRENT_DATE
      RETURNING user_id, plan, date_fin
    `);

    if (result.rows.length > 0) {
      log(`${result.rows.length} abonnements expirés automatiquement`);

      // Notifier les utilisateurs concernés
      for (const sub of result.rows) {
        await pool.query(`
          INSERT INTO notifications (user_id, titre, message, type)
          VALUES ($1, 'Abonnement expiré', $2, 'warning')
        `, [
          sub.user_id,
          `Votre abonnement ${sub.plan} a expiré. Renouvelez dans l'onglet Abonnement pour reprendre l'accès.`,
        ]);
      }
    } else {
      log('Aucun abonnement à expirer');
    }

    return { expires: result.rows.length };
  } catch (err) {
    logErr('Job expiration abonnements', err);
    return { expires: 0, error: err.message };
  }
}

// ============================================================
// JOB 3 — Reset mensuel des compteurs de quota
// Doit tourner le 1er de chaque mois
// ============================================================
async function jobResetQuotasMensuels() {
  log('Début job reset quotas mensuels...');

  try {
    // Remettre les compteurs à 0 pour tous les abonnements actifs
    // dont la date de reset est aujourd'hui ou dépassée
    const result = await pool.query(`
      UPDATE subscriptions
      SET
        fiches_utilisees = 0,
        devoirs_utilises = 0,
        reset_date = reset_date + INTERVAL '1 month'
      WHERE status IN ('active', 'trial')
        AND reset_date IS NOT NULL
        AND reset_date <= CURRENT_DATE
      RETURNING user_id, plan, fiches_utilisees, devoirs_utilises
    `);

    log(`${result.rows.length} compteurs de quota remis à zéro`);
    return { reset: result.rows.length };
  } catch (err) {
    logErr('Job reset quotas', err);
    return { reset: 0, error: err.message };
  }
}

// ============================================================
// SCHEDULER INTERNE (sans dépendance externe)
// Utilise setInterval — compatible Render Free tier
// ============================================================
function demarrerScheduler() {
  log('Démarrage du scheduler EduPrep CI...');

  // Vérification toutes les heures
  const HEURE = 60 * 60 * 1000;
  let derniereExecution = {
    expiration: null,
    expirer: null,
    reset: null,
  };

  setInterval(async () => {
    const maintenant = new Date();
    const heure = maintenant.getHours();
    const jour = maintenant.getDate();
    const dateStr = maintenant.toDateString();

    // Job notifications expiration — tous les jours à 8h00
    if (heure === 8 && derniereExecution.expiration !== dateStr) {
      derniereExecution.expiration = dateStr;
      await jobNotificationsExpiration();
    }

    // Job expiration abonnements — tous les jours à 0h
    if (heure === 0 && derniereExecution.expirer !== dateStr) {
      derniereExecution.expirer = dateStr;
      await jobExpirerAbonnements();
    }

    // Job reset quotas — le 1er de chaque mois à 1h
    if (jour === 1 && heure === 1 && derniereExecution.reset !== dateStr) {
      derniereExecution.reset = dateStr;
      await jobResetQuotasMensuels();
    }

  }, HEURE);

  // Exécuter le job d'expiration au démarrage (pour rattraper les abonnements
  // expirés pendant un éventuel downtime du serveur Free tier)
  setTimeout(async () => {
    await jobExpirerAbonnements();
    await jobResetQuotasMensuels();
  }, 10000); // 10 secondes après le démarrage

  log('Scheduler démarré — vérification toutes les heures');
}

module.exports = {
  demarrerScheduler,
  jobNotificationsExpiration,
  jobExpirerAbonnements,
  jobResetQuotasMensuels,
};