import "./App.css";
import React from "react";
import { Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";


import Exercise from "./screens/Exercise"

import ExerciseDetection from "./screens/ExerciseDetection";
import MyWorkouts from "./screens/MyWorkouts";
import Nutrition from "./components/nutrition/Nutrition";
import Home from "./screens/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App = () => {
  return (
    <Box sx={{ width: { xl: "1488px" } }} m="auto">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exercise" element={<Exercise />} />
        <Route path="/exerciseDetection/" element={<ExerciseDetection />} />;
        <Route path="/myWorkouts" element={<MyWorkouts />} />;
        <Route path="/nutrition" element={<Nutrition />}/>
      </Routes>
      <Footer />
    </Box>
  );
};

export default App;
