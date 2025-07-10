import { useEffect, useState } from 'react';
import axios from 'axios';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data);
    };

    fetchNotifications();
  }, []);

  const unread = notifications.filter((n) => !n.read);

  return (
    <div className="notification-bell">
      <button>
        🔔 {unread.length > 0 && <span className="badge">{unread.length}</span>}
      </button>
      <div className="dropdown">
        {notifications.slice(0, 5).map((n) => (
          <div key={n._id} className={`notif-item ${n.read ? '' : 'unread'}`}>
            <p>{n.content}</p>
            <a href={n.link}>View</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationBell;