import express from 'express';
import { getMyAnimals, deleteAnimal, archiveAnimal, unarchiveAnimal, updateAnimal } from '../../controllers/owner/MyAnimalsController.js';
import { protect, authorizeRoles } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my-animals', protect, authorizeRoles('owner'), getMyAnimals);
router.delete('/animals/:id', protect, authorizeRoles('owner'), deleteAnimal);
router.put('/animals/:id/archive', protect, authorizeRoles('owner'), archiveAnimal);
router.put('/animals/:id/unarchive', protect, authorizeRoles('owner'), unarchiveAnimal);
router.put('/animals/:id', protect, authorizeRoles('owner'), updateAnimal);


export default router;
