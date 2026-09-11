// ============================================================
// routes/pdf.js
// Export PDF format DREN officiel — EduPrep CI
// ============================================================

const express = require('express');
const rateLimit = require('express-rate-limit');
const pool = require('../db/pool');
const { requireAuth } = require('../middleware/auth');
const { requireSubscription } = require('../middleware/subscription');
const { generateFichePDF, generateProgressionPDF, generateDevoirPDF, generateRemediationPDF } = require('../services/pdf');

const router = express.Router();

// FIX SEC-6 : la génération PDF (PDFKit) est synchrone et CPU-bound — elle
// bloque le thread Node unique le temps du rendu, sur un service à 0.15 CPU
// (Render Free). Contrairement aux routes IA (aiLimiter, 10/min/utilisateur),
// ces routes n'avaient jusqu'ici aucun frein dédié, seulement le budget
// partagé de globalLimiter (200 req/15min, partagé avec toutes les autres
// routes de l'utilisateur). Un seul compte pouvait donc déclencher des
// générations PDF en rafale, dégradant l'app pour tous les autres
// utilisateurs sur cet hébergement à ressources limitées.
// Chaîné APRÈS requireAuth sur chaque route (comme aiLimiter dans routes/ai.js)
// pour que req.user.id existe déjà — un montage en amont de requireAuth (via
// router.use ici) ne compterait que par IP, faute de req.user à ce stade.
const pdfLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id || req.ip,
  message: { error: 'Trop de générations PDF (20/minute). Veuillez patienter.' },
});

// ============================================================
// POST /api/pdf/fiche/:id — Export PDF d'une fiche sauvegardée
// ============================================================
router.post('/fiche/:id', requireAuth, pdfLimiter, requireSubscription, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM fiches WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (!result.rows.length) {
      return res.status(404).json({ error: 'Fiche introuvable.' });
    }

    const fiche = result.rows[0];
    const meta = {
      titre_lecon:   fiche.titre,
      matiere:       fiche.matiere,
      classe:        fiche.classe,
      duree_minutes: fiche.duree_minutes,
      type_seance:   fiche.type_seance,
      enseignant:    `${req.user.nom || ''} ${req.user.prenoms || ''}`.trim(),
      etablissement: req.body.etablissement || '',
      date:          req.body.date || new Date().toLocaleDateString('fr-FR'),
      annee_scolaire: req.body.annee_scolaire || '2025-2026',
    };

    const pdfData = {
      objectif_general:     fiche.objectif_general,
      objectifs_specifiques: fiche.objectifs_specifiques || [],
      materiel:             fiche.materiel || [],
      phases:               fiche.phases || [],
      competences:          fiche.competences || [],
      evaluation:           fiche.evaluation,
    };

    const pdfBuffer = await generateFichePDF(pdfData, meta);

    const filename = `fiche_${fiche.matiere}_${fiche.classe}_${Date.now()}.pdf`
      .replace(/[^a-zA-Z0-9_.-]/g, '_');

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error('[PDF Fiche]', err.message);
    res.status(500).json({ error: 'Erreur lors de la génération du PDF.' });
  }
});

// ============================================================
// POST /api/pdf/fiche-direct — Export PDF depuis données brutes (sans sauvegarde)
// ============================================================
router.post('/fiche-direct', requireAuth, pdfLimiter, requireSubscription, async (req, res) => {
  try {
    const { fiche, meta } = req.body;
    if (!fiche || !meta) {
      return res.status(400).json({ error: 'Données fiche et méta requises.' });
    }

    const metaComplete = {
      ...meta,
      enseignant: meta.enseignant || `${req.user.nom || ''} ${req.user.prenoms || ''}`.trim(),
    };

    const pdfBuffer = await generateFichePDF(fiche, metaComplete);

    const filename = `fiche_${(meta.matiere || 'cours').replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.pdf`;

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error('[PDF Fiche Direct]', err.message);
    res.status(500).json({ error: 'Erreur lors de la génération du PDF.' });
  }
});

// ============================================================
// POST /api/pdf/devoir/:id — Export PDF d'un devoir sauvegardé
// ============================================================
router.post('/devoir/:id', requireAuth, pdfLimiter, requireSubscription, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM devoirs WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    if (!result.rows.length) {
      return res.status(404).json({ error: 'Devoir introuvable.' });
    }

    const devoir = result.rows[0];
    const meta = {
      matiere:       devoir.matiere,
      classe:        devoir.classe,
      duree_minutes: devoir.duree_minutes || 55,
      total_points:  devoir.total_points || 20,
      coefficient:   req.body.coefficient || 1,
      etablissement: req.body.etablissement || '',
      date:          req.body.date || new Date().toLocaleDateString('fr-FR'),
    };

    const devoirData = {
      titre:     devoir.titre,
      consigne:  devoir.consigne,
      questions: devoir.questions || [],
    };

    const pdfBuffer = await generateDevoirPDF(devoirData, meta);

    const filename = `devoir_${devoir.matiere}_${devoir.classe}_${Date.now()}.pdf`
      .replace(/[^a-zA-Z0-9_.-]/g, '_');

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error('[PDF Devoir]', err.message);
    res.status(500).json({ error: 'Erreur lors de la génération du PDF.' });
  }
});

// ============================================================
// POST /api/pdf/progression — Export PDF progression annuelle
// ============================================================
router.post('/progression', requireAuth, pdfLimiter, requireSubscription, async (req, res) => {
  try {
    const { progression, meta } = req.body;
    if (!progression) {
      return res.status(400).json({ error: 'Données de progression requises.' });
    }

    const metaComplete = {
      ...meta,
      enseignant: (meta?.enseignant) || `${req.user.nom || ''} ${req.user.prenoms || ''}`.trim(),
    };

    const pdfBuffer = await generateProgressionPDF(progression, metaComplete);

    const filename = `progression_${(progression.matiere || '').replace(/[^a-zA-Z0-9]/g, '_')}_${progression.classe || ''}_${Date.now()}.pdf`;

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error('[PDF Progression]', err.message);
    res.status(500).json({ error: 'Erreur lors de la génération du PDF.' });
  }
});

// ============================================================
// POST /api/pdf/remediation — Export PDF d'une fiche de remédiation
// Ajouté le 03/08/2026. Pas de table dédiée pour la remédiation
// (comme la progression) donc export direct depuis les données brutes
// envoyées par le frontend, sur le modèle de /fiche-direct.
// ============================================================
router.post('/remediation', requireAuth, pdfLimiter, requireSubscription, async (req, res) => {
  try {
    const { remediation, meta } = req.body;
    if (!remediation || !meta) {
      return res.status(400).json({ error: 'Données de remédiation et méta requises.' });
    }

    const metaComplete = {
      ...meta,
      enseignant: meta.enseignant || `${req.user.nom || ''} ${req.user.prenoms || ''}`.trim(),
    };

    const pdfBuffer = await generateRemediationPDF(remediation, metaComplete);

    const filename = `remediation_${(meta.matiere || 'notion').replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.pdf`;

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error('[PDF Remediation]', err.message);
    res.status(500).json({ error: 'Erreur lors de la génération du PDF.' });
  }
});

module.exports = router;
