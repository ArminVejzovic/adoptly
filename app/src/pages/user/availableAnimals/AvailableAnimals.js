import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AvailableAnimals.css';

const AvailableAnimals = () => {
  const [animals, setAnimals] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/adoption/available-animals', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAnimals(res.data);
        console.log(res.data);
      } catch (err) {
        console.error('Error fetching animals:', err);
      }
    };

    fetchAnimals();
  }, []);

  const handleAdopt = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:3000/api/adoption/create-adoption-request',
        {
          animalId: selectedAnimal._id,
          message,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setFeedback('Request sent successfully!');
      setSelectedAnimal(null);
      setMessage('');
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Error sending request.');
    }
  };

  const bufferToBase64 = (profileImage) => {
    if (!profileImage?.base64) return null;
    return `data:${profileImage.contentType};base64,${profileImage.base64}`;
  };

  return (
    <div className="adoption-gallery">
      <h2>Available Animals for Adoption</h2>
      <div className="animal-grid">
        {animals.map(animal => (
          <div key={animal._id} className="animal-card" onClick={() => setSelectedAnimal(animal)}>
            {animal.profileImage?.base64 ? (
              <img src={bufferToBase64(animal.profileImage)} alt={animal.name} />
            ) : (
              <div className="no-image">No Image</div>
            )}
            <h3>{animal.name}</h3>
            <p>{animal.breed} • {animal.age} years</p>
          </div>
        ))}
      </div>

      {selectedAnimal && (
        <div className="modal-overlay" onClick={() => setSelectedAnimal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={() => setSelectedAnimal(null)}>×</button>
            <h2>{selectedAnimal.name}</h2>
            {selectedAnimal.profileImage?.base64 && (
              <img
                src={bufferToBase64(selectedAnimal.profileImage)}
                alt={selectedAnimal.name}
              />
            )}
            <p><strong>Breed:</strong> {selectedAnimal.breed}</p>
            <p><strong>Age:</strong> {selectedAnimal.age}</p>
            <p><strong>Description:</strong> {selectedAnimal.description}</p>

            <textarea
              placeholder="Message to owner (optional)"
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
            <button onClick={handleAdopt} className="submit-button">Send Adoption Request</button>

            {feedback && <p className="feedback">{feedback}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailableAnimals;
