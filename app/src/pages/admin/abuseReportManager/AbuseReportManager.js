import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './AbuseReportManager.css';

const AbuseReportManager = () => {
  const [reports, setReports] = useState([]);
  const [collapse, setCollapse] = useState({
    open: true,
    resolved: false,
    rejected: false,
  });

  const token = localStorage.getItem('token');

  const fetchReports = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/admin/reports', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(res.data);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    }
  }, [token]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const changeStatus = async (id, newStatus) => {
    try {
      await axios.put(
        `http://localhost:3000/api/admin/reports/${id}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchReports();
    } catch (err) {
      console.error('Failed to update report status:', err);
    }
  };

  const grouped = reports.reduce((acc, report) => {
    acc[report.status] = acc[report.status] || [];
    acc[report.status].push(report);
    return acc;
  }, {});

  return (
    <div className="abuse-report-manager">
      <h2>Abuse Reports Management</h2>

      {['open', 'resolved', 'rejected'].map((status) => (
        <div key={status} className="report-section">
          <div
            className="section-header"
            onClick={() =>
              setCollapse((prev) => ({
                ...prev,
                [status]: !prev[status],
              }))
            }
          >
            <h3>
              {status.toUpperCase()} ({grouped[status]?.length || 0})
            </h3>
            <span>{collapse[status] ? '▲' : '▼'}</span>
          </div>

          {collapse[status] && (
            <div className="report-list">
              {(grouped[status] || []).map((rep) => (
                <div key={rep._id} className="report-card">
                  <p>
                    <strong>Reporter:</strong>{' '}
                    {rep.reporter?.username} ({rep.reporter?.email})
                  </p>

                  <p>
                    <strong>Target Model:</strong> {rep.targetModel}
                  </p>

                  {rep.targetModel === 'Comment' ? (
                    <p>
                        <strong>Comment Message:</strong>{' '}
                        {rep.targetDisplay || rep.targetId}
                    </p>
                    ) : rep.targetModel === 'Animal' ? (
                    <>
                        <p>
                        <strong>Target:</strong>{' '}
                        {rep.targetDisplay || rep.targetId}
                        </p>
                        {rep.animalOwner && (
                        <p>
                            <strong>Owner:</strong> {rep.animalOwner}
                        </p>
                        )}
                    </>
                    ) : (
                    <p>
                        <strong>Target:</strong>{' '}
                        {rep.targetDisplay || rep.targetId}
                    </p>
                    )}


                  {rep.targetModel === 'Comment' && (
                    <>
                      {rep.authorDisplay && (
                        <p>
                          <strong>Comment Author:</strong>{' '}
                          {rep.authorDisplay}
                        </p>
                      )}
                      {rep.contextDisplay && (
                        <p>
                          <strong>Context:</strong>{' '}
                          {rep.contextModel} → {rep.contextDisplay}
                        </p>
                      )}
                    </>
                  )}

                  <p>
                    <strong>Description:</strong> {rep.description}
                  </p>

                  <p>
                    <strong>Date:</strong>{' '}
                    {new Date(rep.createdAt).toLocaleString()}
                  </p>

                  <div className="status-buttons">
                    {['open', 'resolved', 'rejected'].map((s) => (
                      <button
                        key={s}
                        disabled={rep.status === s}
                        onClick={() => changeStatus(rep._id, s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AbuseReportManager;
