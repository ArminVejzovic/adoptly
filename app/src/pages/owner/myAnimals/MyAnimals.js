import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MyAnimals.css';
import '../addAnimal/AddAnimal.css';

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
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState(null);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/owner/my-animals', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAnimals(response.data);
      } catch (error) {
        console.error('Error fetching animals:', error);
      }
    };
    fetchAnimals();
  }, []);

  const openAnimal = (animal) => {
    setSelectedAnimal(animal);
    setEditFormData(null);
  };

  const closeModal = () => {
    setSelectedAnimal(null);
    setIsEditing(false);
  };

  const bufferToBase64 = (buffer) => {
    if (!buffer) return null;
    return btoa(new Uint8Array(buffer.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
  };

  const handleDelete = async (animalId) => {
    if (!window.confirm('Are you sure you want to delete this animal?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/owner/animals/${animalId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnimals(animals.filter(a => a._id !== animalId));
      closeModal();
    } catch (error) {
      console.error('Error deleting animal:', error);
    }
  };

  const handleArchive = async (animalId) => {
    if (!window.confirm('Do you want to archive this animal?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/api/owner/animals/${animalId}/archive`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnimals(prevAnimals => prevAnimals.map(a => a._id === animalId ? { ...a, status: 'archived' } : a));
      closeModal();
    } catch (error) {
      console.error('Error archiving animal:', error);
    }
  };

  const handleUnarchive = async (animalId) => {
    if (!window.confirm('Do you want to unarchive this animal?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/api/owner/animals/${animalId}/unarchive`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnimals(prevAnimals => prevAnimals.map(a => a._id === animalId ? { ...a, status: 'available' } : a));
      closeModal();
    } catch (error) {
      console.error('Error unarchiving animal:', error);
    }
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
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const submitEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/api/owner/animals/${selectedAnimal._id}`, editFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updated = await axios.get('http://localhost:3000/api/owner/my-animals', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnimals(updated.data);
      closeModal();
    } catch (error) {
      console.error('Error updating animal:', error);
    }
  };

  const cancelEdit = () => setIsEditing(false);

  return (
    <div className="gallery-container">
      <h2>My Animals Gallery</h2>
      <div className="gallery-grid">
        {animals.map(animal => (
          <div key={animal._id} className="gallery-card" onClick={() => openAnimal(animal)}>
            {animal.profileImage?.base64 ? (
              <img src={`data:${animal.profileImage.contentType};base64,${animal.profileImage.base64}`} alt={animal.name} />
            ) : (<div className="no-image">No Image</div>)}
            <h3>{animal.name}</h3>
          </div>
        ))}
      </div>

      {selectedAnimal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>×</button>
            {!isEditing ? (
              <>
                <h2>{selectedAnimal.name}</h2>
                <img src={`data:${selectedAnimal.profileImage.contentType};base64,${selectedAnimal.profileImage.base64}`} alt={selectedAnimal.name} className="modal-profile-image" />
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
                </div>
              </>
            ) : (
              <div className="edit-form">
                <h2>Edit Animal</h2>
                <input name="name" placeholder="Name" value={editFormData.name} onChange={handleEditChange} />
                <input name="breed" placeholder="Breed" value={editFormData.breed} onChange={handleEditChange} />
                <input name="age" type="number" placeholder="Age" value={editFormData.age} onChange={handleEditChange} />
                <select name="gender" value={editFormData.gender} onChange={handleEditChange}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <select name="size" value={editFormData.size} onChange={handleEditChange}>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
                <label>
                  Vaccinated:
                  <input type="checkbox" name="vaccinated" checked={editFormData.vaccinated} onChange={handleEditChange} />
                </label>
                <label>
                  Sterilized:
                  <input type="checkbox" name="sterilized" checked={editFormData.sterilized} onChange={handleEditChange} />
                </label>
                <textarea name="description" placeholder="Description" value={editFormData.description} onChange={handleEditChange}></textarea>
                
                <div className="map-wrapper">
                  <label>New Location:</label>
                  <MapContainer center={[editFormData.coordinates[1], editFormData.coordinates[0]]} zoom={12} className="map-container">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationSelector onChange={(coords) => setEditFormData(prev => ({ ...prev, coordinates: coords }))} />
                  </MapContainer>
                </div>

                <div className="modal-actions">
                  <button className="edit-button" onClick={submitEdit}>Save</button>
                  <button className="delete-button" onClick={cancelEdit}>Cancel</button>
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
