const { Pool } = require('pg');

const pool = new Pool({
  user: 'rahul',
  host: 'localhost',
  database: 'evidence_system',
  password: 'pass123',
  port: 5432,
});

module.exports = pool;
