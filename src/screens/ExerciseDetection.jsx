import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../css/ExerciseDetection.css';
import webcam from "../assets/images/webcam.png"

const API_BASE_URL = 'http://localhost:5000/api';

const ExerciseDetection = () => {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('push-up');
  const [isProcessing, setIsProcessing] = useState(false);
  const [counter, setCounter] = useState(0);
  const [status, setStatus] = useState('True');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [streamUrl, setStreamUrl] = useState('');
  const [currentSets, setCurrentSets] = useState([]);
  const videoRef = useRef(null);
  const statsIntervalRef = useRef(null);

  const navigate = useNavigate();

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
      setIsLoading(true);
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
    finally {
      setIsLoading(false);
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

  const finishSet = async () => {
    if (isProcessing) {
      const currentSet = {
        exercise: selectedExercise,
        counter: counter,
      }
      setCurrentSets([...currentSets, currentSet]);
      setCounter(0);
    }

  }
  const removeSet = async (indexToRemove) => {
    setCurrentSets(prev => prev.filter((_,index) => index !== indexToRemove))
  }

  const saveWorkout = async () => {
    navigate('/myWorkouts', {state: {workouts: [currentSets]}})
  }

  return (
    <div className = "main-container">
      <div className = "user-current-stats">
        <h1>My current sets</h1>
        {currentSets.map((set, index) => {
            return (
            <div className = "set-container">
              <h5 key = {index}>{set.exercise + ": " + set.counter + " repetitions"}</h5>
              <button className = "set-button" onClick = {() => removeSet(index)}>x</button>
            </div>
          )
        })}
      </div>
    
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
              <button className="blue-button" onClick={startWebcam} disabled={isLoading}>
                {isLoading ? 
                (<span className="loading-spinner"></span>) 
                : ('Start Webcam')}  
              </button>

            ) : (
              <button className="blue-button"  onClick={stopWebcam}>Stop</button>
            )}
          </div>
        </div>
        
        <div className="video-container">
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner large"></div>
            </div>
          ) : streamUrl ? (
            <img 
              ref={videoRef}
              src={streamUrl} 
              alt="Exercise video stream" 
            />
          ) : (
            <div className="video-placeholder">
              <img className="webcam-image" src={webcam} alt="placeholder" />
            </div>
          )}
        </div>
        
        <div className="stats">
          <div>
            <h3>Exercise Stats</h3>
            <p>Exercise: {selectedExercise}</p>
            <p>Counter: {counter}</p>
          </div>
          <div className = "workout-manager">
            <button className="blue-button" onClick={finishSet}>Finish set</button>
            <button className="blue-button" disabled={isProcessing} onClick={saveWorkout}>Save workout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetection;