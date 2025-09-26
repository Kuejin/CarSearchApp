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

// 연결 테스트
pool.getConnection((err, conn) => {
  if (err) {
    console.error('❌ DB 연결 실패:', err.message);
  } else {
    console.log('✅ DB 연결 성공!');
    conn.release();
  }
});

module.exports = pool;
