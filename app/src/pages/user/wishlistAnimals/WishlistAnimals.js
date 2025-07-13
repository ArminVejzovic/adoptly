import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './WishlistAnimals.css';

const WishlistAnimals = () => {
  const [animals, setAnimals] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const [showCommentReportModal, setShowCommentReportModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchAnimals = async () => {
      try {
        const res = await axios.get(
          'http://localhost:3000/api/wishlist/get-wishlist',
          { headers }
        );

       const animalsWithStats = await Promise.all(
        res.data.map(async (animal) => {
          const statRes = await axios.get(
            `http://localhost:3000/api/interact/stats/${animal._id}`,
            { headers }
          );

          // ⬇️ DOHVATI REVIEW
          const ratingRes = await axios.get(
            `http://localhost:3000/api/review/animal/${animal._id}`,
            { headers }
          );

          return {
            ...animal,
            stats: statRes.data,
            rating: ratingRes.data  // ⬅️ Dodaj review info ovdje
          };
        })
      );

setAnimals(animalsWithStats);
      } catch (err) {
        console.error('Error fetching wishlist animals:', err);
      }
    };

    fetchAnimals();
  }, []);

  const bufferToBase64 = (profileImage) => {
    if (!profileImage?.base64) return null;
    return `data:${profileImage.contentType};base64,${profileImage.base64}`;
  };



  const handleToggleWishlist = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    await axios.post(
      `http://localhost:3000/api/interact/wishlist/${selectedAnimal._id}`,
      {},
      { headers }
    );

    updateStats(selectedAnimal._id);
  };



  const updateStats = async (animalId) => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const res = await axios.get(
      `http://localhost:3000/api/interact/stats/${animalId}`,
      { headers }
    );

    setAnimals((prev) =>
      prev.map((a) =>
        a._id === animalId ? { ...a, stats: res.data } : a
      )
    );
  };

  const openAnimal = async (animal) => {
    setSelectedAnimal(animal);
  };

  const handleRemoveFromWishlist = async (animalId) => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.post(
        `http://localhost:3000/api/interact/wishlist/${animalId}`,
        {},
        { headers }
      );

  
      setAnimals((prev) => prev.filter((a) => a._id !== animalId));
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
    }
  };

 

  return (
    <div className="adoption-gallery">
      <h2>My Saved Animals</h2>
      {animals.length === 0 ? (
        <p>You have no saved animals in your wishlist.</p>
      ) : (
        <div className="animal-grid">
          {animals.map((animal) => (
            <div
              key={animal._id}
              className="animal-card"
              onClick={() => openAnimal(animal)}
            >
              {animal.profileImage?.base64 ? (
                <img
                  src={bufferToBase64(animal.profileImage)}
                  alt={animal.name}
                />
              ) : (
                <div className="no-image">No Image</div>
              )}
              <h3>{animal.name}</h3>
              <div className="animal-rating">
                {[...Array(5)].map((_, index) => (
                  <span key={index}>
                    {index < Math.round(animal.rating?.averageRating || 0) ? '⭐' : '☆'}
                  </span>
                ))}
                {' '}
                ({animal.rating?.averageRating?.toFixed(1) || '0.0'})
              </div>
              <p>
                {animal.breed} • {animal.age} years
              </p>
              <div className="animal-meta">
                <span>👍 {animal.stats?.likes || 0}</span>
                <span>💬 {animal.stats?.comments || 0}</span>
                <span>💾 {animal.stats?.saves || 0}</span>
              </div>
              <button
                className="wishlist-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFromWishlist(animal._id);
                }}
              >
                Remove from Wishlist
              </button>

            </div>
          ))}
        </div>
      )}

      {selectedAnimal && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedAnimal(null)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-button"
              onClick={() => setSelectedAnimal(null)}
            >
              ×
            </button>
            <h2>{selectedAnimal.name}</h2>
            {selectedAnimal.profileImage?.base64 && (
              <img
                src={bufferToBase64(selectedAnimal.profileImage)}
                alt={selectedAnimal.name}
              />
            )}
            <p>
              <strong>Breed:</strong> {selectedAnimal.breed}
            </p>
            <p>
              <strong>Age:</strong> {selectedAnimal.age}
            </p>
            <p><strong>Species:</strong> {selectedAnimal.species?.name}</p>
            <p><strong>Gender:</strong> {selectedAnimal.gender}</p>
            <p><strong>Size:</strong> {selectedAnimal.size}</p>
            <p><strong>Vaccinated:</strong> {selectedAnimal.vaccinated ? 'Yes' : 'No'}</p>
            <p><strong>Sterilized:</strong> {selectedAnimal.sterilized ? 'Yes' : 'No'}</p>
            <p>
              <strong>Description:</strong>{' '}
              {selectedAnimal.description}
            </p>
      </div>
    </div>
  )}
            

      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-button"
              onClick={() => setShowReportModal(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {showCommentReportModal && (
        <div className="modal-overlay" onClick={() => setShowCommentReportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-button"
              onClick={() => setShowCommentReportModal(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistAnimals;
