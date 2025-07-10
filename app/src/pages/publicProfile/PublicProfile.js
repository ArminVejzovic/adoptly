import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReportButton from '../../components/reportButton/ReportButton.js';
import './PublicProfile.css';

const PublicProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:3000/api/profile/${username}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setUser(response.data);
        
      } catch (error) {
        console.error('Error fetching public profile:', error);
      }
    };
    fetchProfile();
  }, [username]);

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
        <h2>{user.username}</h2>
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
      

      <div className="profile-actions">
        <ReportButton reportedType="user" reportedId={user._id} />
      </div>
    </div>
  );
};

export default PublicProfile;
