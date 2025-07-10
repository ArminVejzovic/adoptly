import { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    location: '',
    profilePicture: null
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: ''
  });

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
          bio: response.data.bio || '',
          location: response.data.location || '',
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
    } else if (name === 'currentPassword' || name === 'newPassword') {
      setPasswordData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      data.append('username', formData.username);
      data.append('bio', formData.bio);
      data.append('location', formData.location);
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

  const handleChangePassword = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:3000/api/profile/change-password', passwordData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Password changed successfully');
    } catch (error) {
      alert('Failed to change password');
      console.error(error);
    }
  };

  const handleRemovePicture = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:3000/api/profile/remove-picture', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.reload();
    } catch (error) {
      console.error('Failed to remove picture:', error);
    }
  };

  if (!user) return <div className="loading">Loading profile...</div>;

  return (
    <div className="profile-container">
      <div className="section">
        <h2>Profile Info</h2>
        {user.profilePicture ? (
          <img src={user.profilePicture} alt="Profile" className="profile-picture" />
        ) : (
          <div className="no-picture">No Picture</div>
        )}

        {editMode ? (
          <>
            <label>Username:</label>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="edit-input"
            />
            <label>Change Profile Picture:</label>
            <input
              type="file"
              name="profilePicture"
              accept="image/*"
              onChange={handleChange}
              className="edit-file"
            />
            {user.profilePicture && (
              <button onClick={handleRemovePicture} className="remove-pic-button">
                Remove Profile Picture
              </button>
            )}
          </>
        ) : (
          <h3>{user.username}</h3>
        )}

        {user.isVerified && <div className="verified-badge">Verified ✓</div>}
      </div>

      <div className="section">
        <h2>Account Details</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>

      </div>

    
      {editMode && (
        <div className="section">
          <h2>Change Password</h2>
          <input
            type="password"
            name="currentPassword"
            placeholder="Current password"
            onChange={handleChange}
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New password"
            onChange={handleChange}
          />
          <button onClick={handleChangePassword} className="change-password-button">
            Change Password
          </button>
        </div>
      )}

      <div className="section">
        <h2>Meta Info</h2>
        <p><strong>Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        <p><strong>Last Update:</strong> {new Date(user.updatedAt).toLocaleDateString()}</p>
      </div>

      <div className="section profile-buttons">
        {editMode ? (
          <>
            <button className="save-button" onClick={handleUpdate}>💾 Save Changes</button>
            <button className="cancel-button" onClick={() => setEditMode(false)}>❌ Cancel</button>
          </>
        ) : (
          <button className="edit-button" onClick={() => setEditMode(true)}>✏️ Edit Profile</button>
        )}
        <button className="delete-button" onClick={handleDelete}>🗑️ Delete Account</button>
      </div>
    </div>
  );
};

export default Profile;
