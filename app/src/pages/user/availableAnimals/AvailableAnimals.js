import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AvailableAnimals.css';

const AvailableAnimals = () => {
  const [animals, setAnimals] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [alreadyRequested, setAlreadyRequested] = useState(false);

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

    setAnimals((prev) =>
      prev.map((a) =>
        a._id === animalId ? { ...a, stats: res.data } : a
      )
    );
  };

  const openAnimal = async (animal) => {
    setSelectedAnimal(animal);
    setMessage('');
    setFeedback(null);
    setCommentText('');
    setComments([]);

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

  const user = JSON.parse(localStorage.getItem('user'));

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

            <div className="actions-row">
              <button onClick={handleToggleLike}>👍 Like</button>
              <button onClick={handleToggleWishlist}>💾 Save</button>
            </div>

            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment._id} className="comment-item">
                  <p>
                    <strong>
                      {comment.user?.username ===
                      localStorage.getItem('username')
                        ? 'Me:'
                        : comment.user?.username || 'User'}
                    </strong>{' '}
                    {comment.text}
                  </p>
                  {comment.user?._id === user?._id && (
                    <button
                      className="delete-comment"
                      onClick={() =>
                        handleDeleteComment(comment._id)
                      }
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))}
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
    </div>
  );
};

export default AvailableAnimals;
