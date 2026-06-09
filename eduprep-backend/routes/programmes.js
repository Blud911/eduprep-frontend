const express = require('express');
const pool = require('../db/pool');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/programmes — Recherche dans le référentiel MENA
router.get('/', requireAuth, async (req, res) => {
  const { matiere, classe, cycle, search } = req.query;

  try {
    const conditions = ['is_active = TRUE'];
    const values = [];
    let idx = 1;

    if (cycle) { conditions.push(`cycle = $${idx++}`); values.push(cycle); }
    if (classe) { conditions.push(`classe = $${idx++}`); values.push(classe); }
    if (matiere) { conditions.push(`LOWER(matiere) = LOWER($${idx++})`); values.push(matiere); }
    if (search) {
      conditions.push(`(titre ILIKE $${idx} OR $${idx} = ANY(notions_cles))`);
      values.push(`%${search}%`);
      idx++;
    }

    const result = await pool.query(
      `SELECT id, cycle, classe, matiere, chapitre, titre, objectifs, notions_cles, duree_heures, sequence
       FROM programmes_mena
       WHERE ${conditions.join(' AND ')}
       ORDER BY matiere, sequence ASC`,
      values
    );

    res.json({ programmes: result.rows, total: result.rows.length });
  } catch (err) {
    console.error('[Programmes]', err.message);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// GET /api/programmes/matieres — Liste des matières disponibles par cycle
router.get('/matieres', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT cycle, matiere FROM programmes_mena WHERE is_active = TRUE ORDER BY cycle, matiere`
    );
    res.json({ matieres: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

// GET /api/programmes/classes — Niveaux disponibles
router.get('/classes', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT cycle, classe FROM programmes_mena WHERE is_active = TRUE ORDER BY cycle, classe`
    );
    res.json({ classes: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur.' });
  }
});

module.exports = router;
