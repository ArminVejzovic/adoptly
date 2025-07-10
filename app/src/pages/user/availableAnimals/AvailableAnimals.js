import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AvailableAnimals.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const AvailableAnimals = () => {
  const [animals, setAnimals] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [alreadyRequested, setAlreadyRequested] = useState(false);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportDescription, setReportDescription] = useState('');
  const [reportFeedback, setReportFeedback] = useState(null);

  const [showCommentReportModal, setShowCommentReportModal] = useState(false);
  const [commentBeingReported, setCommentBeingReported] = useState(null);
  const [commentReportDescription, setCommentReportDescription] = useState('');
  const [commentReportFeedback, setCommentReportFeedback] = useState(null);

  const [galleryImages, setGalleryImages] = useState([]);
  const [showGallery, setShowGallery] = useState(false);


  const user = JSON.parse(localStorage.getItem('user'));
  const loggedInUsername = localStorage.getItem('username');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchAnimals = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/adoption/available-animals', {
          headers,
        });

        const animalsWithStats = await Promise.all(
          res.data.map(async (animal) => {
            const statRes = await axios.get(
              `http://localhost:3000/api/interact/stats/${animal._id}`,
              { headers }
            );
            return { ...animal, stats: statRes.data };
          })
        );

        setAnimals(animalsWithStats);
      } catch (err) {
        console.error('Error fetching animals:', err);
      }
    };

    fetchAnimals();
  }, []);

  const bufferToBase64 = (profileImage) => {
    if (!profileImage?.base64) return null;
    return `data:${profileImage.contentType};base64,${profileImage.base64}`;
  };

  const handleAdopt = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.post(
        'http://localhost:3000/api/adoption/create-adoption-request',
        {
          animalId: selectedAnimal._id,
          message,
        },
        { headers }
      );

      setFeedback('Request sent successfully!');
      setSelectedAnimal(null);
      setMessage('');
    } catch (error) {
      setFeedback(error.response?.data?.message || 'Error sending request.');
    }
  };

  const handleToggleLike = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    await axios.post(
      `http://localhost:3000/api/interact/like/${selectedAnimal._id}`,
      {},
      { headers }
    );

    updateStats(selectedAnimal._id);
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

  const fetchComments = async (animalId) => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const res = await axios.get(
      `http://localhost:3000/api/interact/comments/${animalId}`,
      { headers }
    );
    setComments(res.data);
  };

  const handleAddComment = async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    await axios.post(
      `http://localhost:3000/api/interact/comment/${selectedAnimal._id}`,
      { text: commentText },
      { headers }
    );

    setCommentText('');
    fetchComments(selectedAnimal._id);
    updateStats(selectedAnimal._id);
  };

  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    await axios.delete(
      `http://localhost:3000/api/interact/comment/${commentId}`,
      { headers }
    );

    fetchComments(selectedAnimal._id);
    updateStats(selectedAnimal._id);
  };

  const updateStats = async (animalId) => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const res = await axios.get(
      `http://localhost:3000/api/interact/stats/${animalId}`,
      { headers }
    );

    setAnimals((prev) => {
      const updatedAnimals = prev.map((a) =>
        a._id === animalId ? { ...a, stats: res.data } : a
      );

      // Ako je trenutno prikazan animal, ažuriraj i njega
      if (selectedAnimal?._id === animalId) {
        const updatedAnimal = updatedAnimals.find((a) => a._id === animalId);
        setSelectedAnimal(updatedAnimal);
      }

      return updatedAnimals;
    });
};


  const fetchGalleryImages = async (animalId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
       const res = await axios.get(
          `http://localhost:3000/api/interact/images/${animalId}`,
          { headers }
        );
      setGalleryImages(res.data);
    } catch (err) {
      console.error('Failed to load gallery images:', err);
      setGalleryImages([]);
    }
  };

  const openAnimal = async (animal) => {
    const freshAnimal = animals.find((a) => a._id === animal._id);
    setSelectedAnimal(freshAnimal);
    setMessage('');
    setFeedback(null);
    setCommentText('');
    setComments([]);
    fetchGalleryImages(animal._id);
    updateStats(animal._id);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const res = await axios.get(
        `http://localhost:3000/api/adoption/check-request/${animal._id}`,
        { headers }
      );
      setAlreadyRequested(res.data.alreadyRequested);
    } catch (err) {
      console.error('Error checking request existence:', err);
    }

    await fetchComments(animal._id);
  };

  const isLiked = selectedAnimal?.stats?.isLiked;
  const isSaved = selectedAnimal?.stats?.isSaved;

  console.log(isLiked);
  console.log(isSaved);

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
          targetModel: 'Animal',
          targetId: selectedAnimal._id,
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

  const updateSelectedAnimal = (animalId) => {
    setAnimals((prev) => {
      const updatedAnimals = prev.map((a) =>
        a._id === animalId ? { ...a, stats: a.stats } : a
      );
      const updatedAnimal = updatedAnimals.find((a) => a._id === animalId);
      setSelectedAnimal(updatedAnimal);
      return updatedAnimals;
    });
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
        'http://localhost:3000/api/admin/reports',
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
        setShowCommentReportModal(false);
        setCommentReportFeedback(null);
      }, 1500);
    } catch (error) {
      console.error(error);
      setCommentReportFeedback(
        error.response?.data?.message || 'Failed to submit report.'
      );
    }
  };


  

  return (
    <div className="adoption-gallery">
      <h2>Available Animals for Adoption</h2>
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
            <p>
              {animal.breed} • {animal.age} years
            </p>
            <div className="animal-meta">
              <span>👍 {animal.stats?.likes || 0}</span>
              <span>💬 {animal.stats?.comments || 0}</span>
              <span>💾 {animal.stats?.saves || 0}</span>
            </div>
          </div>
        ))}
      </div>

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
            <p>
              <strong>Description:</strong>{' '}
              {selectedAnimal.description}
            </p>
            
            {selectedAnimal?.location?.coordinates?.length === 2 && (
              <div className="map-container">
                <MapContainer
                  center={[selectedAnimal.location.coordinates[1], selectedAnimal.location.coordinates[0]]}
                  zoom={13}
                  scrollWheelZoom={false}
                  style={{ height: '300px', width: '100%', marginBottom: '1rem' }}
                >
                  <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[selectedAnimal.location.coordinates[1], selectedAnimal.location.coordinates[0]]}>
                    <Popup>{selectedAnimal.name}'s Location</Popup>
                  </Marker>
                </MapContainer>
              </div>
            )}


            {galleryImages.length > 0 && (
              <div style={{ margin: '12px 0' }}>
                <button onClick={() => setShowGallery(true)}>
                  📷 View Gallery ({galleryImages.length})
                </button>
              </div>
            )}

            {showGallery && (
              <div className="modal-overlay" onClick={() => setShowGallery(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <button className="close-button" onClick={() => setShowGallery(false)}>×</button>
                  <h3>Photo Gallery</h3>
                  <div className="gallery-images">
                    {galleryImages.map((img, idx) => (
                      <img
                        key={idx}
                        src={`data:${img.contentType};base64,${img.base64}`}
                        alt={`Gallery ${idx}`}
                        className="gallery-thumbnail"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}


            <div className="actions-row">
              <button onClick={handleToggleLike}>
                {selectedAnimal?.stats?.isLiked ? '👎 Unlike' : '👍 Like'}
              </button>
              <button onClick={handleToggleWishlist}>
                {selectedAnimal?.stats?.isSaved ? '❌ Unsave' : '💾 Save'}
              </button>
              <button
                className="report-btn"
                onClick={() => setShowReportModal(true)}
              >
                🚨 Report Animal
              </button>
            </div>

            <div className="comments-list">
              {comments.map((comment) => {
                const isOwnComment =
                  comment.user?.username &&
                  loggedInUsername &&
                  comment.user.username === loggedInUsername;

                return (
                  <div key={comment._id} className="comment-item">
                    <p>
                      <strong>
                        {isOwnComment ? 'Me:' : comment.user?.username || 'User'}
                      </strong>{' '}
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
                          onClick={() => {
                            setCommentBeingReported(comment);
                            setShowCommentReportModal(true);
                            setCommentReportDescription('');
                            setCommentReportFeedback(null);
                          }}
                        >
                          🚩 Report
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>


            <div className="comment-input">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) =>
                  setCommentText(e.target.value)
                }
              />
              <button onClick={handleAddComment}>
                Comment
              </button>
            </div>

            {alreadyRequested ? (
              <p style={{ color: '#999', marginTop: '12px' }}>
                You’ve already sent an adoption request for
                this animal.
              </p>
            ) : (
              <>
                <textarea
                  placeholder="Message to owner (optional)"
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value)
                  }
                />
                <button
                  onClick={handleAdopt}
                  className="submit-button"
                >
                  Send Adoption Request
                </button>
              </>
            )}

            {feedback && (
              <p className="feedback">{feedback}</p>
            )}
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
            <h3>Report Comment</h3>
            <p>
              <strong>Comment:</strong>{' '}
              {commentBeingReported?.text?.slice(0, 100)}...
            </p>
            <textarea
              placeholder="Describe the issue with this comment..."
              value={commentReportDescription}
              onChange={(e) => setCommentReportDescription(e.target.value)}
            />
            <button onClick={handleSubmitCommentReport}>Submit Report</button>
            {commentReportFeedback && (
              <p className="feedback">{commentReportFeedback}</p>
            )}
          </div>
        </div>
      )}

      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setShowReportModal(false)}>×</button>
            <h3>Report Animal</h3>
            <textarea
              placeholder="Describe the issue with this animal..."
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
            />
            <button onClick={handleSubmitReport}>Submit Report</button>
            {reportFeedback && (
              <p className="feedback">{reportFeedback}</p>
            )}
          </div>
        </div>
      )}


    </div>
  );
};

export default AvailableAnimals;
