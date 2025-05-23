import express from 'express';
import { getRequestsByUser } from '../../controllers/user/AdoptionRequestsController.js';
import { protect, authorizeRoles } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my-requests', protect, authorizeRoles('user'), getRequestsByUser);

export default router;
