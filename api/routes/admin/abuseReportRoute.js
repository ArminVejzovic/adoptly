import express from 'express';
import { protect, authorizeRoles } from '../../middleware/authMiddleware.js';
import {
  createAbuseReport,
  getAllAbuseReports,
  updateAbuseReportStatus
} from '../../controllers/admin/AbuseReportController.js';

const router = express.Router();

router.post('/', protect, createAbuseReport);
router.get('/', protect, authorizeRoles('admin'), getAllAbuseReports);
router.put('/:id', protect, authorizeRoles('admin'), updateAbuseReportStatus);

export default router;
