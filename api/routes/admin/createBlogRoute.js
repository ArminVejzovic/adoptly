import express from 'express';
import { createBlogPost } from '../../controllers/admin/CreateBlogController.js';
import { protect, authorizeRoles } from '../../middleware/authMiddleware.js';
import { upload } from '../../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/create-blog', protect, authorizeRoles('admin'), upload.single('image'), createBlogPost);

export default router;
