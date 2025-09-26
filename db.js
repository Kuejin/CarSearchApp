// db.js
require('dotenv').config();
const mysql = require('mysql2');

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL이 설정되지 않았습니다!');
  process.exit(1);
}

let dbUrl;
try {
  dbUrl = new URL(process.env.DATABASE_URL);
} catch (err) {
  console.error('❌ DATABASE_URL 형식 오류:', err.message);
  process.exit(1);
}

const pool = mysql.createPool({
  host: dbUrl.hostname,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.replace('/', ''),
  port: dbUrl.port || 3306,
  waitForConnections: true,
  connectionLimit: 10,
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
