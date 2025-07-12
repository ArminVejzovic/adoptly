import React from 'react';
import { FaPlusCircle, FaPaw, FaUser, FaHeart, FaComments, FaBlog, FaRobot } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Logout from '../../../components/logout/Logout';
import NotificationBell from '../../../components/notificationBell/NotificationBell';
import './UserDashboard.css';

const UserDashboard = () => {
  const dashboardItems = [
    { title: 'Adopt', icon: <FaPlusCircle />, link: '/available-animals' },
    { title: 'Profile', icon: <FaUser />, link: '/profile' },
    { title: 'Wishlist', icon: <FaHeart />, link: '/wishlist-animals' },
    { title: 'Requests', icon: <FaPaw />, link: '/adoption-requests' },
    { title: 'AI Recommender', icon: <FaRobot />, link: '/ai-recommender' },
    { title: 'Reviews', icon: <FaComments />, link: '/reviews' },
    { title: 'Blogs', icon: <FaBlog />, link: '/blogs' },
    { title: 'Chat', icon: <FaComments />, link: '/chat' }
  ];

  return (
    <div className="user-dashboard-container">
      <div className="top-bar">
        <div className="notifications">
          <NotificationBell />
        </div>
        <div className="logout-btn">
          <Logout />
        </div>
      </div>

      <div className="dashboard-header">
        <h2>Welcome, Animal Adopter!</h2>
      </div>

      <div className="dashboard-grid">
        {dashboardItems.map((item, idx) => (
          <Link to={item.link} key={idx} className="dashboard-card">
            <div className="icon-wrapper">{item.icon}</div>
            <span>{item.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
