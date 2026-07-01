// ============================================================
// services/email.js
// Envoi via API Brevo (pas de restriction IP, meilleure délivrabilité)
// ============================================================

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

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
        <tr>
          <td style="background:linear-gradient(135deg,#1B5E20,#2E7D32);padding:28px 32px;text-align:center;">
            <span style="font-size:22px;font-weight:700;color:#ffffff;font-family:Georgia,serif;">🍃 EduPrep CI</span>
            <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:6px 0 0;">Plateforme pédagogique pour enseignants ivoiriens</p>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            ${content}
          </td>
        </tr>
        <tr>
          <td style="background:#F1F8E9;padding:20px 32px;text-align:center;border-top:1px solid #C8E6C9;">
            <p style="font-size:12px;color:#757575;margin:0;">© 2026 EduPrep CI · NexeraSecurité · Abidjan, Côte d'Ivoire</p>
            <p style="font-size:11px;color:#9E9E9E;margin:4px 0 0;">Programme MENA officiel · Powered by Mistral AI</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

// ============================================================
// TEMPLATES
// ============================================================
const templates = {

  verification_email: (nom, lienVerification) => baseTemplate(`
    <h2 style="color:#1B5E20;font-family:Georgia,serif;margin:0 0 16px;">Bonjour ${nom},</h2>
    <p style="color:#4A4A4A;font-size:15px;line-height:1.7;margin:0 0 20px;">
      Merci de vous être inscrit sur <strong>EduPrep CI</strong>. Pour activer votre essai gratuit de 7 jours
      et commencer à générer vos fiches pédagogiques, veuillez confirmer votre adresse email.
    </p>
    <div style="background:#E8F5E9;border:1px solid #A5D6A7;border-radius:12px;padding:20px;margin:0 0 24px;text-align:center;">
      <p style="margin:0 0 16px;color:#1B5E20;font-size:14px;font-weight:600;">🎁 5 fiches gratuites vous attendent !</p>
      <a href="${lienVerification}"
         style="display:inline-block;background:#1B5E20;color:#ffffff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:600;font-size:16px;">
        ✅ Confirmer mon email
      </a>
    </div>
    <p style="color:#9E9E9E;font-size:12px;line-height:1.6;margin:0;">
      Ce lien est valable <strong>24 heures</strong>. Si vous n'avez pas créé de compte, ignorez cet email.<br><br>
      Lien direct : <span style="color:#1B5E20;word-break:break-all;">${lienVerification}</span>
    </p>
  `),

  expiration_j3: (nom, dateExpiration, plan) => baseTemplate(`
    <h2 style="color:#1B5E20;font-family:Georgia,serif;margin:0 0 16px;">Bonjour ${nom},</h2>
    <p style="color:#4A4A4A;font-size:15px;line-height:1.7;margin:0 0 20px;">
      Votre abonnement <strong>${plan}</strong> expire dans <strong>3 jours</strong>, le <strong>${dateExpiration}</strong>.
    </p>
    <div style="background:#FFF8E1;border:1px solid #FFD54F;border-radius:12px;padding:20px;margin:0 0 24px;">
      <p style="margin:0;color:#F57F17;font-size:14px;">⚠️ Renouvelez pour continuer à préparer vos cours sans interruption.</p>
    </div>
    <div style="text-align:center;">
      <a href="${process.env.FRONTEND_URL || 'https://eduprep-frontend.pages.dev'}/app.html"
         style="display:inline-block;background:#1B5E20;color:#ffffff;padding:13px 28px;border-radius:10px;text-decoration:none;font-weight:600;">
        Renouveler mon abonnement
      </a>
    </div>
  `),

  expiration_j1: (nom, dateExpiration, plan) => baseTemplate(`
    <h2 style="color:#C62828;font-family:Georgia,serif;margin:0 0 16px;">Bonjour ${nom},</h2>
    <p style="color:#4A4A4A;font-size:15px;line-height:1.7;margin:0 0 20px;">
      Votre abonnement <strong>${plan}</strong> expire <strong>demain</strong>, le <strong>${dateExpiration}</strong>.
    </p>
    <div style="background:#FFEBEE;border:1px solid #EF9A9A;border-radius:12px;padding:20px;margin:0 0 24px;">
      <p style="margin:0;color:#C62828;font-size:14px;">🔴 Dernière chance de renouveler avant suspension de l'accès.</p>
    </div>
    <div style="text-align:center;">
      <a href="${process.env.FRONTEND_URL || 'https://eduprep-frontend.pages.dev'}/app.html"
         style="display:inline-block;background:#C62828;color:#ffffff;padding:13px 28px;border-radius:10px;text-decoration:none;font-weight:600;">
        Renouveler maintenant
      </a>
    </div>
  `),

  abonnement_active: (nom, plan, dateFin) => baseTemplate(`
    <h2 style="color:#1B5E20;font-family:Georgia,serif;margin:0 0 16px;">Félicitations ${nom} ! 🎉</h2>
    <p style="color:#4A4A4A;font-size:15px;line-height:1.7;margin:0 0 20px;">
      Votre abonnement <strong>${plan}</strong> a été activé avec succès jusqu'au <strong>${dateFin}</strong>.
    </p>
    <div style="text-align:center;">
      <a href="${process.env.FRONTEND_URL || 'https://eduprep-frontend.pages.dev'}/app.html"
         style="display:inline-block;background:#1B5E20;color:#ffffff;padding:13px 28px;border-radius:10px;text-decoration:none;font-weight:600;">
        Accéder à l'application
      </a>
    </div>
  `),

  bienvenue: (nom) => baseTemplate(`
    <h2 style="color:#1B5E20;font-family:Georgia,serif;margin:0 0 16px;">Bienvenue sur EduPrep CI, ${nom} ! 👋</h2>
    <p style="color:#4A4A4A;font-size:15px;line-height:1.7;margin:0 0 20px;">
      Votre compte a été créé avec succès. Vous bénéficiez de <strong>7 jours d'essai gratuit</strong>.
    </p>
    <div style="background:#E8F5E9;border:1px solid #A5D6A7;border-radius:12px;padding:20px;margin:0 0 24px;">
      <table width="100%">
        <tr><td style="font-size:13px;color:#4A4A4A;padding:3px 0;">📋 Fiches pédagogiques complètes</td></tr>
        <tr><td style="font-size:13px;color:#4A4A4A;padding:3px 0;">📝 Devoirs avec corrigés automatiques</td></tr>
        <tr><td style="font-size:13px;color:#4A4A4A;padding:3px 0;">🎯 Programme officiel MENA Côte d'Ivoire</td></tr>
        <tr><td style="font-size:13px;color:#4A4A4A;padding:3px 0;">📱 Application installable sur votre téléphone</td></tr>
      </table>
    </div>
    <div style="text-align:center;">
      <a href="${process.env.FRONTEND_URL || 'https://eduprep-frontend.pages.dev'}/app.html"
         style="display:inline-block;background:#1B5E20;color:#ffffff;padding:13px 28px;border-radius:10px;text-decoration:none;font-weight:600;">
        Commencer maintenant
      </a>
    </div>
  `),
};

