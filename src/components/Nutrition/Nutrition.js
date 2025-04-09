import React, { useState } from 'react';
import './Nutrition.css';
import CalorieResult from './CalorieResult';

const Nutrition = () => {
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    activityLevel: '1.2',
  });
  const [calories, setCalories] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { age, weight, height, activityLevel } = formData;

    // Basic calorie calculation using the Mifflin-St Jeor Equation
    const bmr = 10 * weight + 6.25 * height - 5 * age + 5; // For males
    const dailyCalories = bmr * parseFloat(activityLevel);

    setCalories(dailyCalories.toFixed(2));
  };

  return (
    <div>
      <h1>Nutrition Page</h1>
      <p>Calculate your daily calorie needs:</p>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div>
            <label>Age (years):</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Weight (kg):</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Height (cm):</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Activity Level:</label>
            <select
              name="activityLevel"
              value={formData.activityLevel}
              onChange={handleChange}
            >
              <option value="1.2">Sedentary (little or no exercise)</option>
              <option value="1.375">Lightly active (light exercise/sports 1-3 days/week)</option>
              <option value="1.55">Moderately active (moderate exercise/sports 3-5 days/week)</option>
              <option value="1.725">Very active (hard exercise/sports 6-7 days/week)</option>
              <option value="1.9">Extra active (very hard exercise/physical job)</option>
            </select>
          </div>
          <button type="submit">Calculate</button>
        </form>
      </div>
      {calories && <CalorieResult calorieNeeds={calories} />}
    </div>
  );
};

export default Nutrition;