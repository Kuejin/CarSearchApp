const express = require('express');
const path = require('path');
const db = require('./db');
require('dotenv').config();

const app = express();

// JSON 파싱
app.use(express.json());

// 정적 파일 제공 (public 폴더에 index.html 등 넣기)
app.use(express.static(path.join(__dirname, 'public')));

// 검색 라우트
app.get('/search', (req, res) => {
  const { car_number, car_type, car_color, owner_name, phone_number } = req.query;
  let sql = `SELECT * FROM car_info WHERE 1=1`;
  const params = [];

  if (car_number) sql += ` AND car_number LIKE ?`, params.push(`%${car_number}%`);
  if (car_type) sql += ` AND car_type LIKE ?`, params.push(`%${car_type}%`);
  if (car_color) sql += ` AND car_color LIKE ?`, params.push(`%${car_color}%`);
  if (owner_name) sql += ` AND owner_name LIKE ?`, params.push(`%${owner_name}%`);
  if (phone_number) sql += ` AND phone_number LIKE ?`, params.push(`%${phone_number}%`);

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 등록 라우트
app.post('/add', (req, res) => {
  const { car_number, car_type, car_color, owner_name, phone_number } = req.body;

  const sql = `
    INSERT INTO car_info (car_number, car_type, car_color, owner_name, phone_number)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [car_number, car_type, car_color, owner_name, phone_number], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '등록 성공!' });
  });
});

// 나머지 경로는 index.html로 처리 (SPA 지원)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚗 서버가 포트 ${PORT}에서 실행 중!`);
});
