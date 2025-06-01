import express from 'express';
import { protect, authorizeRoles } from '../../middleware/authMiddleware.js';
import {
  getAllSpecies,
  createSpecies,
  updateSpecies,
  deleteSpecies
} from '../../controllers/admin/SpeciesController.js';

const router = express.Router();

router.use(protect, authorizeRoles('admin'));

router.get('/', getAllSpecies);
router.post('/', createSpecies);
router.put('/:id', updateSpecies);
router.delete('/:id', deleteSpecies);

export default router;