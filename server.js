const express = require('express');
const path = require('path');
const app = express();
const db = require('./db');

// 환경변수 출력 (디버깅용)
console.log('PORT environment variable:', process.env.PORT);

// 정적 파일 제공 (HTML, JS, CSS 등)
app.use(express.static(path.join(__dirname)));

// JSON 파싱
app.use(express.json());

// 검색 라우트
app.get('/search', (req, res) => {
  console.log('🔍 Search request received:', req.query); // 요청 확인

  const { car_number, car_type, car_color, owner_name, phone_number } = req.query;
  let sql = `SELECT * FROM car_info WHERE 1=1`;
  const params = [];

  if (car_number) {
    sql += ` AND car_number LIKE ?`;
    params.push(`%${car_number}%`);
  }
  if (car_type) {
    sql += ` AND car_type LIKE ?`;
    params.push(`%${car_type}%`);
  }
  if (car_color) {
    sql += ` AND car_color LIKE ?`;
    params.push(`%${car_color}%`);
  }
  if (owner_name) {
    sql += ` AND owner_name LIKE ?`;
    params.push(`%${owner_name}%`);
  }
  if (phone_number) {
    sql += ` AND phone_number LIKE ?`;
    params.push(`%${phone_number}%`);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('❌ DB query error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// 등록 라우트
app.post('/add', (req, res) => {
  console.log('➕ Add request received:', req.body); // 요청 확인

  const { car_number, car_type, car_color, owner_name, phone_number } = req.body;

  const sql = `
    INSERT INTO car_info (car_number, car_type, car_color, owner_name, phone_number)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [car_number, car_type, car_color, owner_name, phone_number], (err, result) => {
    if (err) {
      console.error('❌ DB insert error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Car info added successfully!' });
  });
});

// 기본 루트 (index.html 반환)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚗 Server running on port ${PORT}`);
});
