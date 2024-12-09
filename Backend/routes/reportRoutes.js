const express = require("express");
const db = require("../config/db");
const verifyToken = require("../middleware/auth");

const router = express.Router();

router.get("/report", verifyToken, (req, res) => {
  db.query(
    "SELECT email, city,searched_at, weather FROM searches",
    (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({
          message: "Error retrieving search report.",
          error: err.message,
        });
      }

      // If no results found, send a 404 response
      if (results.length === 0) {
        return res.status(404).json({
          message: "No search reports found.",
        });
      }

      // Ensure the 'weather' data is parsed as JSON, assuming it's stored as a JSON string in the database
      results = results.map((item) => {
        if (item.weather) {
          try {
            item.weather = JSON.parse(item.weather); // Parsing the weather data if it's a string
          } catch (e) {
            item.weather = null; // Handle cases where JSON is invalid
          }
        }
        // Only return the necessary fields
        return {
          email: item.email,
          city: item.city,
          // country: item.country,
          // region: item.region,
          searched_at: item.searched_at,
          weather: item.weather ? item.weather.current : null, // Return only the current weather data if available
        };
      });

      // Send the search reports in the response
      res.status(200).json({
        message: "Search reports retrieved successfully.",
        data: results,
      });
    }
  );
});

module.exports = router;
