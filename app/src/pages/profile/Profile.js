import { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ username: '', profilePicture: null });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');

        const response = await axios.get(`http://localhost:3000/api/profile/${username}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
        setFormData({
          username: response.data.username,
          profilePicture: null
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePicture') {
      setFormData(prev => ({ ...prev, profilePicture: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      data.append('username', formData.username);
      if (formData.profilePicture) {
        data.append('profilePicture', formData.profilePicture);
      }

      await axios.put('http://localhost:3000/api/profile/update', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:3000/api/profile/delete', {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.clear();
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  if (!user) return <div className="loading">Loading profile...</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        {user.profilePicture ? (
          <img
            src={user.profilePicture}
            alt={user.username}
            className="profile-picture"
          />
        ) : (
          <div className="no-picture">No Picture</div>
        )}
        {editMode ? (
          <>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="edit-input"
            />
            <input
              type="file"
              name="profilePicture"
              accept="image/*"
              onChange={handleChange}
              className="edit-file"
            />
          </>
        ) : (
          <h2>{user.username}</h2>
        )}
        {user.isVerified && <div className="verified-badge">Verified ✓</div>}
      </div>

      <div className="profile-details">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Status:</strong> {user.isVerified ? 'Verified' : 'Unverified'}</p>

        {user.isFlagged && (
          <div className="flagged-warning">
            <strong>Flagged:</strong> {user.flaggedReason || 'Flagged without a reason'}
          </div>
        )}
      </div>

      <div className="profile-timestamps">
        <p>Created: {new Date(user.createdAt).toLocaleDateString()}</p>
        <p>Last Update: {new Date(user.updatedAt).toLocaleDateString()}</p>
      </div>

      <div className="profile-buttons">
        {editMode ? (
          <>
            <button className="save-button" onClick={handleUpdate}>Save</button>
            <button className="cancel-button" onClick={() => setEditMode(false)}>Cancel</button>
          </>
        ) : (
          <button className="edit-button" onClick={() => setEditMode(true)}>Edit Profile</button>
        )}
        <button className="delete-button" onClick={handleDelete}>Delete Profile</button>
      </div>
    </div>
  );
};

export default Profile;
