import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './PublicProfile.css'; 

const PublicProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [reviewStats, setReviewStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportDescription, setReportDescription] = useState('');
  const [reportFeedback, setReportFeedback] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:3000/api/profile/${username}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (error) {
        console.error('Error fetching public profile:', error);
      }
    };

    if (username) fetchProfile();
  }, [username]);

  useEffect(() => {
    const fetchReviewsStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:3000/api/profile/reviews/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReviewStats(res.data);
      } catch (error) {
        console.error('Error fetching review stats:', error);
      }
    };

    if (user && username) fetchReviewsStats();
  }, [user, username]);

  if (!user) {
    return <div className="loading">Loading profile...</div>;
  }

  const handleSubmitReport = async () => {
    if (!reportDescription.trim()) {
      setReportFeedback('Please enter a description.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.post(
        'http://localhost:3000/api/admin/reports',
        {
          targetModel: 'User',
          targetId: user._id,
          description: reportDescription,
        },
        { headers }
      );

      setReportFeedback('Report submitted successfully!');
      setReportDescription('');
      setTimeout(() => {
        setShowReportModal(false);
        setReportFeedback(null);
      }, 1500);
    } catch (error) {
      console.error(error);
      setReportFeedback(
        error.response?.data?.message || 'Failed to submit report.'
      );
    }
  };

  return (
    <div className="profile-container">
      <div className="section">
        <h2>User Info</h2>
        {user.profilePicture ? (
          <img src={user.profilePicture} alt="Profile" className="profile-picture" />
        ) : (
          <div className="no-picture">No Picture</div>
        )}
        <div className="profile-rating">
          <strong>Rating:</strong>{' '}
          {[...Array(5)].map((_, index) => (
            <span key={index}>
              {index < Math.round(reviewStats.averageRating) ? '⭐' : '☆'}
            </span>
          ))}{' '}
          ({reviewStats.averageRating} / 5)
        </div>
        <h3>{user.username}</h3>
      </div>

      <div className="section">
        <h2>Account Details</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>

      <div className="section">
        <button className="report-button" onClick={() => setShowReportModal(true)}>
          Report User
        </button>
      </div>

      {showReportModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Report User: {user.username}</h3>
            <textarea
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              placeholder="Enter reason for reporting..."
              rows="4"
            />
            {reportFeedback && <p className="feedback">{reportFeedback}</p>}
            <div className="modal-actions">
              <button className="report-button" onClick={handleSubmitReport}>Submit Report</button>
              <button className="cancel-button-edit" onClick={() => setShowReportModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="section">
        <h2>Meta Info</h2>
        <p><strong>Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        <p><strong>Last Update:</strong> {new Date(user.updatedAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default PublicProfile;
