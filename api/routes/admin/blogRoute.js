import express from 'express';
import {
  createBlogPost,
  getAllBlogs,
  deleteBlog,
  updateBlog
} from '../../controllers/admin/BlogController.js';
import { protect, authorizeRoles } from '../../middleware/authMiddleware.js';
import { upload } from '../../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/all', getAllBlogs);

router.post('/create-blog', protect, authorizeRoles('admin'), upload.single('image'), createBlogPost);
router.delete('/:id', protect, authorizeRoles('admin'), deleteBlog);
router.put('/:id', protect, authorizeRoles('admin'), upload.single('image'), updateBlog);

export default router;
