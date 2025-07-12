import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SpeciesManager.css';

const SpeciesManager = () => {
  const [speciesList, setSpeciesList] = useState([]);
  const [newSpecies, setNewSpecies] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const token = localStorage.getItem('token');

  const fetchSpecies = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/species', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSpeciesList(res.data);
    } catch (err) {
      console.error('Error fetching species:', err);
    }
  };

  useEffect(() => {
    fetchSpecies();
  }, []);

  const handleAdd = async () => {
    if (!newSpecies.trim()) return;
    try {
      await axios.post('http://localhost:3000/api/species', { name: newSpecies }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewSpecies('');
      fetchSpecies();
    } catch (err) {
      console.error('Error adding species:', err);
    }
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:3000/api/species/${id}`, { name: editName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditId(null);
      setEditName('');
      fetchSpecies();
    } catch (err) {
      console.error('Error updating species:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/species/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSpecies();
    } catch (err) {
      console.error('Error deleting species:', err);
    }
  };

  return (
    <div className="species-manager">
      <h2>Manage Species</h2>

      <div className="add-section">
        <input
          type="text"
          placeholder="New species name"
          value={newSpecies}
          onChange={(e) => setNewSpecies(e.target.value)}
        />
        <button onClick={handleAdd}>Add</button>
      </div>

      <ul>
        {speciesList.map((sp) => (
          <li key={sp._id}>
            {editId === sp._id ? (
              <>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <div className="btn-group">
                  <button onClick={() => handleUpdate(sp._id)}>Save</button>
                  <button onClick={() => setEditId(null)}>Cancel</button>
                </div>
              </>
            ) : (
              <>
                <span>{sp.name}</span>
                <div className="btn-group">
                  <button onClick={() => { setEditId(sp._id); setEditName(sp.name); }}>Edit</button>
                  <button onClick={() => handleDelete(sp._id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpeciesManager;
