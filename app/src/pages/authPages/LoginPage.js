import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './auth.css';

const LoginPage = () => {
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
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
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
            navigate('/dashboard');
        }
      } else {
        if (data.field === 'email') {
          setError({ email: data.message });
        } else if (data.field === 'password') {
          setError({ password: data.message });
        } else {
          setError({ general: data.message });
        }
        setTimeout(() => setError({}), 4000);
      }
    } catch (err) {
      setError({ general: 'Login failed. Please try again.' });
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