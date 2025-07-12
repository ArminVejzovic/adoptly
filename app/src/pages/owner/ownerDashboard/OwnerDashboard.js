import React from 'react';
import { FaPlusCircle, FaPaw, FaUser, FaComments, FaBlog } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Logout from '../../../components/logout/Logout';
import NotificationBell from '../../../components/notificationBell/NotificationBell';
import './OwnerDashboard.css';

const OwnerDashboard = () => {
  const dashboardItems = [
    { title: 'Add Animal', icon: <FaPlusCircle />, link: '/add-animal' },
    { title: 'Profile', icon: <FaUser />, link: '/profile' },
    { title: 'My Animals', icon: <FaPaw />, link: '/my-animals' },
    { title: 'Adoption Requests', icon: <FaPaw />, link: '/adoption-requests-owner' },
    { title: 'Reviews', icon: <FaComments />, link: '/reviews' },
    { title: 'Blogs', icon: <FaBlog />, link: '/blogs' },
    { title: 'Chat', icon: <FaComments />, link: '/chat' }
  ];

  return (
    <div className="owner-dashboard-container">
      <div className="top-bar">
        <div className="notifications">
          <NotificationBell />
        </div>
        <div className="logout-btn">
          <Logout />
        </div>
      </div>

      <div className="dashboard-header">
        <h2>Welcome to Your Dashboard</h2>
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

export default OwnerDashboard;
