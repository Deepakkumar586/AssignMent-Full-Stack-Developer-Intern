const express = require("express");
const axios = require("axios");
const db = require("../config/db");
const verifyToken = require("../middleware/auth");

const router = express.Router();

router.post("/weather", verifyToken, async (req, res) => {
  const { city } = req.body;
  const user = req.user;
  const weatherApiKey = process.env.WEATHER_API_KEY;

  if (!city) {
    return res.status(400).json({ message: "City is required." });
  }

  try {
    const response = await axios.get(
      `http://api.weatherstack.com/current?access_key=${weatherApiKey}&query=${city}`
    );
    const weather = response.data;

    if (!weather) {
      return res
        .status(500)
        .json({ message: "Unable to fetch weather data for the city." });
    }

    // Extract only necessary data
    const weatherData = {
      temperature: weather.current.temperature,
      description: weather.current.weather_descriptions[0],
      icon: weather.current.weather_icons[0],
      windSpeed: weather.current.wind_speed,
      humidity: weather.current.humidity,
      feelsLike: weather.current.feelslike,
      wind_degrees: weather.current.wind_degree,
      country: weather.location.country,
      region: weather.location.region,
    };

    db.query(
      "INSERT INTO searches (email, city, weather) VALUES (?, ?, ?)",
      [user.email, city, JSON.stringify(weatherData)],
      (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res
            .status(500)
            .json({ message: "Database error.", error: err });
        }

        // Return only the necessary weather data
        res.json({ data: weatherData });
      }
    );
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res
      .status(500)
      .json({ message: "Error fetching weather data.", error: error.message });
  }
});

module.exports = router;
