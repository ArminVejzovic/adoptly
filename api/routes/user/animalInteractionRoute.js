import express from 'express';
import { protect, authorizeRoles } from '../../middleware/authMiddleware.js';
import {
  toggleLike,
  addComment,
  deleteComment,
  toggleWishlist,
  getStats,
  getComments,
  getAnimalImages
} from '../../controllers/user/AnimalInteractionController.js';

const router = express.Router();

router.post('/like/:animalId', protect, authorizeRoles('user'), toggleLike);
router.post('/wishlist/:animalId', protect, authorizeRoles('user'), toggleWishlist);
router.post('/comment/:animalId', protect, authorizeRoles('user'), addComment);
router.delete('/comment/:commentId', protect, authorizeRoles('user'), deleteComment);
router.get('/stats/:animalId', protect, authorizeRoles('user'), getStats);
router.get('/comments/:animalId', protect, authorizeRoles('user'), getComments);
router.get('/images/:animalId', protect, authorizeRoles('user'), getAnimalImages);

export default router;
