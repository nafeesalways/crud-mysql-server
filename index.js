import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000

// Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  
  // নিচে তোমার MySQL Workbench ইন্সটল করার সময়ের পাসওয়ার্ড দিতে হবে
  password: "sk27@5826", 
  
  database: "test", // আমরা একটু আগেই 'test' নামেই ডাটাবেস বানিয়েছি
});

// Check connection
db.connect((err) => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Connected to database.");
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
    return res.status(201).json("Book has been created successfully.");
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

// এই লাইনটি অবশ্যই যোগ করবে
module.exports = app;