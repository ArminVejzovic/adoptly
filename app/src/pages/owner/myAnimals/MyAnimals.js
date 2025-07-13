import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MyAnimals.css';

function LocationSelector({ onChange }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onChange([lng, lat]);
    },
  });
  return null;
}

const MyAnimals = () => {
  const [animals, setAnimals] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState(null);

  const [commentText, setCommentText] = useState('');
  const [commentBeingReported, setCommentBeingReported] = useState(null);
  const [commentReportDescription, setCommentReportDescription] = useState('');
  const [commentReportFeedback, setCommentReportFeedback] = useState(null);

  const loggedInUsername = localStorage.getItem('username');

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(
        'http://localhost:3000/api/owner/my-animals',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const animalsWithStats = await Promise.all(
        res.data.map(async (animal) => {

          const ratingRes = await axios.get(
            `http://localhost:3000/api/review/animal/${animal._id}`,
            { headers }
          );

          return {
            ...animal,
            rating: ratingRes.data 
          };
        })
      );
      setAnimals(animalsWithStats);
    } catch (error) {
      console.error('Error fetching animals:', error);
    }
  };

  const openAnimal = async (animal, keepTab = false) => {
  if (!keepTab) {
    setActiveTab('info');
  }
  setSelectedAnimal(animal);

  try {
    const token = localStorage.getItem('token');
    const [commentsRes, statsRes] = await Promise.all([
      axios.get(
        `http://localhost:3000/api/owner/interact/comments/${animal._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      ),
      axios.get(
        `http://localhost:3000/api/owner/interact/stats/${animal._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
    ]);

    setSelectedAnimal({
      ...animal,
      comments: commentsRes.data,
      stats: statsRes.data,
    });
  } catch (error) {
    console.error('Error fetching animal details:', error);
  }
};


  const closeModal = () => {
    setSelectedAnimal(null);
    setActiveTab('info');
    setIsEditing(false);
  };

  const handleEdit = (animal) => {
    setIsEditing(true);
    setEditFormData({
      name: animal.name || '',
      breed: animal.breed || '',
      age: animal.age || '',
      gender: animal.gender || 'male',
      size: animal.size || 'medium',
      vaccinated: animal.vaccinated || false,
      sterilized: animal.sterilized || false,
      description: animal.description || '',
      coordinates: animal.location?.coordinates || [18.4131, 43.8563],
    });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const submitEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:3000/api/owner/animals/${selectedAnimal._id}`,
        editFormData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAnimals();
      closeModal();
    } catch (error) {
      console.error('Error updating animal:', error);
    }
  };

  const cancelEdit = () => setIsEditing(false);

  const handleDelete = async (animalId) => {
    if (!window.confirm('Are you sure you want to delete this animal?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:3000/api/owner/animals/${animalId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAnimals();
      closeModal();
    } catch (error) {
      console.error('Error deleting animal:', error);
    }
  };

  const handleArchive = async (animalId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:3000/api/owner/animals/${animalId}/archive`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAnimals();
      closeModal();
    } catch (error) {
      console.error('Error archiving animal:', error);
    }
  };

  const handleUnarchive = async (animalId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:3000/api/owner/animals/${animalId}/unarchive`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAnimals();
      closeModal();
    } catch (error) {
      console.error('Error unarchiving animal:', error);
    }
  };

  const handleToggleLike = async () => {
    const token = localStorage.getItem('token');
    await axios.post(
      `http://localhost:3000/api/owner/interact/like/${selectedAnimal._id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    openAnimal(selectedAnimal, true);
  };

  const handleToggleWishlist = async () => {
    const token = localStorage.getItem('token');
    await axios.post(
      `http://localhost:3000/api/owner/interact/wishlist/${selectedAnimal._id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    openAnimal(selectedAnimal, true);
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    const token = localStorage.getItem('token');
    await axios.post(
      `http://localhost:3000/api/owner/interact/comment/${selectedAnimal._id}`,
      { text: commentText },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setCommentText('');
    openAnimal(selectedAnimal, true);
  };

  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem('token');
    await axios.delete(
      `http://localhost:3000/api/owner/interact/comment/${commentId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    openAnimal(selectedAnimal, true);
  };

  const handleSubmitCommentReport = async () => {
  if (!commentReportDescription.trim()) {
    setCommentReportFeedback('Please enter a description.');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    await axios.post(
      `http://localhost:3000/api/admin/reports`,
      {
        targetModel: 'Comment',
        targetId: commentBeingReported._id,
        description: commentReportDescription,
      },
      { headers }
    );

    setCommentReportFeedback('Report submitted successfully!');
    setCommentReportDescription('');
    setTimeout(() => {
      setCommentBeingReported(null);
      setCommentReportFeedback(null);
    }, 1500);
  } catch (error) {
    console.error(error);
    setCommentReportFeedback(
      error.response?.data?.message || 'Failed to submit report.'
    );
    setTimeout(() => {
      setCommentReportFeedback(null);
    }, 3000);
  }
};



  return (
    <div className="gallery-container">
      <h2>My Animals Gallery</h2>
      <div className="gallery-grid">
        {animals.map((animal) => (
          <div
            key={animal._id}
            className="gallery-card"
            onClick={() => openAnimal(animal)}
          >
            {animal.profileImage?.base64 ? (
              <img
                src={`data:${animal.profileImage.contentType};base64,${animal.profileImage.base64}`}
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

            <div className="animal-meta">
              <span>👍 {animal.stats?.likes || 0}</span>
              <span>💬 {animal.stats?.comments || 0}</span>
              <span>💾 {animal.stats?.saves || 0}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedAnimal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-button" onClick={closeModal}>
              ×
            </button>

            <div className="tab-buttons">
              <button
                className={activeTab === 'info' ? 'active-tab' : ''}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab('info');
                }}
              >
                Info
              </button>
              <button
                className={activeTab === 'interactions' ? 'active-tab' : ''}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab('interactions');
                }}
              >
                Interactions
              </button>
            </div>

            {activeTab === 'info' && !isEditing && (
              <>
                <h2>{selectedAnimal.name}</h2>
                <img
                  src={`data:${selectedAnimal.profileImage.contentType};base64,${selectedAnimal.profileImage.base64}`}
                  alt={selectedAnimal.name}
                  className="modal-profile-image"
                />
                <p><strong>Species:</strong> {selectedAnimal.species?.name || 'Unknown'}</p>
                <p><strong>Breed:</strong> {selectedAnimal.breed}</p>
                <p><strong>Age:</strong> {selectedAnimal.age}</p>
                <p><strong>Gender:</strong> {selectedAnimal.gender}</p>
                <p><strong>Size:</strong> {selectedAnimal.size}</p>
                <p><strong>Vaccinated:</strong> {selectedAnimal.vaccinated ? 'Yes' : 'No'}</p>
                <p><strong>Sterilized:</strong> {selectedAnimal.sterilized ? 'Yes' : 'No'}</p>
                <p><strong>Description:</strong> {selectedAnimal.description}</p>
                <p><strong>Status:</strong> {selectedAnimal.status}</p>
                <div className="modal-actions">
                  <button className="edit-button" onClick={() => handleEdit(selectedAnimal)}>Edit</button>
                  <button className="delete-button" onClick={() => handleDelete(selectedAnimal._id)}>Delete</button>
                  {selectedAnimal.status === 'archived' ? (
                    <button className="archive-button" onClick={() => handleUnarchive(selectedAnimal._id)}>Unarchive</button>
                  ) : (
                    <button className="archive-button" onClick={() => handleArchive(selectedAnimal._id)}>Archive</button>
                  )}
                  <button className="like-button" onClick={handleToggleLike}>
                    👍 Like
                  </button>
                  <button className="save-button" onClick={handleToggleWishlist}>
                    💾 Save
                  </button>
                </div>
              </>
            )}

            {activeTab === 'info' && isEditing && (
              <div className="edit-form">
                <h2>Edit Animal</h2>
                <input
                  name="name"
                  placeholder="Name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                />
                <input
                  name="breed"
                  placeholder="Breed"
                  value={editFormData.breed}
                  onChange={handleEditChange}
                />
                <input
                  name="age"
                  type="number"
                  placeholder="Age"
                  value={editFormData.age}
                  onChange={handleEditChange}
                />
                <select
                  name="gender"
                  value={editFormData.gender}
                  onChange={handleEditChange}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <select
                  name="size"
                  value={editFormData.size}
                  onChange={handleEditChange}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
                <label>
                  Vaccinated:
                  <input
                    type="checkbox"
                    name="vaccinated"
                    checked={editFormData.vaccinated}
                    onChange={handleEditChange}
                  />
                </label>
                <label>
                  Sterilized:
                  <input
                    type="checkbox"
                    name="sterilized"
                    checked={editFormData.sterilized}
                    onChange={handleEditChange}
                  />
                </label>
                <textarea
                  name="description"
                  placeholder="Description"
                  value={editFormData.description}
                  onChange={handleEditChange}
                />
                <div className="map-wrapper">
                  <label>New Location:</label>
                  <MapContainer
                    center={[
                      editFormData.coordinates[1],
                      editFormData.coordinates[0],
                    ]}
                    zoom={12}
                    className="map-container"
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationSelector
                      onChange={(coords) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          coordinates: coords,
                        }))
                      }
                    />
                  </MapContainer>
                </div>
                <div className="modal-actions">
                  <button className="edit-button" onClick={submitEdit}>Save</button>
                  <button className="delete-button" onClick={cancelEdit}>Cancel</button>
                </div>
              </div>
            )}

            {activeTab === 'interactions' && (
              <div className="comments-list">
                {selectedAnimal.comments?.map((comment) => {
                  const isOwnComment =
                    comment.user?.username === loggedInUsername;
                  return (
                    <div key={comment._id} className="comment-item">
                      <p>
                        <strong>{isOwnComment ? 'Me:' : comment.user?.username || 'User'}</strong>{' '}
                        {comment.text}
                      </p>
                      <div className="comment-actions">
                        {isOwnComment && (
                          <button
                            className="delete-comment"
                            onClick={() => handleDeleteComment(comment._id)}
                          >
                            🗑️
                          </button>
                        )}
                        {!isOwnComment && (
                          <button
                            className="report-comment"
                            onClick={() => setCommentBeingReported(comment)}
                          >
                            🚩 Report
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div className="comment-input">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <button onClick={handleAddComment}>Comment</button>
                </div>
              </div>
            )}

            {commentBeingReported && (
              <div
                className="modal-overlay"
                onClick={() => setCommentBeingReported(null)}
              >
                <div
                  className="modal-content"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="close-button"
                    onClick={() => setCommentBeingReported(null)}
                  >
                    ×
                  </button>
                  <h3>Report Comment</h3>
                  <p>
                    <strong>Comment:</strong> {commentBeingReported.text}
                  </p>
                  <textarea
                    placeholder="Describe the issue"
                    value={commentReportDescription}
                    onChange={(e) =>
                      setCommentReportDescription(e.target.value)
                    }
                  />
                  <button
                    disabled={!commentReportDescription.trim()}
                    onClick={handleSubmitCommentReport}
                  >
                    Submit Report
                  </button>
                  {commentReportFeedback && (
                    <p className="feedback">{commentReportFeedback}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAnimals;
