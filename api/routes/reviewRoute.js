import express from 'express';
import {
  createOrUpdateReview,
  getReviewTargets,
  getMyReviews
} from '../controllers/ReviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/targets', protect, getReviewTargets);
router.post('/', protect, createOrUpdateReview);
router.get('/reviews/my', protect, getMyReviews);


export default router;
