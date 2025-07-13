import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './GuestDashboard.css';

const GuestDashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('animals');

  const [animals, setAnimals] = useState([]);
  const [speciesList, setSpeciesList] = useState([]);
  const [filters, setFilters] = useState({
    species: '',
    age: '',
    size: '',
    gender: '',
    vaccinated: '',
    sortBy: 'newest'
  });
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  const [blogs, setBlogs] = useState([]);

  const [stats, setStats] = useState(null);

  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem('guestWishlist')) || []
  );

  useEffect(() => {
    if (activeTab === 'animals') {
      fetchSpecies();
      fetchAnimals();
    } else if (activeTab === 'blogs') {
      fetchBlogs();
    } else if (activeTab === 'stats') {
      fetchStats();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'animals') {
      fetchAnimals();
    }
  }, [filters]);

  useEffect(() => {
    return () => {
      localStorage.removeItem('guestWishlist');
    };
  }, []);

  const fetchSpecies = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/guest/species');
      setSpeciesList(res.data);
    } catch (error) {
      console.error('Error fetching species:', error);
    }
  };

  const fetchAnimals = async () => {
    try {
      const cleanedFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "")
      );
      const res = await axios.get('http://localhost:3000/api/guest/animals', {
        params: cleanedFilters
      });
      setAnimals(res.data);
    } catch (error) {
      console.error('Error fetching animals:', error);
    }
  };

  const fetchBlogs = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/guest/blogs');
      setBlogs(res.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/guest/stats');
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const bufferToBase64 = (profileImage) => {
    if (!profileImage?.base64) return null;
    return `data:${profileImage.contentType};base64,${profileImage.base64}`;
  };

  const addToWishlist = (animal) => {
    if (!wishlist.find((item) => item._id === animal._id)) {
      const newWishlist = [...wishlist, animal];
      setWishlist(newWishlist);
      localStorage.setItem('guestWishlist', JSON.stringify(newWishlist));
    }
  };

  const removeFromWishlist = (id) => {
    const newWishlist = wishlist.filter(item => item._id !== id);
    setWishlist(newWishlist);
    localStorage.setItem('guestWishlist', JSON.stringify(newWishlist));
  };

  const clearWishlistAndNavigate = (path) => {
    localStorage.removeItem('guestWishlist');
    setWishlist([]);
    navigate(path);
  };

  return (
    <div className="guest-dashboard">
      <h2>Guest Dashboard</h2>

      <div className="guest-header-actions">
        <button
          className="back-btn"
          onClick={() => clearWishlistAndNavigate('/')}
        >
          ⬅ Back to Landing Page
        </button>
      </div>

      <div className="guest-banner">
        <p>
          ⚠️ You are browsing as a guest. Please{" "}
          <a href="/register" onClick={(e) => {
            e.preventDefault();
            clearWishlistAndNavigate('/register');
          }}>
            register
          </a>{" "}
          or{" "}
          <a href="/login" onClick={(e) => {
            e.preventDefault();
            clearWishlistAndNavigate('/login');
          }}>
            login
          </a>{" "}
          to unlock features like Chat, Notifications, Favorites, and Adoption Requests.
        </p>
      </div>

      <div className="tab-buttons">
        <button
          className={activeTab === 'animals' ? 'active' : ''}
          onClick={() => setActiveTab('animals')}
        >
          Animals
        </button>
        <button
          className={activeTab === 'blogs' ? 'active' : ''}
          onClick={() => setActiveTab('blogs')}
        >
          Blog Posts
        </button>
        <button
          className={activeTab === 'stats' ? 'active' : ''}
          onClick={() => setActiveTab('stats')}
        >
          Statistics
        </button>
        <button
          className={activeTab === 'wishlist' ? 'active' : ''}
          onClick={() => setActiveTab('wishlist')}
        >
          Wishlist
        </button>
      </div>

      {activeTab === 'animals' && (
        <div className="gallery-container">
          <div className="filters">
            <select name="species" onChange={handleFilterChange}>
              <option value="">All Species</option>
              {speciesList.map(s => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>

            <select name="age" onChange={handleFilterChange}>
              <option value="">All Ages</option>
              <option value="1">1 year</option>
              <option value="2">2 years</option>
              <option value="3">3+ years</option>
            </select>

            <select name="size" onChange={handleFilterChange}>
              <option value="">All Sizes</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>

            <select name="gender" onChange={handleFilterChange}>
              <option value="">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <select name="vaccinated" onChange={handleFilterChange}>
              <option value="">All</option>
              <option value="true">Vaccinated</option>
              <option value="false">Not Vaccinated</option>
            </select>

            <select name="sortBy" onChange={handleFilterChange}>
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>

          <div className="gallery-grid">
            {animals.map((animal) => (
              <div
                key={animal._id}
                className="gallery-card"
                onClick={() => setSelectedAnimal(animal)}
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
                <p><strong>Age:</strong> {animal.age}</p>
                <p><strong>Species:</strong> {animal.species?.name}</p>
                <p><strong>Likes:</strong> {animal.likes || 0}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToWishlist(animal);
                  }}
                >
                  Add to Wishlist
                </button>
              </div>
            ))}
          </div>

          {selectedAnimal && (
            <div className="modal-overlay" onClick={() => setSelectedAnimal(null)}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
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
                    className="modal-profile-image"
                  />
                )}
                <p><strong>Species:</strong> {selectedAnimal.species?.name}</p>
                <p><strong>Breed:</strong> {selectedAnimal.breed}</p>
                <p><strong>Age:</strong> {selectedAnimal.age}</p>
                <p><strong>Gender:</strong> {selectedAnimal.gender}</p>
                <p><strong>Size:</strong> {selectedAnimal.size}</p>
                <p><strong>Vaccinated:</strong> {selectedAnimal.vaccinated ? 'Yes' : 'No'}</p>
                <p><strong>Description:</strong> {selectedAnimal.description}</p>
                <p><strong>Likes:</strong> {selectedAnimal.likes}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'blogs' && (
        <div className="blogs-grid">
          {blogs.map(blog => (
            <div key={blog._id} className="blog-card">
              <h3>{blog.title}</h3>
              {blog.image && (
                <img src={blog.image} alt="Blog" />
              )}
              <p>{blog.content}</p>
              <small>Tags: {blog.tags.join(', ')}</small>
              <p><em>By: {blog.author?.username}</em></p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'stats' && stats && (
        <div className="stats-overview">
          <h3>Site Statistics</h3>
          <ul>
            <li><strong>Total users:</strong> {stats.userCount}</li>
            <li><strong>Total animals:</strong> {stats.totalAnimals}</li>
            <li><strong>Adoption requests:</strong> {stats.adoptionRequests}</li>
            <li><strong>Blog posts:</strong> {stats.blogPosts}</li>
          </ul>
        </div>
      )}

      {activeTab === 'wishlist' && (
        <div className="wishlist-grid">
          <h3>Your Wishlist</h3>
          <br></br>
          {wishlist.length === 0 && <p>Your wishlist is empty.</p>}
          {wishlist.map(item => (
            <div key={item._id} className="gallery-card">
              <h3>{item.name}</h3>
              {item.profileImage?.base64 && (
                <img
                  src={bufferToBase64(item.profileImage)}
                  alt={item.name}
                />
              )}
              <p><strong>Age:</strong> {item.age}</p>
              <p><strong>Species:</strong> {item.species?.name}</p>
              <button onClick={() => removeFromWishlist(item._id)}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GuestDashboard;
