import './App.css';
import React from 'react';
import {Route, Routes } from 'react-router-dom'
import { Box } from '@mui/material';


import ExerciseDetail from './ExerciseDetail';
import Home from './Home'
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Nutrition from './components/Nutrition/Nutrition';

const App = () => {
  return (
    <Box sx={{ width: { xl: '1488px' } }} m="auto">

      <Navbar />

      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/exercise/:id" element={<ExerciseDetail/>} />
        <Route path="/nutrition" element={<Nutrition/>} />
      </Routes>
      <Footer/>
    </Box>

    
  )
}

export default App;

