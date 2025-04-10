import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Stack } from "@mui/material";
import Logo from "../assets/images/Logo.png";
import "../css/Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      className="navbar-container"
    >
      <Link to="/">
        <img src={Logo} alt="logo" className="navbar-logo" />
      </Link>

      <Stack
        direction="row"
        spacing={4}
        alignItems="center"
        className="navbar-links"
      >
        <Link
          to="/"
          className={`nav-link ${path === "/" ? "active-link" : ""}`}
        >
          Home
        </Link>
        <a href="#exercises" className="nav-link">
          Exercises
        </a>
        <Link
          to="/exerciseDetection"
          className={`nav-link ${
            path === "/exerciseDetection" ? "active-link" : ""
          }`}
        >
          Exercise Detection
        </Link>
        <Link
          to="/myWorkouts"
          className={`nav-link ${path === "/myWorkouts" ? "active-link" : ""}`}
        >
          My Workouts
        </Link>
      </Stack>
    </Stack>
  );
};

export default Navbar;
