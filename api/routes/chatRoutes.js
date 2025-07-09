import express from 'express';
import { getUserChats, createOrGetChat } from '../controllers/ChatController.js';

const router = express.Router();

router.get('/:userId', getUserChats);
router.post('/', createOrGetChat);

export default router;
