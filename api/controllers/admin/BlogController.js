import BlogPost from '../../models/BlogPost.js';

export const createBlogPost = async (req, res) => {
    const { title, content, tags } = req.body;
    const imageFile = req.file;
  
    try {
      const image = imageFile ? `data:${imageFile.mimetype};base64,${imageFile.buffer.toString('base64')}` : '';
  
      const newPost = new BlogPost({
        author: req.user.id,
        title,
        content,
        tags: tags ? tags.split(',').map(t => t.trim()) : [],
        image
      });
  
      await newPost.save();
      res.status(201).json(newPost);
    } catch (err) {
      res.status(500).json({ message: 'Failed to create blog post', error: err.message });
    }
  };

  export const getAllBlogs = async (req, res) => {
    try {
      const blogs = await BlogPost.find()
        .populate('author', 'username email')
        .sort({ createdAt: -1 });
  
      res.json(blogs);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch blog posts', error: err.message });
    }
  };
  
  
  export const deleteBlog = async (req, res) => {
    try {
      const blog = await BlogPost.findByIdAndDelete(req.params.id);
      if (!blog) return res.status(404).json({ message: 'Blog post not found' });
      res.json({ message: 'Blog post deleted' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to delete blog post', error: err.message });
    }
  };
  
  export const updateBlog = async (req, res) => {
    const { title, content, tags } = req.body;
    const imageFile = req.file;
  
    try {
      const image = imageFile ? `data:${imageFile.mimetype};base64,${imageFile.buffer.toString('base64')}` : undefined;
  
      const updated = await BlogPost.findByIdAndUpdate(
        req.params.id,
        {
          ...(title && { title }),
          ...(content && { content }),
          ...(tags && { tags: tags.split(',').map(t => t.trim()) }),
          ...(image && { image })
        },
        { new: true }
      );
  
      if (!updated) return res.status(404).json({ message: 'Blog post not found' });
  
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: 'Failed to update blog post', error: err.message });
    }
  };
