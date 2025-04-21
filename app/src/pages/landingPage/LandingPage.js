import React from 'react';
import { useNavigate } from 'react-router-dom';
import './landingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>Welcome to Adoptly 🐾</h1>
        <p>Find your new best friend – adopt, foster, or help animals in need.</p>
        <div className="landing-buttons">
          <button onClick={() => navigate('/login')}>Login</button>
          <button onClick={() => navigate('/register')}>Register</button>
          <button onClick={() => navigate('/guest')}>Continue as Guest</button>
        </div>
      </div>
      <div className="landing-hero">
        <img src="https://images.unsplash.com/photo-1601758123927-1967f397e6f1" alt="Happy pets" />
      </div>
    </div>
  );
};

export default LandingPage;