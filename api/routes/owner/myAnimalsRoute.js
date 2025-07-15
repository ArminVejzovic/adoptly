import express from 'express';
import {
  getMyAnimals,
  deleteAnimal,
  archiveAnimal,
  unarchiveAnimal,
  updateAnimal,
  addComment,
  deleteComment,
  getComments,
  getAnimalStats,
  uploadProfileImage,
  addAnimalImages,
  deleteAnimalImage
} from '../../controllers/owner/MyAnimalsController.js';
import { protect, authorizeRoles } from '../../middleware/authMiddleware.js';
import { upload } from '../../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/my-animals', protect, authorizeRoles('owner'), getMyAnimals);
router.delete('/animals/:id', protect, authorizeRoles('owner'), deleteAnimal);
router.put('/animals/:id/archive', protect, authorizeRoles('owner'), archiveAnimal);
router.put('/animals/:id/unarchive', protect, authorizeRoles('owner'), unarchiveAnimal);
router.put('/animals/:id', protect, authorizeRoles('owner'), updateAnimal);

router.post('/interact/comment/:animalId', protect, authorizeRoles('owner'), addComment);
router.delete('/interact/comment/:commentId', protect, authorizeRoles('owner'), deleteComment);
router.get('/interact/comments/:animalId', protect, authorizeRoles('owner'), getComments);
router.get('/interact/stats/:animalId', protect, authorizeRoles('owner'), getAnimalStats);

router.put(
  '/animals/:id/profile-image',
  protect,
  authorizeRoles('owner'),
  upload.single('profileImage'),
  uploadProfileImage
);

router.post(
  '/animals/:id/images',
  protect,
  authorizeRoles('owner'),
  upload.array('images'),
  addAnimalImages
);

router.delete(
  '/animal-images/:imageId',
  protect,
  authorizeRoles('owner'),
  deleteAnimalImage
);

export default router;
