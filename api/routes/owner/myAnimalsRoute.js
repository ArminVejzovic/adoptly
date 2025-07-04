import express from 'express';
import {
  getMyAnimals,
  deleteAnimal,
  archiveAnimal,
  unarchiveAnimal,
  updateAnimal,
  toggleLike,
  toggleWishlist,
  addComment,
  deleteComment,
  getComments,
  getAnimalStats
} from '../../controllers/owner/MyAnimalsController.js';
import { protect, authorizeRoles } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my-animals', protect, authorizeRoles('owner'), getMyAnimals);
router.delete('/animals/:id', protect, authorizeRoles('owner'), deleteAnimal);
router.put('/animals/:id/archive', protect, authorizeRoles('owner'), archiveAnimal);
router.put('/animals/:id/unarchive', protect, authorizeRoles('owner'), unarchiveAnimal);
router.put('/animals/:id', protect, authorizeRoles('owner'), updateAnimal);

router.post('/interact/like/:animalId', protect, authorizeRoles('owner'), toggleLike);
router.post('/interact/wishlist/:animalId', protect, authorizeRoles('owner'), toggleWishlist);
router.post('/interact/comment/:animalId', protect, authorizeRoles('owner'), addComment);
router.delete('/interact/comment/:commentId', protect, authorizeRoles('owner'), deleteComment);
router.get('/interact/comments/:animalId', protect, authorizeRoles('owner'), getComments);
router.get('/interact/stats/:animalId', protect, authorizeRoles('owner'), getAnimalStats);

export default router;
