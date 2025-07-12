import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BlogManager.css';

const BlogManager = () => {
  const [blogs, setBlogs] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editModeId, setEditModeId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const token = localStorage.getItem('token');

  const fetchBlogs = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/blog/all');
      setBlogs(res.data);
    } catch (err) {
      console.error('Failed to fetch blogs', err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/blog/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBlogs();
    } catch (err) {
      console.error('Failed to delete blog', err);
    }
  };

  const handleEditInit = (blog) => {
    setEditModeId(blog._id);
    setEditForm({
      title: blog.title,
      content: blog.content,
      tags: blog.tags.join(','),
      image: null
    });
  };

  const handleEditCancel = () => {
    setEditModeId(null);
    setEditForm({});
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setEditForm({ ...editForm, image: files[0] });
    } else {
      setEditForm({ ...editForm, [name]: value });
    }
  };

  const handleUpdate = async (id) => {
    const formData = new FormData();
    formData.append('title', editForm.title);
    formData.append('content', editForm.content);
    formData.append('tags', editForm.tags);
    if (editForm.image) {
      formData.append('image', editForm.image);
    }

    try {
      await axios.put(`http://localhost:3000/api/blog/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditForm({});
      setEditModeId(null);
      fetchBlogs();
    } catch (err) {
      console.error('Failed to update blog', err);
    }
  };

  return (
    <div className="blog-manager">
      <h2>Blog Posts</h2>
      <label className="mode-toggle">
        <input type="checkbox" checked={editMode} onChange={() => setEditMode(!editMode)} />
        Admin Mode
      </label>

      {blogs.map((blog) => (
        <div key={blog._id} className="blog-card">
          <h3>{blog.title}</h3>
          {blog.image && <img src={blog.image} alt="Blog" />}
          <p>{blog.content}</p>
          <small>Tags: {blog.tags.join(', ')}</small>
          <p><em>By: {blog.author?.username}</em></p>

          {editMode && (
            <button onClick={() => handleEditInit(blog)}>Edit</button>
          )}

          {editMode && editModeId === blog._id && (
            <div className="edit-form">
              <input
                name="title"
                value={editForm.title}
                onChange={handleEditChange}
                placeholder="Title"
              />
              <textarea
                name="content"
                value={editForm.content}
                onChange={handleEditChange}
                placeholder="Content"
              />
              <input
                name="tags"
                value={editForm.tags}
                onChange={handleEditChange}
                placeholder="Tags (comma separated)"
              />
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleEditChange}
              />

              <div className="action-buttons">
                <button onClick={() => handleUpdate(blog._id)}>Update</button>
                <button onClick={handleEditCancel} className="cancel-btn">Cancel</button>
                <button onClick={() => handleDelete(blog._id)} className="delete-btn">Delete</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BlogManager;
