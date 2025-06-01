import express from 'express';
import { getAdminStats } from '../../controllers/admin/StatsController.js';
import { protect, authorizeRoles } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, authorizeRoles('admin'), getAdminStats);

export default router;
