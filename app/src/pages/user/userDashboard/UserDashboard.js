import React from 'react';
import { FaPlusCircle, FaPaw, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Logout from '../../../components/logout/Logout';
import './UserDashboard.css';

const UserDashboard = () => {
  const dashboardItems = [
    {
      title: 'Adopt Animal',
      icon: <FaPlusCircle size={40} />,
      link: '/available-animals'
    },
    {
      title: 'Profile',
      icon: <FaUser size={40} />,
      link: '/profile'
    },
    {
      title: 'Wishlist',
      icon: <FaPaw size={40} />,
      link: '/wishlist-animals'
    }, 
    {
      title: 'Adoption Requests',
      icon: <FaPaw size={40} />,
      link: '/adoption-requests'
    },
    {
      title: 'AI Animal Recommender ',
      icon: <FaPaw size={40} />,
      link: '/ai-recommender'
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
    }
  ];

  return (
    <div className="dashboard-container">
      <h2>User Dashboard</h2>
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

export default UserDashboard;
