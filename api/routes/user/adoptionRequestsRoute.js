import express from 'express';
import { getRequestsByUser } from '../../controllers/user/AdoptionRequestsController.js';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my-requests', protect, getRequestsByUser);

export default router;
