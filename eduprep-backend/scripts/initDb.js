require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function initDb() {
  console.log('🗄️  Initialisation de la base de données EduPrep CI...\n');

  const schemaPath = path.join(__dirname, '../db/schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');

  const client = await pool.connect();
  try {
    await client.query(schema);
    console.log('✅ Schéma créé avec succès');
    console.log('✅ Données initiales insérées (admin + programmes MENA)');
    console.log('\n⚠️  IMPORTANT : Changez le mot de passe admin immédiatement !');
    console.log('   Email : admin@eduprep.ci');
    console.log('   Mot de passe : EduPrep@2026!\n');
  } catch (err) {
    console.error('❌ Erreur :', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

initDb();
