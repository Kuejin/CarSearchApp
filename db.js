const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection(process.env.DATABASE_URL);

connection.connect(err => {
  if (err) throw err;
  console.log("✅ MySQL connected!");
});

module.exports = connection;