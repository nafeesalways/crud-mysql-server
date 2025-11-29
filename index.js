const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config(); // .env ফাইল থেকে তথ্য পড়ার জন্য

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

// Database Connection (Cloud Setup)
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
      rejectUnauthorized: false // Aiven ক্লাউড ডাটাবেসের জন্য এটি অবশ্যই লাগবে
  }
});

// Check connection
db.connect((err) => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Connected to Aiven Cloud Database.");
});

app.get("/", (req, res) => {
  res.json("Welcome to the Backend API");
});

// GET ALL BOOKS
app.get("/books", (req, res) => {
  const q = "SELECT * FROM books";
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
});

// GET SINGLE BOOK (For Update Page)
app.get("/books/:id", (req, res) => {
    const bookId = req.params.id;
    const q = "SELECT * FROM books WHERE id = ?";
    db.query(q, [bookId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data[0]);
    });
  });

// CREATE BOOK
app.post("/books", (req, res) => {
  const q = "INSERT INTO books(`title`, `desc`, `price`, `cover`) VALUES (?)";
  const values = [
    req.body.title,
    req.body.desc,
    req.body.price,
    req.body.cover,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(201).json("Book has been created Hurrah");
  });
});

// DELETE BOOK
app.delete("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = "DELETE FROM books WHERE id = ?";

  db.query(q, [bookId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Book has been deleted successfully.");
  });
});

// UPDATE BOOK
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

// Vercel-এর জন্য export জরুরি
module.exports = app;