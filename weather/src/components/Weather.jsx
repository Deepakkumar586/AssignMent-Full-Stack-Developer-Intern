import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://localhost:5000/weather",
        { city },
        { headers: { authorization: `Bearer ${token}` } }
      );

      console.log("Weather Data:", response.data);
      setWeatherData(response.data.data); // Access 'data' field from the response
    } catch (err) {
      alert(err.response.data.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.heading}>Weather Search</h2>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={styles.input}
        />
        <button
          onClick={handleSearch}
          style={styles.searchButton}
        >
          {loading ? "Loading..." : "Search"}
        </button>

        {weatherData && (
          <div style={styles.weatherInfo}>
            <h3>Weather in {city}</h3>
            <div style={styles.weatherIconContainer}>
              <img
                src={weatherData.icon}
                alt="weather-icon"
                style={styles.weatherIcon}
              />
            </div>
            <p><strong>{weatherData.description}</strong></p>
            <p>Temperature: {weatherData.temperature}°C</p>
            <p>Feels Like: {weatherData.feelsLike}°C</p>
            <p>Wind Speed: {weatherData.windSpeed} km/h</p>
            <p>Humidity: {weatherData.humidity}%</p>
            <p>Country: {weatherData.country}</p>
            <p>Region: {weatherData.region}</p>
          </div>
        )}

        <div style={styles.linksContainer}>
          <Link to='/report' style={styles.link}>
            <p>View Search Report</p>
          </Link>
          <Link to="/" style={styles.link}>
            <p>Login</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f0f0",
    fontFamily: "'Roboto', sans-serif",
    padding: "20px",
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "500px",
  },
  heading: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
    fontSize: "24px",
  },
  input: {
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "16px",
    width: "100%",
  },
  searchButton: {
    padding: "12px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
    width: "100%",
    transition: "background-color 0.3s",
  },
  searchButtonHover: {
    backgroundColor: "#45a049",
  },
  weatherInfo: {
    marginTop: "20px",
    textAlign: "center",
    borderTop: "2px solid #ddd",
    paddingTop: "20px",
  },
  weatherIconContainer: {
    marginBottom: "15px",
  },
  weatherIcon: {
    width: "60px",
    height: "60px",
  },
  linksContainer: {
    marginTop: "20px",
    textAlign: "center",
  },
  link: {
    textDecoration: "none",
    color: "#2196F3",
    fontSize: "16px",
    display: "block",
    marginTop: "10px",
  },
};

export default Weather;
