import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MotivationBanner.css';

const MotivationBanner = () => {
  const [message, setMessage] = useState('');
  const [lastFetched, setLastFetched] = useState(null);

  const fetchMotivation = async () => {
    try {
        const token = localStorage.getItem('token');;
        const res = await axios.get('http://localhost:3000/api/motivation', {
        headers: { Authorization: `Bearer ${token}` }
        });
      setMessage(res.data.message);
      setLastFetched(Date.now());
    } catch (err) {
      console.error('Failed to fetch motivation:', err);
    }
  };

  useEffect(() => {
    const now = Date.now();
    if (!lastFetched || now - lastFetched > 12 * 60 * 60 * 1000) {
      fetchMotivation();
    }

    const interval = setInterval(fetchMotivation, 12 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="motivation-banner">
      <p>{message || 'Loading motivational message...'}</p>
    </div>
  );
};

export default MotivationBanner;
