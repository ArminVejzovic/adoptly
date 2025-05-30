import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserListAdmin.css';

const UserListAdmin = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:3000/api/users-management/users?search=${search}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleBanToggle = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:3000/api/users-management/${id}/toggle-ban`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error('Error toggling ban status', err);
    }
  };

  return (
    <div className="user-list-container">
      <h2>Manage Users</h2>
      <input
        type="text"
        placeholder="Search by username or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <table className="user-table">
        <thead>
          <tr>
            <th>Username</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.isFlagged ? 'Banned' : 'Active'}</td>
              <td>
                <button onClick={() => handleBanToggle(user._id)}>
                  {user.isFlagged ? 'Unban' : 'Ban'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserListAdmin;
