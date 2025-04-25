import express from 'express';
import { getSpecies, addAnimal } from '../../controllers/owner/AddAnimalController.js';
import { protect, authorizeRoles } from '../../middleware/authMiddleware.js';
import { upload } from '../../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/species', protect,  authorizeRoles('owner'), getSpecies);
router.post(
    '/add-animals',
    protect,
    authorizeRoles('owner'),
    upload.fields([
      { name: 'profileImage', maxCount: 1 },
      { name: 'images', maxCount: 10 }
    ]),
    addAnimal
  );


export default router;



