const express = require('express');
const path = require('path');
const app = express();
const db = require('./db');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// 검색 라우트
app.get('/search', (req, res) => {
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
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// 등록 라우트
app.post('/add', (req, res) => {
  const { car_number, car_type, car_color, owner_name, phone_number } = req.body;

  const sql = `INSERT INTO car_info (car_number, car_type, car_color, owner_name, phone_number)
               VALUES (?, ?, ?, ?, ?)`;

  db.query(sql, [car_number, car_type, car_color, owner_name, phone_number], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Car info added successfully!' });
  });
});

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('🚗 Car Search App is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
