import mongoose from 'mongoose';

const wishListSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  animal: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true }
}, { timestamps: true });

const WishList = mongoose.model('WishList', wishListSchema);
export default WishList;
