import axios from 'axios';
import ChatRoom from '../../models/ChatRoom.js';
import dotenv from 'dotenv';
dotenv.config();

const generateTitle = (text) => {
  const words = text.trim().split(/\s+/).slice(0, 5).join(' ');
  return words || 'Novi Chat';
};

export const sendAdminMessage = async (req, res) => {
  const { roomId, question } = req.body;

  try {
    const room = await ChatRoom.findById(roomId);
    if (!room) return res.status(404).json({ error: 'Room not found' });

    const prompt = question;

    const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
            model: "openai/gpt-4o",
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 500
        },
        {
            headers: {
            Authorization: `Bearer ${process.env.ADMIN_CHAT}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:5000',
            'X-Title': 'AdminChat',
            },
        }
);

    const answer = response.data.choices[0].message.content;

    room.messages.push({ question, answer });
    await room.save();

    res.json({ answer });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Greška prilikom komunikacije sa AI-jem.' });
  }
};

export const createRoom = async (req, res) => {
  const { firstQuestion } = req.body;
  const title = generateTitle(firstQuestion || 'Novi Chat');
  const room = new ChatRoom({ title, messages: [] });
  await room.save();
  res.json(room);
};

export const getRooms = async (req, res) => {
  const rooms = await ChatRoom.find().sort({ createdAt: -1 });
  res.json(rooms);
};

export const getRoom = async (req, res) => {
  const room = await ChatRoom.findById(req.params.id);
  if (!room) return res.status(404).json({ error: 'Room not found' });
  res.json(room);
};

export const deleteRoom = async (req, res) => {
  await ChatRoom.findByIdAndDelete(req.params.id);
  res.json({ message: 'Room deleted' });
};

export const updateRoomTitle = async (req, res) => {
  const { title } = req.body;
  const room = await ChatRoom.findByIdAndUpdate(
    req.params.id,
    { title },
    { new: true }
  );
  res.json(room);
};
