import express from 'express';
import { protect } from '../../middleware/authMiddleware.js';
import {
  toggleLike,
  addComment,
  deleteComment,
  toggleWishlist,
  getAnimalStats,
  getComments,
} from '../../controllers/user/AnimalInteractionController.js';

const router = express.Router();

router.post('/like/:animalId', protect, toggleLike);
router.post('/wishlist/:animalId', protect, toggleWishlist);
router.post('/comment/:animalId', protect, addComment);
router.delete('/comment/:commentId', protect, deleteComment);
router.get('/stats/:animalId', getAnimalStats);
router.get('/comments/:animalId', getComments);

export default router;
