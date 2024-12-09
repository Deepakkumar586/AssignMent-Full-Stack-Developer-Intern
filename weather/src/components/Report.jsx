import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment"; // You can install this package via npm install moment
import { Link } from "react-router-dom";

const Report = () => {
  const [report, setReport] = useState([]);

  useEffect(() => {
    const fetchReport = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:5000/report", {
          headers: { authorization: `Bearer ${token}` },
        });
        setReport(response.data.data); // Accessing the 'data' field directly
      } catch (err) {
        alert(err.response.data.message || "Something went wrong");
      }
    };
    fetchReport();
  }, []);

  return (
    <div style={styles.container}>
    <h2><Link to="/weather">Weather</Link></h2>
      <h2 style={styles.heading}>Weather Search Report</h2>
      <div style={styles.reportList}>
        {report.map((entry, index) => (
          <div
            key={index}
            style={{ ...styles.reportItem, animationDelay: `${index * 0.2}s` }}
          >
            <div style={styles.reportDetails}>
              <strong style={styles.email}>{entry.email}</strong> searched for{" "}
              <strong style={styles.city}>{entry.city}</strong>
              
            </div>
            <div style={styles.searchedAt}>
              Searched at:{" "}
              <span style={styles.date}>
                {moment(entry.searched_at).format("MMMM D, YYYY, h:mm A")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    // display:"flex",
    // justifyContent: "center",
    alignItems: "center",
   margin:"auto",
  //  marginLeft:"200px",
    // marginLeft:"auto",
    // marginRight:"auto",
    borderRadius: "8px",
    
  

    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f7fc",
    borderRadius: "8px",
  },
  heading: {
    textAlign: "center",
    color: "#333",
    fontSize: "2rem",
    marginBottom: "20px",
    fontWeight: "bold",
  },
  reportList: {
    listStyleType: "none",
    paddingLeft: "0",
  },
  reportItem: {
    padding: "15px",
    marginBottom: "15px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    animation: "fadeIn 0.5s ease-in-out",
  },
  reportDetails: {
    fontSize: "1.1rem",
    color: "#555",
  },
  email: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  city: {
    color: "#2196F3",
    fontWeight: "bold",
  },
  region: {
    color: "#777",
    fontStyle: "italic",
  },
  searchedAt: {
    marginTop: "10px",
    fontSize: "1rem",
    color: "#888",
  },
  date: {
    color: "#333",
    fontWeight: "bold",
  },
};

export default Report;
