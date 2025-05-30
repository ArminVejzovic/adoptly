import express from 'express';
import { createAdmin} from '../../controllers/admin/createAdminController.js';
import { protect, authorizeRoles } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorizeRoles('admin'), createAdmin);

export default router;
