import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './auth.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const RegisterPage = () => {
  const BASE_URL = process.env.REACT_APP_BACKEND_URL;

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Registering...');

    if (form.password !== form.confirmPassword) {
      setError({ confirmPassword: 'Passwords do not match' });
      setTimeout(() => setError({}), 4000);
      return;
    }

    try {
      const { confirmPassword, ...dataToSend } = form;
      await axios.post(`${BASE_URL}/api/auth/register`, dataToSend);
      navigate('/login');
    } catch (err) {
      if (err.response?.data?.message) {
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

        {/* Password */}
        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            className={error.general ? 'input-error' : ''}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="show-hide-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="password-container">
          <input
            type={showConfirm ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Confirm Password"
            className={error.confirmPassword ? 'input-error' : ''}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="show-hide-btn"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {error.confirmPassword && <p className="error-msg">{error.confirmPassword}</p>}

        <select name="role" onChange={handleChange}>
          <option value="user">Animal Adopter</option>
          <option value="owner">Animal Owner</option>
          <option value="volunteer">Adoptly Volunteer</option>
        </select>

        {error.general && <p className="error-msg">{error.general}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
