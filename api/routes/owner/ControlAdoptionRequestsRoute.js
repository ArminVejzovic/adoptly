import express from 'express';
import { protect, authorizeRoles } from '../../middleware/authMiddleware.js';
import {
  getMyAdoptionRequests,
  approveRequest,
  rejectRequest
} from '../../controllers/owner/ControlAdoptionRequestsConroller.js'

const router = express.Router();

router.get('/my-requests', protect, authorizeRoles('owner'), getMyAdoptionRequests);
router.put('/:id/approve', protect, authorizeRoles('owner'), approveRequest);
router.put('/:id/reject', protect, authorizeRoles('owner'), rejectRequest);

export default router;
