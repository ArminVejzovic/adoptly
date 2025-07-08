import axios from 'axios'
import { useEffect, useState } from 'react'
import React from 'react'

const BlogOverview = () => {

    const [blogs, setBlogs] = useState([]);

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

   return (
        <div className="blog-manager">
            <h2>Blog Posts</h2>

            {blogs.map((blog) => (
            <div key={blog._id} className="blog-card">
                <h3>{blog.title}</h3>
                {blog.image && <img src={blog.image} alt="Blog" />}
                <p>{blog.content}</p>
                <small>Tags: {blog.tags.join(', ')}</small>
                <p><em>By: {blog.author?.username}</em></p>
            </div>
            ))}
        </div>
    )
}


export default BlogOverview