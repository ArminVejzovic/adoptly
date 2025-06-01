import React, { useState } from 'react';
import axios from 'axios';
import './CreateBlog.css';

const CreateBlog = () => {
  const [form, setForm] = useState({
    title: '',
    content: '',
    tags: '',
    image: null,
    imagePreview: null,
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      const file = files[0];
      setForm({
        ...form,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    } else {
      setForm({ ...form, [name]: value });
    }

    setError('');
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const data = new FormData();
      data.append('title', form.title);
      data.append('content', form.content);
      data.append('tags', form.tags);
      if (form.image) data.append('image', form.image);

      await axios.post('http://localhost:3000/api/blog/create-blog', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess(true);
      setForm({ title: '', content: '', tags: '', image: null, imagePreview: null });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create blog post');
    }
  };

  return (
    <div className="create-blog-container">
      <h2>Create Blog Post</h2>
      {success && <p className="success-msg">Blog post created successfully!</p>}
      {error && <p className="error-msg">{error}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <textarea name="content" placeholder="Content" value={form.content} onChange={handleChange} required />
        <input type="text" name="tags" placeholder="Tags (comma separated)" value={form.tags} onChange={handleChange} />

        <label>Upload Image:</label>
        <input type="file" name="image" accept="image/*" onChange={handleChange} />

        {form.imagePreview && (
          <div className="image-preview">
            <img src={form.imagePreview} alt="Preview" height="100" />
          </div>
        )}

        <button type="submit">Publish</button>
      </form>
    </div>
  );
};

export default CreateBlog;
