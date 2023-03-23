const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '83202310',
  database: 'company_db'
});

module.exports = pool;