import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (token && role) {
    switch (role) {
      case 'admin':
        return <Navigate to="/admin-dashboard" replace />;
      case 'owner':
        return <Navigate to="/owner-dashboard" replace />;
      default:
        return <Navigate to="/user-dashboard" replace />;
    }
  }

  return children;
};

export default PublicRoute;
