import express from 'express';
import { protect, authorizeRoles } from '../../middleware/authMiddleware.js';
import {
  toggleLike,
  addComment,
  deleteComment,
  toggleWishlist,
  getAnimalStats,
  getComments,
} from '../../controllers/user/AnimalInteractionController.js';

const router = express.Router();

router.post('/like/:animalId', protect, authorizeRoles('user'), toggleLike);
router.post('/wishlist/:animalId', protect, authorizeRoles('user'), toggleWishlist);
router.post('/comment/:animalId', protect, authorizeRoles('user'), addComment);
router.delete('/comment/:commentId', protect, authorizeRoles('user'), deleteComment);
router.get('/stats/:animalId', protect, authorizeRoles('user'), getAnimalStats);
router.get('/comments/:animalId', protect, authorizeRoles('user'), getComments);

export default router;
