import express from 'express'
import { protect, authorizeRoles } from '../../middleware/authMiddleware.js'

import { createAdoptionRequest, getAvailableAnimals } from '../../controllers/user/CreateAdoptionRequestController.js'

const router = express.Router()

router.post('/create-adoption-request', protect, authorizeRoles('user'), createAdoptionRequest);
router.get('/available-animals', protect, authorizeRoles('user'), getAvailableAnimals);

export default router;