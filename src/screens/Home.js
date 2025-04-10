import React from "react";
import "../css/Home.css";

const Home = () => {
  console.log("✅ Home component rendered");

  return (
    <div className="home-container">
      <h1 className="home-title">🏋️ Welcome to the workout app!</h1>
    </div>
  );
};

export default Home;
