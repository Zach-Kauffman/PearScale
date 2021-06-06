/*
 * Reusable MySQL connection pool for making queries throughout the rest of
 * the app.
 */

const mysql = require('mysql2/promise');

const mysqlPool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT || 3306,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD
});

module.exports = mysqlPool;
