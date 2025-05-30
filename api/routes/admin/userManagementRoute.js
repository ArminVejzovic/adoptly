import express from 'express';
import { getAllUsers, toggleBanUser } from '../../controllers/admin/UserManagementController.js';
import { protect, authorizeRoles } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/users', protect, authorizeRoles('admin'), getAllUsers);
router.patch('/:id/toggle-ban', protect, authorizeRoles('admin'), toggleBanUser);

export default router;
