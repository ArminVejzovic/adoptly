import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './NotificationBell.css';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const bellRef = useRef(null);
  const token = localStorage.getItem('token');

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 10000); // refresh svakih 10s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    try {
      await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotifications(); // refresh nakon update
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/notifications/read-all`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };

  const unread = notifications.filter((n) => !n.read);

  return (
    <div className="notification-bell" ref={bellRef}>
      <button onClick={() => setOpen(!open)}>
        🔔 {unread.length > 0 && <span className="badge">{unread.length}</span>}
      </button>

      <div className={`dropdown ${open ? 'open' : ''}`}>
        <div className="dropdown-header">
          <strong>Notifications</strong>
          {unread.length > 0 && (
            <button onClick={markAllAsRead} className="mark-all-btn">Mark all as read</button>
          )}
        </div>
        {notifications.slice(0, 5).map((n) => (
          <div key={n._id} className={`notif-item ${n.read ? '' : 'unread'}`}>
            <p>{n.content}</p>
            <a
              href={n.link}
              onClick={() => markAsRead(n._id)}
            >
              View
            </a>
          </div>
        ))}
        {notifications.length === 0 && <p className="empty">No notifications</p>}
      </div>
    </div>
  );
};

export default NotificationBell;
