import React from 'react';
import { FaUserCog, FaUsers, FaClipboardList, FaBlog, FaComments, FaFileContract } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Logout from '../../../components/logout/Logout';
import NotificationBell from '../../../components/notificationBell/NotificationBell';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const dashboardItems = [
    { title: 'Create Admin', icon: <FaUsers />, link: '/create-admin' },
    { title: 'User Management', icon: <FaUsers />, link: '/admin/users' },
    { title: 'Adoption Applications', icon: <FaClipboardList />, link: '/admin/applications' },
    { title: 'Blog CMS', icon: <FaBlog />, link: '/admin/create-blog' },
    { title: 'Blog Edit', icon: <FaBlog />, link: '/admin/blog-management' },
    { title: 'App Stats', icon: <FaClipboardList />, link: '/admin/stats' },
    { title: 'App Species', icon: <FaClipboardList />, link: '/add-species' },
    { title: 'Profile', icon: <FaUserCog />, link: '/profile' },
    { title: 'Reports', icon: <FaClipboardList />, link: '/admin/reports' },
    { title: 'Handle Reports', icon: <FaClipboardList />, link: '/admin/handle-reports' },
    { title: 'Contracts', icon: <FaFileContract />, link: '/contracts' },
    { title: 'Chat', icon: <FaComments />, link: '/chat' },
    { title: 'Chat GPT', icon: <FaComments />, link: '/chat-gpt' },
  ];

  return (
    <div className="admin-dashboard-container">
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

export default AdminDashboard;
