import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './AdoptionRequestsOwner.css';

const AdoptionRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/control-adoption/my-requests', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching adoption requests:', error);
      }
    };
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/api/control-adoption/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(prev => prev.map(r => r._id === id ? { ...r, status: 'approved' } : r));
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/api/control-adoption/${id}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(prev => prev.map(r => r._id === id ? { ...r, status: 'rejected' } : r));
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  return (
    <div className="requests-container">
      <h2>Adoption Requests</h2>
      {requests.length === 0 ? (
        <p>No adoption requests found.</p>
      ) : (
        requests.map(req => (
          <div key={req._id} className="request-card">
            <p><strong>Animal:</strong> {req.animal?.name}</p>
            <div className="requester-line">
              <p><strong>Requester:</strong></p>
              <Link to={`/profile/${req.requester?.username}`}>
                <p className="requester-username">{req.requester?.username}</p>
              </Link>
            </div>
            <p><strong>Message:</strong> {req.message || 'No message'}</p>
            <p><strong>Status:</strong> {req.status}</p>
            {req.status === 'pending' && (
              <div className="actions">
                <button onClick={() => handleApprove(req._id)}>Approve</button>
                <button onClick={() => handleReject(req._id)}>Reject</button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AdoptionRequests;
