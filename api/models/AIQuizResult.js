import mongoose from 'mongoose';

const aiQuizResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  homeType: { type: String, required: true },
  hasChildren: { type: Boolean, required: true },
  lifestyle: { type: String, required: true },
  recommendedSpecies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Species' }]
}, { timestamps: true });

const AIQuizResult = mongoose.model('AIQuizResult', aiQuizResultSchema);
export default AIQuizResult;
