import express from 'express';
import { getAllContracts } from '../../controllers/admin/ContractController.js';
import { protect, authorizeRoles } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/all', protect, authorizeRoles('admin'), getAllContracts);

export default router;
