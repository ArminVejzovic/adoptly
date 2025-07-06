import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DeleteReported.css';

const DeleteReported = () => {
  const [animals, setAnimals] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [animalToDelete, setAnimalToDelete] = useState(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [feedback, setFeedback] = useState(null);

  const [animalComments, setAnimalComments] = useState([]);
  const [animalForComments, setAnimalForComments] = useState(null);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [commentDeleteReason, setCommentDeleteReason] = useState('');
  const [commentFeedback, setCommentFeedback] = useState(null);

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');

  const [userToDelete, setUserToDelete] = useState(null);
  const [userDeleteReason, setUserDeleteReason] = useState('');
  const [userFeedback, setUserFeedback] = useState(null);

  useEffect(() => {
    fetchAnimals();
    fetchUsers();
  }, []);

  const fetchAnimals = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3000/api/admin/resolve-reports/animals', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnimals(res.data);
      setFilteredAnimals(res.data);
    } catch (err) {
      console.error('Error fetching animals:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3000/api/admin/resolve-reports/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchComments = async (animalId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3000/api/admin/resolve-reports/comments', {
        headers: { Authorization: `Bearer ${token}` },
        params: { animalId },
      });
      const filtered = res.data.filter((c) => c.animal?.toString() === animalId);
      setAnimalComments(filtered);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setAnimalComments([]);
    }
  };

  const handleSearchAnimals = (term) => {
    setSearchTerm(term);
    const filtered = animals.filter((animal) =>
      animal.name.toLowerCase().includes(term.toLowerCase()) ||
      (animal.owner?.username || '').toLowerCase().includes(term.toLowerCase())
    );
    setFilteredAnimals(filtered);
  };

  const handleSearchUsers = (term) => {
    setUserSearchTerm(term);
    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(term.toLowerCase()) ||
      user.email.toLowerCase().includes(term.toLowerCase()) ||
      user.role.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const confirmDeleteAnimal = (animal) => {
    setAnimalToDelete(animal);
    setDeleteReason('');
    setFeedback(null);
  };

  const openCommentsModal = (animal) => {
    setAnimalForComments(animal);
    fetchComments(animal._id);
  };

  const confirmDeleteComment = (comment) => {
    setCommentToDelete(comment);
    setCommentDeleteReason('');
    setCommentFeedback(null);
  };

  const confirmDeleteUser = (user) => {
    setUserToDelete(user);
    setUserDeleteReason('');
    setUserFeedback(null);
  };

  const handleDeleteAnimal = async () => {
    if (!deleteReason.trim()) {
      setFeedback('Please provide a reason for deletion.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:3000/api/admin/resolve-reports/animals/${animalToDelete._id}`,
        {
          data: { reason: deleteReason },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFeedback('Animal deleted and user notified.');
      setTimeout(() => {
        setAnimalToDelete(null);
        fetchAnimals();
      }, 1500);
    } catch (err) {
      console.error('Error deleting animal:', err);
      setFeedback(err.response?.data?.message || 'Error deleting animal.');
    }
  };

  const handleDeleteComment = async () => {
    if (!commentDeleteReason.trim()) {
      setCommentFeedback('Please provide a reason.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:3000/api/admin/resolve-reports/comments/${commentToDelete._id}`,
        {
          data: { reason: commentDeleteReason },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCommentFeedback('Comment deleted and user notified.');
      setTimeout(() => {
        setCommentToDelete(null);
        fetchComments(animalForComments._id);
      }, 1500);
    } catch (err) {
      console.error('Error deleting comment:', err);
      setCommentFeedback(err.response?.data?.message || 'Error deleting comment.');
    }
  };

  const handleDeleteUser = async () => {
    if (!userDeleteReason.trim()) {
      setUserFeedback('Please provide a reason for deletion.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:3000/api/admin/resolve-reports/users/${userToDelete._id}`,
        {
          data: { reason: userDeleteReason },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserFeedback('User deleted and user notified.');
      setTimeout(() => {
        setUserToDelete(null);
        fetchUsers();
        fetchAnimals();
      }, 1500);
    } catch (err) {
      console.error('Error deleting user:', err);
      setUserFeedback(err.response?.data?.message || 'Error deleting user.');
    }
  };

  return (
    <div className="admin-container">
      <h2>Manage Animals</h2>
      <input
        type="text"
        placeholder="Search by animal name or owner username"
        value={searchTerm}
        onChange={(e) => handleSearchAnimals(e.target.value)}
        className="search-input"
      />
      {filteredAnimals.length === 0 ? (
        <p>No animals found.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Animal Name</th>
              <th>Owner</th>
              <th>Breed</th>
              <th>Age</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAnimals.map((animal) => (
              <tr key={animal._id}>
                <td>{animal.name}</td>
                <td>{animal.owner?.username || '-'}</td>
                <td>{animal.species?.name || '-'}</td>
                <td>{animal.age}</td>
                <td>
                  <button
                    className="comment-btn"
                    onClick={() => openCommentsModal(animal)}
                  >
                    View Comments
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => confirmDeleteAnimal(animal)}
                  >
                    Delete Animal
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2>Manage Users</h2>
      <input
        type="text"
        placeholder="Search by username, email, or role"
        value={userSearchTerm}
        onChange={(e) => handleSearchUsers(e.target.value)}
        className="search-input"
      />
      {filteredUsers.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Banned</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.isBanned ? 'Yes' : 'No'}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => confirmDeleteUser(user)}
                  >
                    Delete User
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {animalToDelete && (
        <div className="modal-overlay" onClick={() => setAnimalToDelete(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setAnimalToDelete(null)}>
              ×
            </button>
            <h3>Delete Animal</h3>
            <p>
              Are you sure you want to delete <strong>{animalToDelete.name}</strong>?
            </p>
            <textarea
              placeholder="Reason for deletion (will be sent to user)"
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
            />
            <button onClick={handleDeleteAnimal} className="confirm-delete-btn">
              Confirm Delete
            </button>
            {feedback && <p className="feedback">{feedback}</p>}
          </div>
        </div>
      )}

      {animalForComments && (
        <div className="modal-overlay" onClick={() => setAnimalForComments(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setAnimalForComments(null)}>
              ×
            </button>
            <h3>Comments for {animalForComments.name}</h3>
            {animalComments.length === 0 ? (
              <p>No comments for this animal.</p>
            ) : (
              <ul className="comments-list">
                {animalComments.map((comment) => (
                  <li key={comment._id}>
                    <strong>{comment.user?.username}:</strong> {comment.text}
                    <button
                      className="delete-comment-btn"
                      onClick={() => confirmDeleteComment(comment)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {commentToDelete && (
        <div className="modal-overlay" onClick={() => setCommentToDelete(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setCommentToDelete(null)}>
              ×
            </button>
            <h3>Delete Comment</h3>
            <p>
              <strong>Comment:</strong> {commentToDelete.text}
            </p>
            <textarea
              placeholder="Reason for deletion (will be sent to user)"
              value={commentDeleteReason}
              onChange={(e) => setCommentDeleteReason(e.target.value)}
            />
            <button className="confirm-delete-btn" onClick={handleDeleteComment}>
              Confirm Delete
            </button>
            {commentFeedback && <p className="feedback">{commentFeedback}</p>}
          </div>
        </div>
      )}

      {userToDelete && (
        <div className="modal-overlay" onClick={() => setUserToDelete(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setUserToDelete(null)}>
              ×
            </button>
            <h3>Delete User</h3>
            <p>
              Are you sure you want to delete user <strong>{userToDelete.username}</strong>?{' '}
              {userToDelete.role === 'owner' && (
                <em>All their animal listings will be removed as well.</em>
              )}
            </p>
            <textarea
              placeholder="Reason for deletion (will be sent to user)"
              value={userDeleteReason}
              onChange={(e) => setUserDeleteReason(e.target.value)}
            />
            <button className="confirm-delete-btn" onClick={handleDeleteUser}>
              Confirm Delete
            </button>
            {userFeedback && <p className="feedback">{userFeedback}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteReported;
