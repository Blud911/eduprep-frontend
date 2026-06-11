const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const pool = require('../db/pool');
const { requireAuth } = require('../middleware/auth');
const {
  requireSubscription,
  checkFicheQuota,
  checkDevoirQuota,
  incrementFicheUsage,
  incrementDevoirUsage,
} = require('../middleware/subscription');

const router = express.Router();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MODEL = 'claude-opus-4-6';
const MAX_TOKENS = 2000;

// Log une génération IA en base
const logGeneration = async (userId, subId, type, matiere, classe, titre, tokensIn, tokensOut, latence, success, errorMsg = null) => {
  try {
    await pool.query(
      `INSERT INTO generation_logs
         (user_id, subscription_id, type_gen, matiere, classe, titre, tokens_input, tokens_output, latence_ms, success, error_msg)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [userId, subId || null, type, matiere, classe, titre, tokensIn, tokensOut, latence, success, errorMsg]
    );
  } catch (e) {
    console.error('[Log Gen]', e.message);
  }
};

// Récupérer les éléments du programme MENA si disponible
const getProgrammeContext = async (matiere, classe) => {
  try {
    const result = await pool.query(
      `SELECT titre, objectifs, notions_cles FROM programmes_mena
       WHERE LOWER(matiere) = LOWER($1) AND classe = $2 AND is_active = TRUE
       ORDER BY sequence ASC LIMIT 10`,
      [matiere, classe]
    );
    if (!result.rows.length) return '';

    const chapitres = result.rows.map(r =>
      `- ${r.titre} (notions: ${(r.notions_cles || []).join(', ')})`
    ).join('\n');

    return `\n\nPROGRAMME MENA OFFICIEL pour ${matiere} en ${classe}:\n${chapitres}`;
  } catch (e) {
    return '';
  }
};

// ============================================================
// POST /api/ai/fiche — Génère une fiche de préparation
// ============================================================
router.post('/fiche', requireAuth, requireSubscription, checkFicheQuota, async (req, res) => {
  const { matiere, classe, titre_lecon, duree_minutes, type_seance, prerequis, cycle } = req.body;

  if (!matiere || !titre_lecon) {
    return res.status(400).json({ error: 'Matière et titre de la leçon sont requis.' });
  }

  const start = Date.now();
  const programmeCtx = await getProgrammeContext(matiere, classe);

  const prompt = `Tu es un conseiller pédagogique expert du système éducatif de Côte d'Ivoire (programme officiel MENA/DREN).

Génère une fiche de préparation de cours complète et rigoureuse pour :
- Matière : ${matiere}
- Classe : ${classe || 'non précisée'}
- Cycle : ${cycle || 'non précisé'}
- Titre de la leçon : ${titre_lecon}
- Durée : ${duree_minutes || 55} minutes
- Type de séance : ${type_seance || 'découverte'}
${prerequis ? `- Contexte / prérequis : ${prerequis}` : ''}
${programmeCtx}

Réponds UNIQUEMENT en JSON valide strict, sans balises markdown, selon ce schéma :
{
  "objectif_general": "Phrase claire commençant par un verbe d'action",
  "objectifs_specifiques": ["Au terme de la leçon, l'élève sera capable de...", "..."],
  "prerequis": ["Ce que les élèves doivent déjà savoir..."],
  "materiel": ["Tableau", "Manuel", "..."],
  "phases": [
    {
      "nom": "Mise en situation",
      "duree": "X min",
      "desc": "Description détaillée de l'activité enseignant/élèves",
      "methode": "Méthode pédagogique utilisée",
      "role_enseignant": "Ce que fait l'enseignant",
      "role_eleve": "Ce que fait l'élève"
    }
  ],
  "competences": ["Compétence visée 1", "..."],
  "evaluation": "Description précise de l'évaluation formative (questions posées, exercice à faire)",
  "prolongements": ["Activité pour les élèves avancés", "Exercice de remédiation"],
  "points_cles": ["Notion fondamentale 1", "..."],
  "erreurs_courantes": ["Erreur fréquente des élèves à anticiper"]
}`;

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      messages: [{ role: 'user', content: prompt }],
    });

    const latence = Date.now() - start;
    const rawText = response.content.map(b => b.text || '').join('');
    const clean = rawText.replace(/```json|```/g, '').trim();
    const data = JSON.parse(clean);

    await incrementFicheUsage(req.user.id);
    await logGeneration(
      req.user.id, req.subscription?.id, 'fiche', matiere, classe, titre_lecon,
      response.usage?.input_tokens, response.usage?.output_tokens, latence, true
    );

    res.json({ fiche: data, usage: response.usage });
  } catch (err) {
    const latence = Date.now() - start;
    await logGeneration(req.user.id, req.subscription?.id, 'fiche', matiere, classe, titre_lecon, 0, 0, latence, false, err.message);
    console.error('[AI Fiche]', err.message);
    res.status(500).json({ error: 'Erreur lors de la génération de la fiche. Réessayez.' });
  }
});

// ============================================================
// POST /api/ai/devoir — Génère un devoir avec corrigé + variantes
// ============================================================
router.post('/devoir', requireAuth, requireSubscription, checkDevoirQuota, async (req, res) => {
  const {
    matiere, classe, titre_lecon, type_eval, duree_minutes,
    total_points, niveaux_taxonomiques, avec_variantes, avec_corrige,
  } = req.body;

  if (!matiere || !titre_lecon) {
    return res.status(400).json({ error: 'Matière et thème sont requis.' });
  }

  const start = Date.now();
  const programmeCtx = await getProgrammeContext(matiere, classe);

  const niveaux = niveaux_taxonomiques || ['connaissance', 'compréhension', 'application'];
  const nbQuestions = Math.min(Math.max(4, Math.ceil((duree_minutes || 55) / 10)), 8);

  const prompt = `Tu es un professeur expert du système éducatif ivoirien (programme MENA/DREN), spécialiste de l'évaluation pédagogique.

Compose un ${type_eval || 'devoir surveillé'} complet pour :
- Matière : ${matiere}
- Classe : ${classe || 'non précisée'}
- Thème évalué : ${titre_lecon}
- Durée : ${duree_minutes || 55} minutes
- Total : ${total_points || 20} points
- Niveaux taxonomiques : ${niveaux.join(', ')}
- Nombre de questions : ${nbQuestions}
${programmeCtx}

Génère des questions progressives, bien équilibrées entre les niveaux.
${avec_corrige !== false ? 'Inclure le corrigé détaillé pour chaque question.' : ''}
${avec_variantes ? 'Inclure des variantes pour niveaux faible et fort.' : ''}

Réponds UNIQUEMENT en JSON valide strict, sans balises markdown :
{
  "titre": "Titre officiel de l'épreuve",
  "consigne": "Consigne générale claire pour les élèves",
  "questions": [
    {
      "numero": 1,
      "type": "QCM|Vrai/Faux|Question ouverte|Exercice|Problème",
      "enonce": "Texte complet de la question",
      "points": 2,
      "niveau": "connaissance|compréhension|application|analyse",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "bareme": "Critère de notation précis",
      "reponse": "Réponse attendue ou corrigé détaillé"
    }
  ],
  "consignes_correction": "Instructions générales pour la correction",
  ${avec_variantes ? `
  "variante_faible": {
    "note": "Adaptations pour les élèves en difficulté",
    "questions_adaptees": [{"numero": 1, "enonce": "Version simplifiée"}]
  },
  "variante_fort": {
    "note": "Enrichissements pour les élèves avancés",
    "questions_bonus": [{"numero": 1, "enonce": "Question supplémentaire", "points": 2}]
  },` : ''}
  "grille_evaluation": {"criteres": ["Exactitude", "Rédaction", "Méthode"]}
}`;

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      messages: [{ role: 'user', content: prompt }],
    });

    const latence = Date.now() - start;
    const rawText = response.content.map(b => b.text || '').join('');
    const clean = rawText.replace(/```json|```/g, '').trim();
    const data = JSON.parse(clean);

    await incrementDevoirUsage(req.user.id);
    await logGeneration(
      req.user.id, req.subscription?.id, 'devoir', matiere, classe, titre_lecon,
      response.usage?.input_tokens, response.usage?.output_tokens, latence, true
    );

    res.json({ devoir: data, usage: response.usage });
  } catch (err) {
    const latence = Date.now() - start;
    await logGeneration(req.user.id, req.subscription?.id, 'devoir', matiere, classe, titre_lecon, 0, 0, latence, false, err.message);
    console.error('[AI Devoir]', err.message);
    res.status(500).json({ error: 'Erreur lors de la génération du devoir.' });
  }
});

// ============================================================
// POST /api/ai/corrige — Génère le corrigé d'un devoir existant
// ============================================================
router.post('/corrige', requireAuth, requireSubscription, async (req, res) => {
  const { devoir_id } = req.body;
  if (!devoir_id) return res.status(400).json({ error: 'ID du devoir requis.' });

  const start = Date.now();
  try {
    const devoirResult = await pool.query(
      'SELECT * FROM devoirs WHERE id = $1 AND user_id = $2',
      [devoir_id, req.user.id]
    );
    if (!devoirResult.rows.length) {
      return res.status(404).json({ error: 'Devoir introuvable.' });
    }
    const devoir = devoirResult.rows[0];

    const prompt = `Tu es un professeur correcteur expert en ${devoir.matiere} pour la ${devoir.classe} en Côte d'Ivoire.

Voici un devoir :
Titre : ${devoir.titre}
Questions : ${JSON.stringify(devoir.questions)}

Génère le corrigé complet et détaillé de ce devoir.

Réponds UNIQUEMENT en JSON valide :
{
  "corrige_questions": [
    {
      "numero": 1,
      "reponse_complete": "Réponse complète et détaillée",
      "points_criteres": ["Critère 1 : X pts", "Critère 2 : Y pts"],
      "erreurs_frequentes": "Erreurs courantes à anticiper lors de la correction",
      "conseil_prof": "Conseil pour le correcteur"
    }
  ],
  "grille_correction": "Instructions générales pour corriger",
  "temps_correction_estime": "X minutes"
}`;

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      messages: [{ role: 'user', content: prompt }],
    });

    const latence = Date.now() - start;
    const rawText = response.content.map(b => b.text || '').join('');
    const clean = rawText.replace(/```json|```/g, '').trim();
    const corrige = JSON.parse(clean);

    // Sauvegarder le corrigé
    await pool.query(
      'UPDATE devoirs SET corrige_complet = $1 WHERE id = $2',
      [JSON.stringify(corrige), devoir_id]
    );

    await logGeneration(
      req.user.id, null, 'corrige', devoir.matiere, devoir.classe, devoir.titre,
      response.usage?.input_tokens, response.usage?.output_tokens, latence, true
    );

    res.json({ corrige });
  } catch (err) {
    console.error('[AI Corrigé]', err.message);
    res.status(500).json({ error: 'Erreur lors de la génération du corrigé.' });
  }
});

// ============================================================
// POST /api/ai/variantes — Génère les variantes différenciées
// ============================================================
router.post('/variantes', requireAuth, requireSubscription, async (req, res) => {
  const { devoir_id } = req.body;
  if (!devoir_id) return res.status(400).json({ error: 'ID du devoir requis.' });

  const start = Date.now();
  try {
    const devoirResult = await pool.query(
      'SELECT * FROM devoirs WHERE id = $1 AND user_id = $2',
      [devoir_id, req.user.id]
    );
    if (!devoirResult.rows.length) {
      return res.status(404).json({ error: 'Devoir introuvable.' });
    }
    const devoir = devoirResult.rows[0];

    const prompt = `Tu es un pédagogue spécialiste de la différenciation pédagogique en ${devoir.matiere} pour la ${devoir.classe} ivoirienne.

Voici un devoir standard :
${JSON.stringify(devoir.questions)}

Génère deux variantes adaptées selon les niveaux des élèves.

Réponds UNIQUEMENT en JSON valide :
{
  "variante_faible": {
    "description": "Adaptations réalisées pour les élèves en difficulté",
    "questions": [
      {
        "numero": 1,
        "enonce": "Version simplifiée ou avec aide supplémentaire",
        "aide": "Amorce ou indication donnée à l'élève",
        "points": 2
      }
    ]
  },
  "variante_fort": {
    "description": "Enrichissements pour les élèves avancés",
    "questions": [
      {
        "numero": 1,
        "enonce": "Version enrichie ou étendue",
        "extension": "Réflexion supplémentaire demandée",
        "points": 2
      }
    ],
    "questions_bonus": [
      {
        "enonce": "Question bonus de synthèse ou d'approfondissement",
        "points": 2
      }
    ]
  }
}`;

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      messages: [{ role: 'user', content: prompt }],
    });

    const latence = Date.now() - start;
    const rawText = response.content.map(b => b.text || '').join('');
    const clean = rawText.replace(/```json|```/g, '').trim();
    const variantes = JSON.parse(clean);

    // Sauvegarder
    await pool.query(
      'UPDATE devoirs SET variante_faible = $1, variante_fort = $2 WHERE id = $3',
      [JSON.stringify(variantes.variante_faible), JSON.stringify(variantes.variante_fort), devoir_id]
    );

    await logGeneration(
      req.user.id, null, 'variante', devoir.matiere, devoir.classe, devoir.titre,
      response.usage?.input_tokens, response.usage?.output_tokens, latence, true
    );

    res.json({ variantes });
  } catch (err) {
    console.error('[AI Variantes]', err.message);
    res.status(500).json({ error: 'Erreur lors de la génération des variantes.' });
  }
});

// ============================================================
// POST /api/ai/demo — Route publique pour la démo (sans auth)
// Rate limit très strict : 3 req/heure par IP
// ============================================================
const demoLimiter = require('express-rate-limit')({
  windowMs: 60 * 60 * 1000,
  max: 3,
  keyGenerator: (req) => req.ip,
  message: { error: 'Limite de démo atteinte (3/heure). Créez un compte pour un accès illimité.' },
});

router.post('/demo', demoLimiter, async (req, res) => {
  const { type, matiere, classe, titre, duree, type_eval } = req.body;

  if (!matiere || !titre) {
    return res.status(400).json({ error: 'Matière et titre requis.' });
  }

  const start = Date.now();

  let prompt;
  if (type === 'devoir') {
    prompt = `Tu es un professeur expert du programme ivoirien MENA.
Compose un ${type_eval || 'devoir surveillé'} court (démo — 4 questions) pour :
- Matière : ${matiere} - Classe : ${classe || 'non précisée'} - Thème : ${titre}

Réponds en JSON strict sans markdown :
{"titre":"...","consigne":"...","questions":[
  {"numero":1,"type":"QCM","enonce":"...","points":2,"options":["A) ...","B) ...","C) ..."],"reponse":"A"},
  {"numero":2,"type":"Vrai/Faux","enonce":"...","points":1,"reponse":"Vrai"},
  {"numero":3,"type":"Question ouverte","enonce":"...","points":4,"bareme":"..."},
  {"numero":4,"type":"Exercice","enonce":"...","points":3,"bareme":"..."}
]}`;
  } else {
    prompt = `Tu es un conseiller pédagogique expert du programme MENA de Côte d'Ivoire.
Génère une fiche de préparation courte (résumé démo) pour :
- Matière : ${matiere} - Classe : ${classe || 'non précisée'} - Leçon : ${titre} - Durée : ${duree || 55} min

Réponds en JSON strict sans markdown :
{"objectif_general":"...","objectifs_specifiques":["...","...","..."],"phases":[
  {"nom":"Mise en situation","duree":"10 min","desc":"..."},
  {"nom":"Développement","duree":"${(parseInt(duree) || 55) - 20} min","desc":"..."},
  {"nom":"Synthèse et évaluation","duree":"10 min","desc":"..."}
],"evaluation":"..."}`;
  }

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }],
    });

    const latence = Date.now() - start;
    const rawText = response.content.map(b => b.text || '').join('');
    const clean = rawText.replace(/```json|```/g, '').trim();
    const data = JSON.parse(clean);

    await logGeneration(null, null, `demo_${type||'fiche'}`, matiere, classe, titre,
      response.usage?.input_tokens, response.usage?.output_tokens, latence, true);

    res.json({ data, type: type || 'fiche' });
  } catch (err) {
    console.error('[AI Demo]', err.message);
    res.status(500).json({ error: 'Erreur de génération. Réessayez dans quelques instants.' });
  }
});

module.exports = router;