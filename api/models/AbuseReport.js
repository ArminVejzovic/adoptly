import mongoose from 'mongoose';

const abuseReportSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reportedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reportedAnimal: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal' },
  description: { type: String, required: true },
  status: { type: String, enum: ['open', 'resolved', 'rejected'], default: 'open' }
}, { timestamps: true });

const AbuseReport = mongoose.model('AbuseReport', abuseReportSchema);
export default AbuseReport;
