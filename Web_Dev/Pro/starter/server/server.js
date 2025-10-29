const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const pool = require("./db/connection");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../client")));

// Validation helper
const validateFormData = (name, email, message) => {
  const errors = [];

  if (!name || name.trim().length === 0) {
    errors.push("Name is required");
  }

  if (!email || email.trim().length === 0) {
    errors.push("Email is required");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push("Invalid email format");
    }
  }

  if (!message || message.trim().length === 0) {
    errors.push("Message is required");
  }

  return errors;
};

// Routes

// Get all submissions (for dashboard)
app.get("/api/submissions", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM submissions ORDER BY created_at DESC"
    );
    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch submissions",
    });
  }
});

// Submit form data
app.post("/api/submit", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate input
    const errors = validateFormData(name, email, message);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors.join(", "),
      });
    }

    // Insert into database
    const query =
      "INSERT INTO submissions (name, email, message) VALUES ($1, $2, $3) RETURNING *";
    const values = [name.trim(), email.trim(), message.trim()];

    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: "Form submitted successfully!",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error submitting form:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Serve the main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client", "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
