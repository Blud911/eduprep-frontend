const nodemailer = require('nodemailer');

// ============================================================
// CONFIGURATION TRANSPORTEUR BREVO
// ============================================================
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Vérification de la connexion au démarrage
transporter.verify().then(() => {
  console.log('[Email] Connexion Brevo SMTP établie');
}).catch(err => {
  console.warn('[Email] SMTP non configuré :', err.message);
});

// ============================================================
// TEMPLATE HTML DE BASE
// ============================================================
const baseTemplate = (content) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EduPrep CI</title>
</head>
<body style="margin:0;padding:0;background:#F1F8E9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F8E9;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(27,94,32,0.1);">
        
        <!-- HEADER -->
        <tr>
          <td style="background:linear-gradient(135deg,#1B5E20,#2E7D32);padding:28px 32px;text-align:center;">
            <div style="display:inline-flex;align-items:center;gap:10px;">
              <div style="width:36px;height:36px;background:#F9A825;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:inline-block;"></div>
              <span style="font-size:22px;font-weight:700;color:#ffffff;font-family:Georgia,serif;margin-left:8px;">EduPrep CI</span>
            </div>
            <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:6px 0 0;">Plateforme pédagogique pour enseignants ivoiriens</p>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:32px;">
            ${content}
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#F1F8E9;padding:20px 32px;text-align:center;border-top:1px solid #C8E6C9;">
            <p style="font-size:12px;color:#757575;margin:0;">
              © 2026 EduPrep CI · NexeraSecurité · Abidjan, Côte d'Ivoire
            </p>
            <p style="font-size:11px;color:#9E9E9E;margin:4px 0 0;">
              Programme MENA officiel · Powered by Mistral AI
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

// ============================================================
// TEMPLATES PAR TYPE D'EMAIL
// ============================================================

const templates = {

  // Expiration J-3
  expiration_j3: (nom, dateExpiration, plan) => baseTemplate(`
    <h2 style="color:#1B5E20;font-family:Georgia,serif;margin:0 0 16px;">Bonjour ${nom},</h2>
    <p style="color:#4A4A4A;font-size:15px;line-height:1.7;margin:0 0 20px;">
      Votre abonnement <strong style="color:#1B5E20;">${plan}</strong> arrive à expiration dans <strong>3 jours</strong>, le <strong>${dateExpiration}</strong>.
    </p>
    <div style="background:#FFF8E1;border:1px solid #FFD54F;border-radius:12px;padding:20px;margin:0 0 24px;">
      <p style="margin:0;color:#F57F17;font-size:14px;">
        ⚠️ Après cette date, vous ne pourrez plus générer de fiches ou de devoirs jusqu'au renouvellement.
        Vos préparations sauvegardées resteront accessibles.
      </p>
    </div>
    <p style="color:#4A4A4A;font-size:14px;line-height:1.7;margin:0 0 24px;">
      Pour renouveler, connectez-vous à l'application et rendez-vous dans l'onglet <strong>Abonnement</strong>.
      Paiement accepté via <strong>Wave CI</strong>, <strong>Orange Money</strong> ou <strong>MTN Money</strong>.
    </p>
    <div style="text-align:center;">
      <a href="https://eduprep-frontend.netlify.app/app.html" 
         style="display:inline-block;background:#1B5E20;color:#ffffff;padding:13px 28px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;">
        Renouveler mon abonnement
      </a>
    </div>
  `),

  // Expiration J-1
  expiration_j1: (nom, dateExpiration, plan) => baseTemplate(`
    <h2 style="color:#C62828;font-family:Georgia,serif;margin:0 0 16px;">Bonjour ${nom},</h2>
    <p style="color:#4A4A4A;font-size:15px;line-height:1.7;margin:0 0 20px;">
      Votre abonnement <strong style="color:#1B5E20;">${plan}</strong> expire <strong>demain</strong>, le <strong>${dateExpiration}</strong>.
    </p>
    <div style="background:#FFEBEE;border:1px solid #EF9A9A;border-radius:12px;padding:20px;margin:0 0 24px;">
      <p style="margin:0;color:#C62828;font-size:14px;">
        🔴 Dernière chance ! Après demain, l'accès aux générations IA sera suspendu.
      </p>
    </div>
    <p style="color:#4A4A4A;font-size:14px;line-height:1.7;margin:0 0 24px;">
      Renouvelez dès maintenant pour continuer à préparer vos cours sans interruption.
    </p>
    <div style="text-align:center;">
      <a href="https://eduprep-frontend.netlify.app/app.html" 
         style="display:inline-block;background:#C62828;color:#ffffff;padding:13px 28px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;">
        Renouveler maintenant
      </a>
    </div>
  `),

  // Abonnement activé (confirmation)
  abonnement_active: (nom, plan, dateFin) => baseTemplate(`
    <h2 style="color:#1B5E20;font-family:Georgia,serif;margin:0 0 16px;">Félicitations ${nom} ! 🎉</h2>
    <p style="color:#4A4A4A;font-size:15px;line-height:1.7;margin:0 0 20px;">
      Votre abonnement <strong style="color:#1B5E20;">${plan}</strong> a été activé avec succès.
    </p>
    <div style="background:#E8F5E9;border:1px solid #A5D6A7;border-radius:12px;padding:20px;margin:0 0 24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-size:13px;color:#4A4A4A;padding:4px 0;">✅ Accès aux fiches pédagogiques</td>
        </tr>
        <tr>
          <td style="font-size:13px;color:#4A4A4A;padding:4px 0;">✅ Composition de devoirs et corrigés</td>
        </tr>
        <tr>
          <td style="font-size:13px;color:#4A4A4A;padding:4px 0;">📅 Valide jusqu'au <strong>${dateFin}</strong></td>
        </tr>
      </table>
    </div>
    <div style="text-align:center;">
      <a href="https://eduprep-frontend.netlify.app/app.html" 
         style="display:inline-block;background:#1B5E20;color:#ffffff;padding:13px 28px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;">
        Accéder à l'application
      </a>
    </div>
  `),

  // Bienvenue après inscription
  bienvenue: (nom) => baseTemplate(`
    <h2 style="color:#1B5E20;font-family:Georgia,serif;margin:0 0 16px;">Bienvenue sur EduPrep CI, ${nom} ! 👋</h2>
    <p style="color:#4A4A4A;font-size:15px;line-height:1.7;margin:0 0 20px;">
      Votre compte a été créé avec succès. Vous bénéficiez de <strong>7 jours d'essai gratuit</strong> 
      pour découvrir toutes les fonctionnalités.
    </p>
    <div style="background:#E8F5E9;border:1px solid #A5D6A7;border-radius:12px;padding:20px;margin:0 0 24px;">
      <p style="margin:0 0 10px;font-weight:600;color:#1B5E20;font-size:14px;">Ce que vous pouvez faire :</p>
      <table width="100%">
        <tr><td style="font-size:13px;color:#4A4A4A;padding:3px 0;">📋 Générer des fiches pédagogiques complètes</td></tr>
        <tr><td style="font-size:13px;color:#4A4A4A;padding:3px 0;">📝 Composer des devoirs avec corrigés</td></tr>
        <tr><td style="font-size:13px;color:#4A4A4A;padding:3px 0;">🎯 Programme officiel MENA Côte d'Ivoire</td></tr>
        <tr><td style="font-size:13px;color:#4A4A4A;padding:3px 0;">📱 Application installable sur votre téléphone</td></tr>
      </table>
    </div>
    <div style="text-align:center;">
      <a href="https://eduprep-frontend.netlify.app/app.html" 
         style="display:inline-block;background:#1B5E20;color:#ffffff;padding:13px 28px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;">
        Commencer maintenant
      </a>
    </div>
  `),

};

