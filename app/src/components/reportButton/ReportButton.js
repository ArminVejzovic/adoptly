import React, { useState } from 'react';
import axios from 'axios';
import './ReportButton.css';

const ReportButton = ({ reportedType, reportedId }) => {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  const handleSubmit = async () => {
    try {
      await axios.post(
        'http://localhost:3000/api/admin/reports',
        {
          targetModel: reportedType === 'animal' ? 'Animal'
                       : reportedType === 'user' ? 'User'
                       : reportedType === 'blog' ? 'BlogPost'
                       : reportedType === 'comment' ? 'Comment'
                       : '',
          targetId: reportedId,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess('Report submitted successfully.');
      setError(null);
      setDescription('');
      setTimeout(() => {
        setOpen(false);
        setSuccess(null);
      }, 1500);
    } catch (err) {
      setSuccess(null);
      setError(err.response?.data?.message || 'Error submitting report.');
    }
  };

  return (
    <div className="report-button-container">
      <button className="report-btn" onClick={() => setOpen(true)}>
        🚩 Report
      </button>

      {open && (
        <div className="report-modal">
          <h3>Report {reportedType}</h3>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue..."
          />
          <div className="report-actions">
            <button onClick={handleSubmit}>Submit</button>
            <button onClick={() => setOpen(false)}>Cancel</button>
          </div>
          {success && <p className="success">{success}</p>}
          {error && <p className="error">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default ReportButton;
