import express from 'express';
import { getProfile, updateProfile, deleteProfile, upload } from '../controllers/ProfileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:username', protect, getProfile);
router.put('/update', protect, upload.single('profilePicture'), updateProfile);
router.delete('/delete', protect, deleteProfile);

export default router;
