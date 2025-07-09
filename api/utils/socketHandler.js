import Message from '../models/Message.js';

export const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('joinChat', ({ chatId }) => {
      socket.join(chatId);
    });

    socket.on('sendMessage', async ({ chatId, senderId, text }) => {
      const message = new Message({ chat: chatId, sender: senderId, text });
      await message.save();
      await message.populate('sender', 'username');

      io.to(chatId).emit('receiveMessage', message);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};
