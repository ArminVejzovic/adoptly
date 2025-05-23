import React, { useState } from 'react';
import axios from 'axios';
import './AiRecommender.css';

const AiRecommender = () => {
  const [form, setForm] = useState({
    home: '',
    children: '',
    lifestyle: '',
    preference: '',
    allergies: '',
    workHours: '',
    experience: '',
    notes: ''
  });
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const countFilledFields = () => {
    return Object.values(form).filter((v) => v.trim() !== '').length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (countFilledFields() < 3) {
      setErrorMsg("Please fill out at least 3 fields before submitting.");
      return;
    }

    setLoading(true);
    setRecommendation('');
    setErrorMsg('');

    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const res = await axios.post('http://localhost:3000/api/ai/recommend-pet', form, { headers });
      setRecommendation(res.data.recommendation);
    } catch (err) {
      console.error("Error:", err);
      setRecommendation("An error occurred while generating the recommendation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pet-recommendation-form">
      <h2>Pet Recommendation Assistant</h2>
      <form onSubmit={handleSubmit}>
        <label>Type of housing:
          <input name="home" onChange={handleChange} placeholder="e.g. Apartment with balcony" />
        </label>
        <label>Do you have children?
          <select name="children" onChange={handleChange}>
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
        <label>Lifestyle:
          <select name="lifestyle" onChange={handleChange}>
            <option value="">Select</option>
            <option value="active">Active</option>
            <option value="moderate">Moderate</option>
            <option value="sedentary">Sedentary</option>
          </select>
        </label>
        <label>Personal preferences (e.g. likes cats, dislikes birds):
          <input name="preference" onChange={handleChange} />
        </label>
        <label>Allergies in the household:
          <input name="allergies" onChange={handleChange} />
        </label>
        <label>Average working hours per day:
          <input name="workHours" type="number" min="0" max="24" onChange={handleChange} />
        </label>
        <label>Previous pet experience:
          <select name="experience" onChange={handleChange}>
            <option value="">Select</option>
            <option value="none">None</option>
            <option value="some">Some</option>
            <option value="experienced">Experienced</option>
          </select>
        </label>
        <label>Other notes (optional):
            <textarea name="notes" onChange={handleChange} placeholder="Any special requests, context, or preferences..." rows={4} />
        </label>

        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Generating recommendation..." : "Get Recommendation"}
        </button>
      </form>

      {recommendation && (
        <div className="recommendation-result">
          <h3>AI Recommendation:</h3>
          <p>{recommendation}</p>
        </div>
      )}
    </div>
  );
};

export default AiRecommender;