// ============================================================
// FONCTION D'ENVOI VIA API BREVO
// ============================================================
async function sendEmail({ to, subject, html }) {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    console.warn('[Email] BREVO_API_KEY non configurée — email non envoyé à', to);
    return false;
  }

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: process.env.EMAIL_FROM_NAME || 'EduPrep CI',
          email: process.env.EMAIL_FROM || 'noreply@eduprep-ci.brevo.com',
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error(`[Email] Erreur API Brevo (${response.status}):`, err);
      return false;
    }

    const data = await response.json();
    console.log(`[Email] Envoyé à ${to} — messageId: ${data.messageId}`);
    return true;
  } catch (err) {
    console.error(`[Email] Erreur réseau envoi à ${to}:`, err.message);
    return false;
  }
}

// ============================================================
// EXPORTS
// ============================================================
module.exports = {
  sendEmail,
  templates,

  async sendVerificationEmail(user, token) {
    const backendUrl = process.env.BACKEND_URL || 'https://eduprep-backend-km19.onrender.com';
    const lien = `${backendUrl}/api/auth/verify-email/${token}`;
    return sendEmail({
      to: user.email,
      subject: '✅ Confirmez votre email — EduPrep CI',
      html: templates.verification_email(user.nom || 'Enseignant(e)', lien),
    });
  },

  async sendExpiration(user, joursRestants) {
    const dateExp = new Date(user.date_fin).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
    const plan = user.plan ? (user.plan.charAt(0).toUpperCase() + user.plan.slice(1)) : 'Starter';
    const nom = user.prenoms || user.nom || 'Enseignant(e)';
    const subject = joursRestants === 1
      ? '🔴 Votre abonnement EduPrep CI expire demain !'
      : `⚠️ Votre abonnement EduPrep CI expire dans ${joursRestants} jours`;
    const html = joursRestants === 1
      ? templates.expiration_j1(nom, dateExp, plan)
      : templates.expiration_j3(nom, dateExp, plan);
    return sendEmail({ to: user.email, subject, html });
  },

  async sendActivation(user, plan, dateFin) {
    const dateFormatee = new Date(dateFin).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
    const planNom = plan.charAt(0).toUpperCase() + plan.slice(1);
    return sendEmail({
      to: user.email,
      subject: `✅ Abonnement ${planNom} activé — EduPrep CI`,
      html: templates.abonnement_active(user.nom || 'Enseignant(e)', planNom, dateFormatee),
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