import express from 'express';
import {
  sendAdminMessage,
  createRoom,
  getRooms,
  getRoom,
  deleteRoom,
  updateRoomTitle,
} from '../../controllers/admin/AdminChatController.js';

const router = express.Router();

router.post('/rooms', createRoom);
router.get('/rooms', getRooms);
router.get('/rooms/:id', getRoom);
router.delete('/rooms/:id', deleteRoom);
router.put('/rooms/:id', updateRoomTitle);
router.post('/message', sendAdminMessage);

export default router;
