import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  question: String,
  answer: String,
  timestamp: { type: Date, default: Date.now },
});

const chatRoomSchema = new mongoose.Schema({
  title: String,
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('ChatRoom', chatRoomSchema);
