import express from 'express';
import { getAllAdoptionRequests } from '../../controllers/admin/AdoptionOverviewController.js';
import { protect, authorizeRoles } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, authorizeRoles('admin'), getAllAdoptionRequests);

export default router;
