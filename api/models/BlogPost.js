import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [String],
  image: { type: String }
}, { timestamps: true });

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
export default BlogPost;
