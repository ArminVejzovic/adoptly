import express from 'express';
import { getPublicAnimals, getAllSpecies } from '../../controllers/guest/GuestController.js';

const router = express.Router();

router.get('/animals', getPublicAnimals);
router.get('/species', getAllSpecies);

export default router;
