import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdoptionRequestsUser.css';

const AdoptionRequestUser = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const res = await axios.get('http://localhost:3000/api/show-adoption-requests/my-requests', { headers });
        setRequests(res.data);
      } catch (err) {
        console.error('Greška pri dohvaćanju zahtjeva:', err);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="adoption-requests-container">
      <h2>Moji zahtjevi za usvajanje</h2>
      <div className="adoption-requests-list">
        {requests.length === 0 ? (
          <p>Nema zahtjeva za prikaz.</p>
        ) : (
          requests.map((req) => (
            <div className="adoption-request-card" key={req._id}>
              <h3>{req.animal?.name || 'Nepoznata životinja'}</h3>
              <p><strong>Status:</strong> {req.status}</p>
              <p><strong>Poruka:</strong> {req.message}</p>
              <p>
                <strong>Vlasnik:</strong>{' '}
                {req.owner?.username ? (
                  <a href={`/profile/${req.owner.username}`}>
                    {req.owner.username}
                  </a>
                ) : (
                  'Nepoznat'
                )}
              </p>

              <p><strong>Datum:</strong> {new Date(req.createdAt).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdoptionRequestUser;
