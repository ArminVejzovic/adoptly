import express from 'express'
import { protect, authorizeRoles } from '../../middleware/authMiddleware.js'

import { createAdoptionRequest } from '../../controllers/user/CreateAdoptionRequestController.js'

const router = express.Router()

router.post('/create-adoption-request', protect, authorizeRoles('user'), createAdoptionRequest);

export default router;