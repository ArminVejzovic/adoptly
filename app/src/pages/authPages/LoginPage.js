import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './auth.css';

const LoginPage = () => {
  const BASE_URL = process.env.REACT_APP_BACKEND_URL;

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, form);
      const data = res.data;

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('username', data.username);

      switch (data.role) {
        case 'admin':
          navigate('/admin-dashboard');
          break;
        case 'owner':
          navigate('/owner-dashboard');
          break;
        case 'volunteer':
          navigate('/volunteer-dashboard');
          break;
        default:
          navigate('/user-dashboard');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      const field = err.response?.data?.field;

      if (field === 'email') {
        setError({ email: message });
      } else if (field === 'password') {
        setError({ password: message });
      } else {
        setError({ general: message });
      }

      setTimeout(() => setError({}), 4000);
    }
  };

  return (
    <div className="auth-container">
      <h2>Welcome Back 🐶</h2>
      <p className="subtitle">Log in to find your future furry friend 🐾</p>
      <form onSubmit={handleSubmit}>
        <input
          className={error.email ? 'input-error' : ''}
          type="text"
          name="email"
          placeholder="Email or Username"
          onChange={handleChange}
          required
        />
        {error.email && <p className="error-msg">{error.email}</p>}

        <input
          className={error.password ? 'input-error' : ''}
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        {error.password && <p className="error-msg">{error.password}</p>}

        {error.general && <p className="error-msg">{error.general}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
