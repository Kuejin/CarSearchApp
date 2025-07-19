const express = require('express');
const path = require('path');
const app = express();
const db = require('./db');

app.use(express.json());

// 검색 및 등록 라우트 생략...

const PORT = process.env.PORT || 3000;

// 정적 파일 제공 (루트 경로에서 index.html 읽음)
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
