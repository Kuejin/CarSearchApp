// db.js
//const mysql = require('mysql2');
//require('dotenv').config();

//const connection = mysql.createConnection({
//  host: process.env.DB_HOST,
//  user: process.env.DB_USER,
//  password: process.env.DB_PASSWORD,
//  database: process.env.DB_NAME,
//  ssl: {
//    rejectUnauthorized: true
//  }
//});

//connection.connect(err => {
//  if (err) throw err;
//  console.log("MySQL connected!");
//});
//
//module.exports = connection;

const mysql = require('mysql2');

// DATABASE_URL 환경변수에서 DB 연결 정보 가져오기
const connection = mysql.createConnection(process.env.DATABASE_URL);

// 연결 테스트
connection.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.message);
  } else {
    console.log('✅ MySQL connected successfully');
  }
});

module.exports = connection;
