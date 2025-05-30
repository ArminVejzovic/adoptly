import React, { useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './CreateAdmin.css';

const CreateAdmin = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError({});
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError({ confirmPassword: 'Passwords do not match' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const { confirmPassword, ...dataToSend } = form;

      await axios.post('http://localhost:3000/api/create-admin', dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage('Admin successfully created.');
      setForm({ username: '', email: '', password: '', confirmPassword: '' });
    } catch (err) {
      const field = err.response?.data?.field;
      const msg = err.response?.data?.message || 'Error creating admin';

      if (field) setError({ [field]: msg });
      else setError({ general: msg });
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Admin 🛠️</h2>
      <p className="subtitle">Fill in the details to create a new admin</p>
      <form onSubmit={handleSubmit}>
        <input
          className={error.username ? 'input-error' : ''}
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        {error.username && <p className="error-msg">{error.username}</p>}

        <input
          className={error.email ? 'input-error' : ''}
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        {error.email && <p className="error-msg">{error.email}</p>}

        <div className="password-container">
          <input
            className={error.password ? 'input-error' : ''}
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="show-hide-btn"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {error.password && <p className="error-msg">{error.password}</p>}

        <div className="password-container">
          <input
            className={error.confirmPassword ? 'input-error' : ''}
            type={showConfirm ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="show-hide-btn"
            onClick={() => setShowConfirm((prev) => !prev)}
          >
            {showConfirm ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {error.confirmPassword && <p className="error-msg">{error.confirmPassword}</p>}

        {error.general && <p className="error-msg">{error.general}</p>}
        {message && <p className="error-msg" style={{ color: 'green' }}>{message}</p>}

        <button type="submit">Create Admin</button>
      </form>
    </div>
  );
};

export default CreateAdmin;