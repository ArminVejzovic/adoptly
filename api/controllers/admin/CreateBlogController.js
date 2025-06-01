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

  
