import mongoose from 'mongoose';

const adoptionRequestSchema = new mongoose.Schema({
  animal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Animal',
    required: true,
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    maxlength: 500,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending',
  },
  seenByOwner: {
    type: Boolean,
    default: false,
  },
  decisionDate: {
    type: Date,
  },
}, { timestamps: true });

const AdoptionRequest = mongoose.model('AdoptionRequest', adoptionRequestSchema);
export default AdoptionRequest;
