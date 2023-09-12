require('dotenv').config();
const mysql = require('mysql2');
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: 'your password here',
    database: process.env.DB_NAME
  });

module.exports = db;