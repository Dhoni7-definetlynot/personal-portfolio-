const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { pool, testConnection } = require("./db");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
  })
);

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Karthi Portfolio Backend is running successfully.");
});

app.get("/api/health", async (req, res) => {
  try {
    const [databaseResult] = await pool.query(
      "SELECT DATABASE() AS current_database"
    );

    const [projectCount] = await pool.query(
      "SELECT COUNT(*) AS count FROM projects"
    );

    const [skillCount] = await pool.query(
      "SELECT COUNT(*) AS count FROM skills"
    );

    res.json({
      status: "ok",
      database: databaseResult[0].current_database,
      project_count: projectCount[0].count,
      skill_count: skillCount[0].count,
    });
  } catch (error) {
    res.status(500).json({
      message: "Health check failed",
      error: error.message,
    });
  }
});

app.get("/api/projects", async (req, res) => {
  try {
    const [projects] = await pool.query(
      "SELECT * FROM projects ORDER BY id ASC"
    );

    res.json(projects);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching projects",
      error: error.message,
    });
  }
});

app.get("/api/skills", async (req, res) => {
  try {
    const [skills] = await pool.query("SELECT * FROM skills ORDER BY id ASC");

    res.json(skills);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching skills",
      error: error.message,
    });
  }
});

app.get("/api/experience", async (req, res) => {
  try {
    const [experience] = await pool.query(
      "SELECT * FROM experience ORDER BY id ASC"
    );

    res.json(experience);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching experience",
      error: error.message,
    });
  }
});

app.get("/api/certifications", async (req, res) => {
  try {
    const [certifications] = await pool.query(
      "SELECT * FROM certifications ORDER BY id ASC"
    );

    res.json(certifications);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching certifications",
      error: error.message,
    });
  }
});

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Name, email, and message are required.",
      });
    }

    const sql =
      "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";

    const [result] = await pool.query(sql, [name, email, message]);

    res.status(201).json({
      message: "Contact message saved successfully.",
      contactId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error saving contact message",
      error: error.message,
    });
  }
});

app.get("/api/contacts", async (req, res) => {
  try {
    const [contacts] = await pool.query(
      "SELECT * FROM contacts ORDER BY created_at DESC"
    );

    res.json(contacts);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching contacts",
      error: error.message,
    });
  }
});

testConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
  });