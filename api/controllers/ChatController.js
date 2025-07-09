import Chat from '../models/Chat.js';

export const getUserChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.params.userId })
      .populate('participants', 'username role profilePicture');
    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createOrGetChat = async (req, res) => {
  const { userId1, userId2 } = req.body;

  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId1, userId2], $size: 2 }
    });

    if (!chat) {
      chat = new Chat({ participants: [userId1, userId2] });
      await chat.save();
    }

    await chat.populate('participants', 'username role profilePicture');
    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
