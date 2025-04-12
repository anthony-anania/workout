import React, { useState } from 'react';

const CalorieResult = ({ calorieNeeds }) => {
    const [goal, setGoal] = useState('maintain');
    const [adjustedCalories, setAdjustedCalories] = useState(calorieNeeds);

    const handleGoalChange = (e) => {
        const selectedGoal = e.target.value;
        setGoal(selectedGoal);

        let adjustment = 0;
        if (selectedGoal === 'bulk') {
            adjustment = 500; // Add 500 calories for bulking
        } else if (selectedGoal === 'cut') {
            adjustment = -500; // Subtract 500 calories for cutting
        }

        setAdjustedCalories((parseFloat(calorieNeeds) + adjustment).toFixed(2));
    };

    return (
        <div className="calorie-result">
            <h2>Daily Calorie Needs</h2>
            <p>Your calculated daily calorie needs are: <strong>{calorieNeeds}</strong> calories.</p>
            <div>
                <label>Fitness Goal:</label>
                <select value={goal} onChange={handleGoalChange}>
                    <option value="maintain">Maintain</option>
                    <option value="bulk">Bulk (gain weight)</option>
                    <option value="cut">Cut (lose weight)</option>
                </select>
            </div>
            <p>Adjusted calorie needs based on your goal: <strong>{adjustedCalories}</strong> calories/day.</p>
        </div>
    );
};

export default CalorieResult;