// ============================================================
// FONCTION D'ENVOI
// ============================================================
async function sendEmail({ to, subject, html }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('[Email] SMTP non configuré — email non envoyé à', to);
    return false;
  }
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'EduPrep CI'}" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`[Email] Envoyé à ${to} — ${info.messageId}`);
    return true;
  } catch (err) {
    console.error(`[Email] Erreur envoi à ${to} :`, err.message);
    return false;
  }
}

// ============================================================
// EXPORTS
// ============================================================
module.exports = {
  sendEmail,
  templates,

  // Helpers directs
  async sendExpiration(user, joursRestants) {
    const dateExp = new Date(user.date_fin).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
    const plan = user.plan ? (user.plan.charAt(0).toUpperCase() + user.plan.slice(1)) : 'Starter';
    const subject = joursRestants === 1
      ? '🔴 Votre abonnement EduPrep CI expire demain !'
      : `⚠️ Votre abonnement EduPrep CI expire dans ${joursRestants} jours`;
    const html = joursRestants === 1
      ? templates.expiration_j1(user.prenom_ou_nom, dateExp, plan)
      : templates.expiration_j3(user.prenom_ou_nom, dateExp, plan);
    return sendEmail({ to: user.email, subject, html });
  },

  async sendActivation(user, plan, dateFin) {
    const dateFormatee = new Date(dateFin).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
    const planNom = plan.charAt(0).toUpperCase() + plan.slice(1);
    return sendEmail({
      to: user.email,
      subject: `✅ Abonnement ${planNom} activé — EduPrep CI`,
      html: templates.abonnement_active(user.nom || user.prenom_ou_nom, planNom, dateFormatee),
    });
  },

  async sendBienvenue(user) {
    return sendEmail({
      to: user.email,
      subject: '👋 Bienvenue sur EduPrep CI — 7 jours gratuits !',
      html: templates.bienvenue(user.nom || user.prenoms || 'Enseignant(e)'),
    });
  },
};