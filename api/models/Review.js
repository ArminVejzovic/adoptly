import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  targetAnimal: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal' },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String }
}, { timestamps: true });

reviewSchema.index(
  { user: 1, targetUser: 1 },
  { unique: true, partialFilterExpression: { targetUser: { $exists: true } } }
);

reviewSchema.index(
  { user: 1, targetAnimal: 1 },
  { unique: true, partialFilterExpression: { targetAnimal: { $exists: true } } }
);

const Review = mongoose.model('Review', reviewSchema);
export default Review;
