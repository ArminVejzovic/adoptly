import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './WishlistAnimals.css';

const WishlistAnimals = () => {
  const [animals, setAnimals] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [message, setMessage] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportDescription, setReportDescription] = useState('');
  const [reportFeedback, setReportFeedback] = useState(null);

  const [showCommentReportModal, setShowCommentReportModal] = useState(false);
  const [commentBeingReported, setCommentBeingReported] = useState(null);
  const [commentReportDescription, setCommentReportDescription] = useState('');
  const [commentReportFeedback, setCommentReportFeedback] = useState(null);

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
            return { ...animal, stats: statRes.data };
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

    await fetchComments(animal._id);
  };

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

  const user = JSON.parse(localStorage.getItem('user'));
  const loggedInUsername = localStorage.getItem('username');

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
            <p>
              <strong>Description:</strong> {selectedAnimal.description}
            </p>

            <div className="actions-row">
              <button onClick={handleToggleLike}>👍 Like</button>
              <button onClick={handleToggleWishlist}>💾 Save</button>
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
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button onClick={handleAddComment}>
                Comment
              </button>
            </div>

            <textarea
              placeholder="Message to owner (optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className="submit-button">
              Send Adoption Request
            </button>

            {feedback && <p className="feedback">{feedback}</p>}
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
            <h3>Report Animal</h3>
            <textarea
              placeholder="Describe the abuse or reason for reporting..."
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
            />
            <button onClick={handleSubmitReport}>Submit Report</button>
            {reportFeedback && <p className="feedback">{reportFeedback}</p>}
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
    </div>
  );
};

export default WishlistAnimals;
