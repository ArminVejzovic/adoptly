import express from 'express';
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
} from '../controllers/NotificationsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getUserNotifications);
router.patch('/:id/read', protect, markAsRead);
router.patch('/read-all', protect, markAllAsRead);

export default router;
