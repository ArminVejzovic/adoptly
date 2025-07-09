import React from 'react';
import { FaPlusCircle, FaPaw, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Logout from '../../../components/logout/Logout';
import './OwnerDashboard.css';

const OwnerDashboard = () => {
  const dashboardItems = [
    {
      title: 'Add Animal',
      icon: <FaPlusCircle size={40} />,
      link: '/add-animal'
    },
    {
      title: 'Profile',
      icon: <FaUser size={40} />,
      link: '/profile'
    },
    {
      title: 'My Animals Page',
      icon: <FaPaw size={40} />,
      link: '/my-animals'
    }, 
    {
      title: 'Adoption Requests',
      icon: <FaPaw size={40} />,
      link: '/adoption-requests-owner'
    },
    {
      title: 'Reviews',
      icon: <FaPaw size={40} />,
      link: '/reviews'
    },
    {
      title: 'Blogs',
      icon: <FaPaw size={40} />,
      link: '/blogs'
    }, 
    {
      title: 'Chat',
      icon: <FaPaw size={40} />,
      link: '/chat'
    }
  ];

  return (
    <div className="dashboard-container">
      <h2>Owner Dashboard</h2>
      <div className="dashboard-grid">
        {dashboardItems.map((item, idx) => (
          <Link to={item.link} key={idx} className="dashboard-item">
            {item.icon}
            <span>{item.title}</span>
          </Link>
        ))}
      </div>
      <Logout />
    </div>
  );
};

export default OwnerDashboard;
