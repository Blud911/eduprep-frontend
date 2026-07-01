const express = require('express');
const pool = require('../db/pool');
const { requireAuth } = require('../middleware/auth');
const { requireSubscription } = require('../middleware/subscription');

const router = express.Router();

// ============================================================
// FICHES
// ============================================================

// Lister mes fiches
router.get('/fiches', requireAuth, async (req, res) => {
  const { matiere, classe, search, favoris, page = 1, limit = 20 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    const conditions = ['f.user_id = $1'];
    const values = [req.user.id];
    let idx = 2;

    if (matiere) { conditions.push(`f.matiere = $${idx++}`); values.push(matiere); }
    if (classe) { conditions.push(`f.classe = $${idx++}`); values.push(classe); }
    if (favoris === 'true') { conditions.push(`f.is_favoris = TRUE`); }
    if (search) {
      conditions.push(`(f.titre ILIKE $${idx} OR f.objectif_general ILIKE $${idx})`);
      values.push(`%${search}%`);
      idx++;
    }

    const whereClause = conditions.join(' AND ');
    values.push(parseInt(limit), offset);

    const result = await pool.query(
      `SELECT f.id, f.titre, f.matiere, f.classe, f.type_seance, f.duree_minutes,
              f.objectif_general, f.is_favoris, f.tags, f.created_at, f.updated_at
       FROM fiches f
       WHERE ${whereClause}
       ORDER BY f.updated_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      values
    );

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM fiches f WHERE ${conditions.join(' AND ')}`,
      values.slice(0, -2)
    );

    res.json({
      fiches: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    console.error('[List Fiches]', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Récupérer une fiche
router.get('/fiches/:id', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM fiches WHERE id = $1 AND (user_id = $2 OR is_public = TRUE)',
      [req.params.id, req.user.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Fiche introuvable.' });
    res.json({ fiche: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Sauvegarder une fiche (après génération IA)
router.post('/fiches', requireAuth, requireSubscription, async (req, res) => {
  const {
    titre, matiere, classe, cycle, type_seance, duree_minutes,
    objectif_general, objectifs_specifiques, prerequis, materiel,
    phases, competences, evaluation, prolongements, points_cles,
    erreurs_courantes, corrige, tags, programme_id,
  } = req.body;

  if (!titre || !matiere) {
    return res.status(400).json({ error: 'Titre et matière sont requis.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO fiches
         (user_id, programme_id, titre, matiere, classe, cycle, type_seance, duree_minutes,
          objectif_general, objectifs_specifiques, prerequis, materiel, phases, competences,
          evaluation, prolongements, corrige, tags)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
       RETURNING id, titre, created_at`,
      [
        req.user.id, programme_id || null, titre, matiere, classe || null,
        cycle || null, type_seance || 'decouverte', duree_minutes || 55,
        objectif_general || null, objectifs_specifiques || [],
        prerequis || [], materiel || [],
        phases ? JSON.stringify(phases) : null,
        competences || [], evaluation || null, prolongements || [],
        corrige ? JSON.stringify(corrige) : null, tags || [],
      ]
    );

    res.status(201).json({ message: 'Fiche sauvegardée.', fiche: result.rows[0] });
  } catch (err) {
    console.error('[Save Fiche]', err.message);
    res.status(500).json({ error: 'Erreur lors de la sauvegarde.' });
  }
});

// Mettre à jour une fiche
router.put('/fiches/:id', requireAuth, async (req, res) => {
  const allowed = ['titre', 'type_seance', 'duree_minutes', 'objectif_general',
    'objectifs_specifiques', 'prerequis', 'materiel', 'phases', 'competences',
    'evaluation', 'prolongements', 'corrige', 'tags', 'is_favoris'];

  try {
    const updates = [];
    const values = [];
    let idx = 1;

    for (const field of allowed) {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = $${idx++}`);
        const val = req.body[field];
        values.push(typeof val === 'object' && !Array.isArray(val) ? JSON.stringify(val) : val);
      }
    }

    if (!updates.length) return res.status(400).json({ error: 'Aucune modification.' });

    values.push(req.params.id, req.user.id);
    const result = await pool.query(
      `UPDATE fiches SET ${updates.join(', ')} WHERE id = $${idx} AND user_id = $${idx + 1} RETURNING id`,
      values
    );

    if (!result.rows.length) return res.status(404).json({ error: 'Fiche introuvable.' });
    res.json({ message: 'Fiche mise à jour.' });
  } catch (err) {
    console.error('[Update Fiche]', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Supprimer une fiche
router.delete('/fiches/:id', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM fiches WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Fiche introuvable.' });
    res.json({ message: 'Fiche supprimée.' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ============================================================
// DEVOIRS
// ============================================================

router.get('/devoirs', requireAuth, async (req, res) => {
  const { matiere, classe, type_eval, page = 1, limit = 20 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    const conditions = ['d.user_id = $1'];
    const values = [req.user.id];
    let idx = 2;

    if (matiere) { conditions.push(`d.matiere = $${idx++}`); values.push(matiere); }
    if (classe) { conditions.push(`d.classe = $${idx++}`); values.push(classe); }
    if (type_eval) { conditions.push(`d.type_eval = $${idx++}`); values.push(type_eval); }

    values.push(parseInt(limit), offset);

    const result = await pool.query(
      `SELECT d.id, d.titre, d.matiere, d.classe, d.type_eval, d.duree_minutes,
              d.total_points, d.is_favoris, d.tags, d.created_at,
              jsonb_array_length(d.questions) as nb_questions,
              (d.corrige_complet IS NOT NULL) as a_corrige,
              (d.variante_faible IS NOT NULL) as a_variantes
       FROM devoirs d
       WHERE ${conditions.join(' AND ')}
       ORDER BY d.updated_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      values
    );

    res.json({ devoirs: result.rows });
  } catch (err) {
    console.error('[List Devoirs]', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.get('/devoirs/:id', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM devoirs WHERE id = $1 AND (user_id = $2 OR is_public = TRUE)',
      [req.params.id, req.user.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Devoir introuvable.' });
    res.json({ devoir: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.post('/devoirs', requireAuth, requireSubscription, async (req, res) => {
  const {
    titre, matiere, classe, type_eval, duree_minutes, total_points,
    consigne, questions, variante_faible, variante_fort, corrige_complet, tags, fiche_id,
  } = req.body;

  if (!titre || !matiere || !questions) {
    return res.status(400).json({ error: 'Titre, matière et questions sont requis.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO devoirs
         (user_id, fiche_id, titre, matiere, classe, type_eval, duree_minutes, total_points,
          consigne, questions, variante_faible, variante_fort, corrige_complet, tags)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       RETURNING id, titre, created_at`,
      [
        req.user.id, fiche_id || null, titre, matiere, classe || null,
        type_eval || 'devoir', duree_minutes || 55, total_points || 20,
        consigne || null, JSON.stringify(questions),
        variante_faible ? JSON.stringify(variante_faible) : null,
        variante_fort ? JSON.stringify(variante_fort) : null,
        corrige_complet ? JSON.stringify(corrige_complet) : null,
        tags || [],
      ]
    );

    // Ajouter les questions à la banque
    if (Array.isArray(questions) && questions.length > 0) {
      for (const q of questions) {
        await pool.query(
          `INSERT INTO banque_questions
             (user_id, devoir_id, matiere, classe, type_q, niveau_taxo, enonce, points, bareme, reponse)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
          [
            req.user.id, result.rows[0].id, matiere, classe || null,
            q.type || null, q.niveau || null, q.enonce,
            q.points || null, q.bareme || null, q.reponse || null,
          ]
        ).catch(() => {});
      }
    }

    res.status(201).json({ message: 'Devoir sauvegardé.', devoir: result.rows[0] });
  } catch (err) {
    console.error('[Save Devoir]', err.message);
    res.status(500).json({ error: 'Erreur lors de la sauvegarde.' });
  }
});

router.delete('/devoirs/:id', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM devoirs WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Devoir introuvable.' });
    res.json({ message: 'Devoir supprimé.' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// ============================================================
// BANQUE DE QUESTIONS
// ============================================================

router.get('/banque', requireAuth, async (req, res) => {
  const { matiere, classe, type_q, niveau_taxo, search, page = 1, limit = 30 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    const conditions = ['(bq.user_id = $1 OR bq.is_public = TRUE)'];
    const values = [req.user.id];
    let idx = 2;

    if (matiere) { conditions.push(`bq.matiere = $${idx++}`); values.push(matiere); }
    if (classe) { conditions.push(`bq.classe = $${idx++}`); values.push(classe); }
    if (type_q) { conditions.push(`bq.type_q = $${idx++}`); values.push(type_q); }
    if (niveau_taxo) { conditions.push(`bq.niveau_taxo = $${idx++}`); values.push(niveau_taxo); }
    if (search) {
      conditions.push(`bq.enonce ILIKE $${idx++}`);
      values.push(`%${search}%`);
    }

    values.push(parseInt(limit), offset);

    const result = await pool.query(
      `SELECT bq.id, bq.matiere, bq.classe, bq.type_q, bq.niveau_taxo,
              bq.enonce, bq.points, bq.bareme, bq.tags, bq.nb_usages, bq.created_at,
              (bq.user_id = $1) as is_mine
       FROM banque_questions bq
       WHERE ${conditions.join(' AND ')}
       ORDER BY bq.nb_usages DESC, bq.created_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      values
    );

    res.json({ questions: result.rows });
  } catch (err) {
    console.error('[Banque Questions]', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// Notifications
router.get('/notifications', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20',
      [req.user.id]
    );
    const unread = result.rows.filter(n => !n.lu).length;
    res.json({ notifications: result.rows, unread });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

router.patch('/notifications/:id/read', requireAuth, async (req, res) => {
  try {
    await pool.query(
      'UPDATE notifications SET lu = TRUE WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    res.json({ message: 'Notification marquée comme lue.' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

module.exports = router;
