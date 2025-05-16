import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  animal: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
}, { timestamps: true });

const Like = mongoose.model('Like', likeSchema);
export default Like;
