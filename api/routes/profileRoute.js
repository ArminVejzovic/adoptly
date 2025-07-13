import express from 'express';
import {
  getProfile,
  updateProfile,
  deleteProfile,
  removeProfilePicture,
  changePassword,
  getUserReviewsStats
} from '../controllers/ProfileController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/:username', protect, getProfile);
router.put('/update', protect, upload.single('profilePicture'), updateProfile);
router.delete('/delete', protect, deleteProfile);
router.put('/remove-picture', protect, removeProfilePicture);
router.put('/change-password', protect, changePassword);
router.get('/reviews/:userId', getUserReviewsStats);

export default router;