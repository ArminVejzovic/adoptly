import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './AddAnimal.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function LocationSelector({ onChange }) {
  const [position, setPosition] = useState([43.8563, 18.4131]);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onChange([lng, lat]);
    },
  });

  return position ? <Marker position={position} /> : null;
}

const AddAnimal = () => {
  const navigate = useNavigate();
  const [speciesOptions, setSpeciesOptions] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    gender: 'male',
    size: 'medium',
    vaccinated: false,
    sterilized: false,
    description: '',
    profileImage: null,
    profileImagePreview: null,
    images: [],
    imagePreviews: [],
    species: '',
    coordinates: [18.4131, 43.8563],
  });
  const profileImageRef = useRef(null);
  const imagesRef = useRef(null);

  const handleChange = e => {
    const { name, value, type, checked, files } = e.target;
    if (name === 'profileImage') {
      const file = files[0];
      setFormData({
        ...formData,
        profileImage: file,
        profileImagePreview: URL.createObjectURL(file),
      });
    } else if (name === 'images') {
      const newFiles = Array.from(files);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newFiles],
        imagePreviews: [...prev.imagePreviews, ...newPreviews],
      }));
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const removeImage = index => {
    setFormData(prev => {
      const updatedImages = [...prev.images];
      const updatedPreviews = [...prev.imagePreviews];
      updatedImages.splice(index, 1);
      updatedPreviews.splice(index, 1);

      if (updatedImages.length === 0 && imagesRef.current) {
        imagesRef.current.value = '';
      }

      return {
        ...prev,
        images: updatedImages,
        imagePreviews: updatedPreviews,
      };
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'images') {
          value.forEach(file => data.append('images', file));
        } else if (key === 'coordinates') {
          data.append('longitude', value[0]);
          data.append('latitude', value[1]);
        } else if (key === 'profileImagePreview' || key === 'imagePreviews') {
        } else {
          data.append(key, value);
        }
      });

      const token = localStorage.getItem('token');

      await axios.post('http://localhost:3000/api/owner/add-animals', data, {
        headers: {
            Authorization: `Bearer ${token}`
          }
      });

      navigate('/owner-dashboard');
    } catch (error) {
      console.error('Error while adding animal:', error);
    }
  };

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/owner/species', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSpeciesOptions(response.data);

        console.log(response.data);
      } catch (error) {
        console.error('Error fetching species:', error);
      }
    };
    fetchSpecies();
  }, []);

  return (
    <div className="add-animal-container">
      <h2>Add New Animal</h2>
      <form onSubmit={handleSubmit} className="animal-form" encType="multipart/form-data">
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input name="breed" placeholder="Breed" value={formData.breed} onChange={handleChange} />
        <input name="age" type="number" step="0.1" placeholder="Age (e.g. 1.5)" value={formData.age} onChange={handleChange} />

        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <select name="size" value={formData.size} onChange={handleChange}>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>

        <label>
          Vaccinated:
          <input type="checkbox" name="vaccinated" checked={formData.vaccinated} onChange={handleChange} />
        </label>

        <label>
          Sterilized:
          <input type="checkbox" name="sterilized" checked={formData.sterilized} onChange={handleChange} />
        </label>

        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange}></textarea>

        <label>
          Profile Image:
          <input type="file" name="profileImage" accept="image/*" onChange={handleChange} ref={profileImageRef} />
        </label>
        {formData.profileImagePreview && (
          <div className="image-preview">
            <img src={formData.profileImagePreview} alt="Profile Preview" height="100" />
          </div>
        )}

        <label>
          Additional Images:
          <input type="file" name="images" accept="image/*" multiple onChange={handleChange} ref={imagesRef} />
        </label>
        <div className="image-preview-list">
          {formData.imagePreviews.map((src, idx) => (
            <div key={idx} className="preview-item">
              <div className="image-wrapper">
                <img src={src} alt={`Preview ${idx}`} height="100" />
                <button
                  type="button"
                  className="remove-image"
                  onClick={() => removeImage(idx)}
                  title="Remove image"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>

        <select name="species" value={formData.species} onChange={handleChange} required>
          <option value="">Select species</option>
          {speciesOptions.map(spec => (
            <option key={spec._id} value={spec._id}>{spec.name}</option>
          ))}
        </select>

        <div className="map-wrapper">
          <label>Select location on the map:</label>
          <MapContainer center={[43.8563, 18.4131]} zoom={12} className="map-container">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationSelector onChange={coords => setFormData({ ...formData, coordinates: coords })} />
          </MapContainer>
        </div>

        <button type="submit">Add Animal</button>
      </form>
    </div>
  );
};

export default AddAnimal;
