import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './auth.css';

const RegisterPage = () => {
  const BASE_URL = process.env.REACT_APP_BACKEND_URL;

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [error, setError] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Registering...');
    try {
      await axios.post(`${BASE_URL}/api/auth/register`, form);
      navigate('/login');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError({ general: err.response.data.message });
      } else {
        setError({ general: 'Registration failed. Try again.' });
      }
      setTimeout(() => setError({}), 4000);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register to Adoptly 🐾</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          className={error.general ? 'input-error' : ''}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className={error.general ? 'input-error' : ''}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className={error.general ? 'input-error' : ''}
          onChange={handleChange}
          required
        />
        <select name="role" onChange={handleChange}>
          <option value="user">Usvojitelj</option>
          <option value="owner">Vlasnik</option>
          <option value="volunteer">Volonter</option>
        </select>
        {error.general && <p className="error-msg">{error.general}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
