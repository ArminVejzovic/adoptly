import express from 'express';
import { protect, authorizeRoles } from '../../middleware/authMiddleware.js';
import { getWishlistAnimals } from '../../controllers/user/AnimalWishlistController.js';

const router = express.Router();

router.get('/get-wishlist', protect, authorizeRoles('user'), getWishlistAnimals);

export default router;
