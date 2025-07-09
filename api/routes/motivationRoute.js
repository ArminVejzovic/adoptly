import express from 'express'
const router = express.Router();
import { generateMotivation } from '../controllers/MotivationController.js';
import { protect } from '../middleware/authMiddleware.js';

router.get('/', protect, generateMotivation);

export default router;