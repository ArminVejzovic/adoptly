import React from 'react'
import { useNavigate } from 'react-router-dom';

const GuestDashboard = () => {
  const navigate = useNavigate();
  return (
    <div>GuestDashboard
      <button onClick={() => navigate('/login')}>Login</button>
      <button onClick={() => navigate('/register')}>Register</button>
    </div>
  )
}

export default GuestDashboard