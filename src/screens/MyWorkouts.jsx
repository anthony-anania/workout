import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/MyWorkouts.css'
const MyWorkouts = () => {
    const location = useLocation();
    const { workouts = [] } = location.state || {};
    const [expandedWorkoutIndex, setExpandedWorkoutIndex] = useState(null);

    const toggleWorkoutDetails = (index) => {
      setExpandedWorkoutIndex(prev => (prev === index ? null : index));
    };
    const today = new Date().toISOString().split('T')[0];

    return (
        <>
             {workouts.length === 0 ? (
            <div className="my-workouts-container">
                <h1 className="my-workouts-header">My Workouts</h1>
                <tr className ="my-workouts-tr">
                    <td className= "workout-date">Date</td>
                    <td className= "workout-date">Workout #</td>
                    <td>Exercises</td>
                    <td>Actions</td>
                </tr>
            </div>
            ) : (
            
            <div className="my-workouts-container">
                <h1 className="my-workouts-header">My Workouts</h1>

                <tr className ="my-workouts-tr">
                    <td className= "workout-date">Date</td>
                    <td className= "workout-date">Workout #</td>
                    <td>Exercises</td>
                    <td>Actions</td>
                </tr>
                {workouts.map((workout, index) => (
                <React.Fragment key={index}>
                <tr>
                  <td className="workout-date">{today}</td>
                  <td className="workout-date">{index + 1}</td>
                  <td>{[...new Set(workout.map(e => e.exercise))].join(', ')}</td>
                  <td>
                    <div className="action-buttons">
                    <div class="action-buttons-container">
                        <button
                          className="action-button view-button"
                          onClick={() => toggleWorkoutDetails(index)}
                        >
                          {expandedWorkoutIndex === index ? 'Hide' : 'View'}
                        </button>
                        <button className="action-button delete-button">Delete</button>
                      </div>
                    </div>
                  </td>
                </tr>

                {expandedWorkoutIndex === index && (
                  <tr>
                    <td colSpan="3">
                      <table className="nested-table">
                        <thead>
                          <tr>
                            <th>Exercise</th>
                            <th>Reps</th>
                          </tr>
                        </thead>
                        <tbody>
                          {workout.map((exercise, exIndex) => (
                            <tr key={exIndex}>
                              <td>{exercise.exercise}</td>
                              <td>{exercise.counter}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
            </div> )                     
            }
        </>
    )
}

export default MyWorkouts;