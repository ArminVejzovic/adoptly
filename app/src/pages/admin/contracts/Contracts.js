import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Contracts.css';

const Contract = () => {
  const [contracts, setContracts] = useState([]);
  const token = localStorage.getItem('token');

  const fetchContracts = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/contract/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContracts(res.data);
    } catch (err) {
      console.error('Failed to fetch contracts', err);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

   const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };


  return (
    <div className="contract-manager">
      <h2>Adoption Contracts</h2>
      {contracts.map(contract => (
        contract.application ? (
            <div key={contract._id} className="contract-card">
            <p><strong>Animal:</strong> {contract.application.animal?.name}</p>
            <p><strong>Owner:</strong> {contract.application.animal?.owner.username}</p>
            <p><strong>Requester:</strong> {contract.application.requester.username}</p>
           <p><strong>Created At:</strong> {formatDate(contract.createdAt)}</p>
            <a
                href={`data:application/pdf;base64,${btoa(
                new Uint8Array(contract.pdfData.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
                )}`}
                download={`contract_${contract.application.animal?.name}.pdf`}
            >
                Download PDF
            </a>
            </div>
        ) : null
        ))}
    </div>
  );
};

export default Contract;
