import express from 'express';
import { protect, authorizeRoles } from '../../middleware/authMiddleware.js';
import { getPetRecommendation } from '../../controllers/user/AiRecommenderController.js';

const router = express.Router();

router.post('/recommend-pet', protect, authorizeRoles('user'), getPetRecommendation);

export default router;
