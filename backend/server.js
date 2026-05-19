const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MySQL connection directly inside server.js
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "portfolio_db",
  waitForConnections: true,
  connectionLimit: 10,
});

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("MySQL database connected successfully.");
    connection.release();
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
}

testConnection();

// Home route
app.get("/", (req, res) => {
  res.send("Portfolio backend is running successfully.");
});

// Projects route
app.get("/api/projects", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM projects");
    res.json(rows);
  } catch (error) {
    console.error("Projects fetch error:", error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
});

// Skills route
app.get("/api/skills", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM skills");
    res.json(rows);
  } catch (error) {
    console.error("Skills fetch error:", error);
    res.status(500).json({ message: "Failed to fetch skills" });
  }
});

// Experience route
app.get("/api/experience", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM experience");
    res.json(rows);
  } catch (error) {
    console.error("Experience fetch error:", error);
    res.status(500).json({ message: "Failed to fetch experience" });
  }
});

// Certifications route
app.get("/api/certifications", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM certifications");
    res.json(rows);
  } catch (error) {
    console.error("Certifications fetch error:", error);
    res.status(500).json({ message: "Failed to fetch certifications" });
  }
});

// Contact form route
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await pool.query(
      "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)",
      [name, email, message]
    );

    res.status(201).json({ message: "Message saved successfully" });
  } catch (error) {
    console.error("Contact save error:", error);
    res.status(500).json({ message: "Failed to save message" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});