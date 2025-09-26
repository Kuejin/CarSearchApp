require('dotenv').config();
const mysql = require('mysql2');

// DATABASE_URL 파싱
const dbUrl = new URL(process.env.DATABASE_URL);

// 연결 풀 생성
const pool = mysql.createPool({
  host: dbUrl.hostname,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.replace('/', ''),
  port: dbUrl.port || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: {
    rejectUnauthorized: false,
  },
});

console.log('✅ DB 연결 풀 생성 완료');

module.exports = pool;
