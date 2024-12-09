const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Check if the user already exists
    db.query(
      "SELECT email FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Database error.", error: err });
        }

        if (results.length > 0) {
          return res.status(409).json({ message: "Email already registered." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        db.query(
          "INSERT INTO users (email, password) VALUES (?, ?)",
          [email, hashedPassword],
          (err) => {
            if (err) {
              return res
                .status(500)
                .json({ message: "Error saving user.", error: err });
            }

            // Generate a JWT token
            const token = jwt.sign({ email }, process.env.JWT_SECRET, {
              expiresIn: "1d",
            });

            // Send a success response with the token
            res
              .status(201)
              .json({ message: "User registered successfully.", token });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: "SignUp error.", error });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Query to find user by email
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Database error.", error: err });
        }

        // If no user is found
        if (results.length === 0) {
          return res
            .status(401)
            .json({ message: "Invalid email or password." });
        }

        // Compare provided password with stored hash
        const isPasswordValid = await bcrypt.compare(
          password,
          results[0].password
        );
        if (!isPasswordValid) {
          return res
            .status(401)
            .json({ message: "Invalid email or password." });
        }

        // Generate JWT token
        const token = jwt.sign({ email }, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });

        // Return success response with token
        res.status(200).json({ message: "Login successful.", token });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error });
  }
});

module.exports = router;
