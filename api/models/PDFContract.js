import mongoose from 'mongoose';

const pdfContractSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdoptionRequest',
    required: true,
  },
  pdfData: {
    type: Buffer,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('PDFContract', pdfContractSchema);
