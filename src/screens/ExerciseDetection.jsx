import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ExerciseDetection.css';

const API_BASE_URL = 'http://localhost:5000/api';

const ExerciseDetection = () => {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('push-up');
  const [isProcessing, setIsProcessing] = useState(false);
  const [counter, setCounter] = useState(0);
  const [status, setStatus] = useState('True');
  const [error, setError] = useState('');
  const [streamUrl, setStreamUrl] = useState('');
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const statsIntervalRef = useRef(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/exercises`);
        if (Array.isArray(response.data)) {
          setExercises(response.data);
          if (response.data.length > 0) {
            setSelectedExercise(response.data[0]);
          }
        }
      } catch (err) {
        setError('Server not running');
        console.error(err);
      }
    };

    fetchExercises();


    return () => {
      if (statsIntervalRef.current) {
        clearInterval(statsIntervalRef.current);
      }
      stopWebcam();
    };
  }, []);

  useEffect(() => {
    if (isProcessing) {
      statsIntervalRef.current = setInterval(fetchStats, 500);
    } else {
      if (statsIntervalRef.current) {
        clearInterval(statsIntervalRef.current);
        statsIntervalRef.current = null;
      }
    }
  }, [isProcessing]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stats`);
      setCounter(response.data.counter);
      setStatus(response.data.status);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const startWebcam = async () => {
    try {
      setError('');
      const response = await axios.post(`${API_BASE_URL}/start_webcam`, {
        exercise: selectedExercise
      });
      
      if (response.data.status === 'success') {
        setIsProcessing(true);
        setStreamUrl(`${API_BASE_URL}/video_feed?t=${Date.now()}`);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Failed to start webcam. Is the server running?');
      console.error(err);
    }
  };

  const stopWebcam = async () => {
    try {
      await axios.post(`${API_BASE_URL}/stop_webcam`);
      setIsProcessing(false);
      setStreamUrl('');
    } catch (err) {
      console.error('Error stopping webcam:', err);
    }
  };


  return (
    <div className="exercise-detection">
      <h1>Exercise Detection</h1>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="controls">
        <div className="exercise-selector">
          <label htmlFor="exercise-select">Select Exercise:</label>
          <select 
            id="exercise-select" 
            value={selectedExercise} 
            onChange={(e) => setSelectedExercise(e.target.value)}
            disabled={isProcessing}
          >
            {exercises.map((exercise) => (
              <option key={exercise} value={exercise}>
                {exercise}
              </option>
            ))}
          </select>
        </div>
        
        <div className="webcam-controls">
          {!isProcessing ? (
            <button onClick={startWebcam}>Start Webcam</button>
          ) : (
            <button onClick={stopWebcam}>Stop</button>
          )}
        </div>
      </div>
      
      <div className="video-container">
        {streamUrl && (
          <img 
            ref={videoRef}
            src={streamUrl} 
            alt="Exercise video stream" 
          />
        )}
      </div>
      
      <div className="stats">
        <h3>Exercise Stats</h3>
        <p>Exercise: {selectedExercise}</p>
        <p>Counter: {counter}</p>
        <p>Status: {status}</p>
      </div>
    </div>
  );
};

export default ExerciseDetection;