import mongoose from 'mongoose';

const abuseReportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  targetModel: {
    type: String,
    required: true,
    enum: ['User', 'Animal', 'BlogPost', 'Comment'],
  },

  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ['open', 'resolved', 'rejected'],
    default: 'open',
  }
}, { timestamps: true });

const AbuseReport = mongoose.model('AbuseReport', abuseReportSchema);
export default AbuseReport;
