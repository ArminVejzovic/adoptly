import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RatingsPage.css';

const RatingsPage = () => {
  const [targets, setTargets] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selected, setSelected] = useState(null);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const user = {
    role: localStorage.getItem('role'),
    username: localStorage.getItem('username')
  };

  const token = localStorage.getItem('token');
  const isOwner = user?.role === 'owner';

  const renderStars = () => (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          onClick={() => setStars(i)}
          style={{
            color: i <= stars ? 'gold' : 'gray',
            cursor: 'pointer',
            fontSize: '32px'
          }}
        >
          ★
        </span>
      ))}
    </div>
  );

  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        'http://localhost:3000/api/review/reviews/my',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTargets = async () => {
    if (!token || !user.role) {
      console.error("User not logged in!");
      setFeedback("Please login to rate.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        'http://localhost:3000/api/review/targets',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log("FETCHED TARGETS:", res.data);

      let combinedTargets = [];

      if (user.role === 'owner') {
        combinedTargets = (res.data.users || []).map(u => ({
          id: u._id,
          name: u.username,
          type: 'user'
        }));
      } else {
        const animals = (res.data.animals || []).map(a => ({
          id: a._id,
          name: a.name,
          type: 'animal'
        }));

        const owners = (res.data.owners || []).map(o => ({
          id: o._id,
          name: o.username,
          type: 'owner'
        }));

        combinedTargets = [...animals, ...owners];
      }

      console.log("PROCESSED TARGETS:", combinedTargets);
      setTargets(combinedTargets);
    } catch (err) {
      console.error(err);
      setFeedback('Error fetching review targets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTargets();
    fetchReviews();
  }, []);

  const openModal = (target) => {
    setFeedback('');
    const existingReview = reviews.find(r =>
      (target.type === 'animal' && r.targetAnimal === target.id) ||
      ((target.type === 'owner' || target.type === 'user') && r.targetUser === target.id)
    );
    setStars(existingReview?.rating || 0);
    setComment(existingReview?.comment || '');
    setSelected(target);
  };

  const submitReview = async () => {
    if (!selected) return;

    try {
      await axios.post(
        'http://localhost:3000/api/review/',
        {
          targetUser:
            (selected.type === 'owner' || selected.type === 'user')
              ? selected.id
              : undefined,
          targetAnimal: selected.type === 'animal' ? selected.id : undefined,
          rating: stars,
          comment,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedback('Review saved successfully!');
      setTimeout(() => {
        setSelected(null);
        fetchReviews();
      }, 1500);
    } catch (err) {
      console.error(err);
      setFeedback(err.response?.data?.message || 'Error saving review.');
    }
  };

  const filteredTargets = targets.filter(t =>
    t.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="ratings-page">
      <h2>Rate {isOwner ? 'Users' : 'Animals & Owners'}</h2>
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="search-input"
      />
      {loading && <p>Loading...</p>}
      {!loading && (
        <>
          {filteredTargets.length === 0 && <p>No targets to rate.</p>}
          <ul>
            {filteredTargets.map(t => (
              <li key={`${t.type}-${t.id}`}>
                {t.name} ({t.type})
                <button onClick={() => openModal(t)}>Rate</button>
              </li>
            ))}
          </ul>
        </>
      )}

      {selected && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Rate {selected.name}</h3>
            {renderStars()}
            <textarea
              placeholder="Your comment (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="actions-rpw">
              <button className="submit-btn" onClick={() => setSelected(null)}>Cancel</button>
              <button className="submit-btn" onClick={submitReview}>Submit</button>
            </div>
            {feedback && <p className="feedback">{feedback}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default RatingsPage;
