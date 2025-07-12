import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdoptionOverview.css';

const AdminAdoptionOverview = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/adoption-overview', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(res.data);
      } catch (err) {
        console.error('Failed to fetch requests', err);
      }
    };

    fetchRequests();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}.`;
  };

  return (
    <div className="overview-container">
      <h2>All Adoption Applications</h2>
      <table className="overview-table">
        <thead>
          <tr>
            <th>Animal</th>
            <th>Requester</th>
            <th>Owner</th>
            <th>Message</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(req => (
            <tr key={req._id}>
              <td>{req.animal?.name}</td>
              <td>{req.requester?.username} ({req.requester?.email})</td>
              <td>{req.owner?.username} ({req.owner?.email})</td>
              <td>{req.message || 'No message'}</td>
              <td>{req.status}</td>
              <td>{formatDate(req.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="overview-cards">
        {requests.map(req => (
          <div className="overview-card" key={req._id}>
            <p><span className="label">🐾 Animal:</span> {req.animal?.name} ({req.animal?.species})</p>
            <p><span className="label">👤 Requester:</span> {req.requester?.username} ({req.requester?.email})</p>
            <p><span className="label">📦 Owner:</span> {req.owner?.username} ({req.owner?.email})</p>
            <p><span className="label">💬 Message:</span> {req.message || 'No message'}</p>
            <p><span className="label">📌 Status:</span> {req.status}</p>
            <p><span className="label">📅 Date:</span> {formatDate(req.createdAt)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAdoptionOverview;
