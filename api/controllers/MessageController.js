import Message from '../models/Message.js';

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'username')
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const sendMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;

  try {
    const message = new Message({ chat: chatId, sender: senderId, text });
    await message.save();
    await message.populate('sender', 'username');

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
