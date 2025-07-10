import Message from '../models/Message.js';
import Chat from '../models/Chat.js';
import User from '../models/User.js';
import Notification from '../models/Notifications.js';

export const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('joinChat', ({ chatId }) => {
      socket.join(chatId);
    });

    socket.on('sendMessage', async ({ chatId, senderId, text }) => {
      try {
        const message = new Message({ chat: chatId, sender: senderId, text });
        await message.save();
        await message.populate('sender', 'username');

        io.to(chatId).emit('receiveMessage', message);

        const chat = await Chat.findById(chatId);
        const recipientId = chat.participants.find(id => id.toString() !== senderId);
        const sender = await User.findById(senderId);

        if (recipientId) {
          await Notification.create({
            recipient: recipientId,
            type: 'message',
            content: `${sender.username} sent you a new message.`,
            link: `/chat`,
            relatedUser: senderId,
            relatedEntity: message._id,
            entityModel: 'Message'
          });
        }
      } catch (err) {
        console.error('Socket sendMessage error:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};
