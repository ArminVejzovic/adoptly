import React from 'react';
import { FaUserCog, FaUsers, FaClipboardList, FaBlog } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Logout from '../../../components/logout/Logout';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const dashboardItems = [
    {
      title: 'Create Admin',
      icon: <FaUsers size={40} />,
      link: '/create-admin'
    },
    {
      title: 'User Management',
      icon: <FaUsers size={40} />,
      link: '/admin/users'
    },
    {
      title: 'Adoption Applications',
      icon: <FaClipboardList size={40} />,
      link: '/admin/applications'
    },
    {
      title: 'Blog CMS',
      icon: <FaBlog size={40} />,
      link: '/admin/create-blog'
    },
    {
      title: 'Blog Edit',
      icon: <FaBlog size={40} />,
      link: '/admin/blog-management'
    },
    {
      title: 'App Stats',
      icon: <FaBlog size={40} />,
      link: '/admin/stats'
    },
    {
      title: 'App Species',
      icon: <FaBlog size={40} />,
      link: '/add-species'
    },
    
    {
      title: 'Profile',
      icon: <FaUserCog size={40} />,
      link: '/profile'
    }
  ];

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>
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

export default AdminDashboard;
