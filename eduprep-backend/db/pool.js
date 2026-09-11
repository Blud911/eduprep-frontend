const { Pool } = require('pg');

// FIX SEC-TLS : rejectUnauthorized:false désactive la validation du
// certificat TLS de Neon — la connexion reste chiffrée mais n'importe quel
// certificat serait accepté (pas de protection contre un MITM sur le
// chemin réseau Render→Neon). Neon utilise une CA publique standard, donc
// rejectUnauthorized:true devrait fonctionner sans configuration
// supplémentaire, mais impossible de le vérifier contre l'infrastructure
// réelle depuis cet environnement — DB_SSL_STRICT reste donc désactivé par
// défaut (comportement actuel inchangé) et n'est à activer qu'après un test
// de connexion explicite sur Render (voir procédure fournie séparément).
// Rollback instantané si la connexion échoue : retirer la variable
// d'environnement (ou la remettre à autre chose que 'true') et redémarrer —
// aucune modification de code nécessaire.
const sslStrict = process.env.DB_SSL_STRICT === 'true';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: sslStrict } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('[DB] Erreur pool PostgreSQL:', err.message);
});

pool.on('connect', () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[DB] Nouvelle connexion PostgreSQL établie');
  }
});

module.exports = pool;
