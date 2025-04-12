import React, { useState } from 'react';
import { Box } from '@mui/material';
import "../css/Exercise.css"
import Exercises from '../components/Exercises';

const Exercise = () => {
  const [exercises, setExercises] = useState([]);
  const [bodyPart, setBodyPart] = useState('all');

  return (
    <Box>
      <Exercises setExercises={setExercises} exercises={exercises} bodyPart={bodyPart} />
    </Box>
  );
};

export default Exercise;
