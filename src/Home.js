import React from "react";

const Home = () => {
  console.log("✅ Home component rendered");

  return (
    <div style={{ background: "lightgray", padding: "20px" }}>
      <h1 style={{ color: "black" }}>🏋️ Welcome to the workout app!</h1>
    </div>
  );
};

export default Home;
