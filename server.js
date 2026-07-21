// server.js
const express = require("express");
const path = require("path");
const db = require("./db"); // 연결 풀 사용 (createPool)
require("dotenv").config();
const app = express();
// JSON 파싱
app.use(express.json());
// 정적 파일 제공 (public 폴더에 index.html 등 넣기)
app.use(express.static(path.join(__dirname, "public")));
// 차량 검색 라우트
app.get("/search", (req, res) => {
  const { keyword } = req.query;
  const sql = `
    SELECT *
    FROM car_info
    WHERE
      car_number LIKE ?
      OR car_type LIKE ?
      OR car_color LIKE ?
      OR owner_name LIKE ?
      OR owner_name2 LIKE ?
      OR phone_number LIKE ?
      OR phone_number2 LIKE ?
  `;
  const search = `%${keyword}%`;
  const params = [search, search, search, search, search, search, search];
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("❌ 검색 오류:", err.message);
      return res.status(500).json({ error: "서버 오류: 검색 실패" });
    }
    res.json(results);
  });
});
// 차량 등록 라우트
app.post("/add", (req, res) => {
  const {
    car_number,
    car_type,
    car_color,
    owner_name,
    owner_name2,
    phone_number,
    phone_number2,
  } = req.body;
  const sql = `
    INSERT INTO car_info (car_number, car_type, car_color, owner_name, owner_name2, phone_number, phone_number2)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(
    sql,
    [
      car_number,
      car_type,
      car_color,
      owner_name,
      owner_name2,
      phone_number,
      phone_number2,
    ],
    (err, result) => {
      if (err) {
        console.error("❌ 등록 오류:", err.message);
        return res.status(500).json({ error: "서버 오류: 등록 실패" });
      }
      res.json({ message: "등록 완료 :)" });
    },
  );
});
// 차량 삭제 라우트 (id 기준)
app.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM car_info WHERE id = ?`;
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("❌ 삭제 오류:", err.message);
      return res.status(500).json({ error: "서버 오류: 삭제 실패" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "해당 차량을 찾을 수 없습니다" });
    }
    res.json({ message: "삭제 완료 :)" });
  });
});
// 차량 수정 라우트 (id 기준)
app.put("/update/:id", (req, res) => {
  const { id } = req.params;
  const {
    car_number,
    car_type,
    car_color,
    owner_name,
    owner_name2,
    phone_number,
    phone_number2,
  } = req.body;
  const sql = `
    UPDATE car_info
    SET car_number=?, car_type=?, car_color=?, owner_name=?, owner_name2=?, phone_number=?, phone_number2=? WHERE id=?
  `;
  db.query(
    sql,
    [
      car_number,
      car_type,
      car_color,
      owner_name,
      owner_name2,
      phone_number,
      phone_number2,
      id,
    ],
    (err, result) => {
      if (err) {
        console.error("❌ 수정 오류:", err.message);
        return res.status(500).json({ error: "서버 오류: 수정 실패" });
      }
      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "해당 차량을 찾을 수 없습니다" });
      }
      res.json({ message: "수정 완료 :)" });
    },
  );
});
// SPA 지원 - 나머지 경로는 모두 index.html로 처리
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
// ✅ 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚗 서버가 포트 ${PORT}에서 실행 중!`);
});
