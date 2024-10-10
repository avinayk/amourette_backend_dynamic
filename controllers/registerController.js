const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
require("dotenv").config();
const multer = require("multer");
const path = require("path");

exports.register = async (req, res) => {
  const {
    email,
    password,
    birth_date,
    birth_month,
    birth_year,
    profile_type,
    preferences,
    gender,
  } = req.body;
  console.log(req.body);
  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Additional validation if needed
  if (
    !email ||
    !password ||
    !birth_date ||
    !birth_month ||
    !birth_year ||
    !profile_type ||
    !preferences ||
    !gender
  ) {
    console.log(gender);
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if email already exists
    console.log("s");
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, rows) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Database query error", error: err });
        }
        console.log(rows.length);
        if (rows.length > 0) {
          return res.status(400).json({ message: "Email already registered" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Insert new user into the database

        var dobb = birth_date + "-" + birth_month + "-" + birth_year;
        var dob = new Date(dobb);
        var birthday_date = db.query(
          "INSERT INTO users (email, password, birthday_date,  profile_type, preferences,gender) VALUES (?, ?, ?, ?, ?, ?)",
          [email, hashedPassword, dob, profile_type, preferences, gender],
          (err, result) => {
            if (err) {
              return res
                .status(500)
                .json({ message: "Database insertion error", error: err });
            }

            res.status(201).json({
              message: "User registered successfully",
              userId: result.insertId,
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Registration error", error });
  }
};

exports.updateProfile = async (req, res) => {
  const {
    token,
    email,
    looking_for,
    username,
    location,
    preferences_text,
    nationality,
    bodytype,
    height_feet,
    height_inches,
    sexual_orientation,
    relationship_status,
    search_looking_for,
    degree,
    drinker,
    smoker,
    tattos,
    body_piercings,
    fetish,
  } = req.body;

  try {
    console.log(height_inches);
    // Ensure the email is provided
    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required to update profile" });
    }

    // Update user in the database
    db.query(
      `UPDATE users SET 
        looking_for = ?, 
        username = ?, 
        location = ?, 
        preferences_text = ?, 
        nationality = ?, 
        bodytype = ?, 
        height_feet = ?, 
        height_inches = ?, 
        sexual_orientation = ?, 
        relationship_status = ?, 
        search_looking_for = ?, 
        degree = ?, 
        drinker = ?, 
        smoker = ?, 
        tattos = ?, 
        body_piercings = ?, 
        fetish = ?
      WHERE email = ?`,
      [
        looking_for,
        username,
        location,
        preferences_text,
        nationality,
        bodytype,
        height_feet,
        height_inches,
        sexual_orientation,
        relationship_status,
        search_looking_for,
        degree,
        drinker,
        smoker,
        tattos,
        body_piercings,
        fetish,
        email,
      ],
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Database update error", error: err });
        }

        // Check if any row was updated
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User profile updated successfully" });
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getProfile = async (req, res) => {
  const { email } = req.body;

  try {
    // Ensure the email is provided
    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required to get profile" });
    }

    // Query the database to get the user's profile details
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, rows) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Database query error", error: err });
      }

      // Check if the user exists
      if (rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      // Send the user profile data as the response
      const userProfile = rows[0]; // Assuming you want the first row
      res.status(200).json(userProfile);
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
