import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  type: {
    type: String,
    enum: ['message', 'comment', 'like', 'adoptionRequest', 'abuseReport'],
    required: true
  },

  content: { type: String, required: true },
  link: { type: String },

  relatedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  relatedEntity: { type: mongoose.Schema.Types.ObjectId },
  entityModel: { type: String },

  read: { type: Boolean, default: false },
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
