const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

// CHANGE 1: createConnection এর বদলে createPool ব্যবহার করো
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true, // কানেকশন পাওয়ার জন্য অপেক্ষা করবে
  connectionLimit: 10,      // একসাথে সর্বোচ্চ ১০টি কানেকশন
  queueLimit: 0,
  ssl: {
      rejectUnauthorized: false
  }
});

// CHANGE 2: db.connect() ডিলিট করে দাও
// Pool অটোমেটিক কানেকশন হ্যান্ডেল করে, তাই ম্যানুয়াল connect() দরকার নেই।

console.log("Database Pool Created."); // চেক করার জন্য লগ

app.get("/", (req, res) => {
  res.json("Welcome to the Backend API");
});

app.get("/books", (req, res) => {
  const q = "SELECT * FROM books";
  db.query(q, (err, data) => {
    if (err) {
        console.error(err);
        return res.status(500).json(err);
    }
    return res.status(200).json(data);
  });
});

app.get("/books/:id", (req, res) => {
    const bookId = req.params.id;
    const q = "SELECT * FROM books WHERE id = ?";
    db.query(q, [bookId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data[0]);
    });
  });

app.post("/books", (req, res) => {
  const q = "INSERT INTO books(`title`, `desc`, `price`, `cover`) VALUES (?)";
  const values = [
    req.body.title,
    req.body.desc,
    req.body.price,
    req.body.cover,
  ];

  db.query(q, [values], (err, data) => {
    if (err) {
        // এরর কনসোলে প্রিন্ট করো যাতে Vercel Logs-এ দেখা যায়
        console.error("Insert Error:", err); 
        return res.status(500).json(err);
    }
    return res.status(201).json("Book has been created Hurrah");
  });
});

app.delete("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = "DELETE FROM books WHERE id = ?";

  db.query(q, [bookId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Book has been deleted successfully.");
  });
});

app.put("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = "UPDATE books SET `title`= ?, `desc`= ?, `price`= ?, `cover`= ? WHERE id = ?";

  const values = [
    req.body.title,
    req.body.desc,
    req.body.price,
    req.body.cover,
  ];

  db.query(q, [...values, bookId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Book has been updated successfully.");
  });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;