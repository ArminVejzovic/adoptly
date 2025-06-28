import express from 'express';
import {
  getAllSpecies,
  getPublicAnimals,
  getGuestBlogs,
  getGuestStats
} from '../../controllers/guest/GuestController.js';

const router = express.Router();

router.get('/species', getAllSpecies);
router.get('/animals', getPublicAnimals);
router.get('/blogs', getGuestBlogs);
router.get('/stats', getGuestStats);

export default router;
