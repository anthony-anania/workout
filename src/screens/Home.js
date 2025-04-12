import React from "react";
import { Link } from "react-router-dom";
import "../css/Home.css";

const Home = () => {
  console.log("✅ Home component rendered");

  return (
    <div className="home-container">
      <h1 className="home-title">🏋️ Welcome to the workout app!</h1>
      <p className="home-description">
        Your personal exercise assistant that uses webcam and MediaPipe AI technology to track your movements, 
        count repetitions, and provide real-time posture correction for safer, more effective workouts.
      </p>
      <div className="button-container">
        <Link to="/exerciseDetection" className="try-button-link">
          <button className="try-button">
            Exercise<br />detection
          </button>
        </Link>
        <Link to="/nutrition" className="try-button-link">
          <button className="try-button">
            Nutrition<br />calculator
          </button>
        </Link>
        <Link to="/exercise" className="try-button-link">
          <button className="try-button">
            Exercise<br />list
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;