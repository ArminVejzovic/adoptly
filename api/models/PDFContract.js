import mongoose from 'mongoose';

const pdfContractSchema = new mongoose.Schema({
  application: { type: mongoose.Schema.Types.ObjectId, ref: 'AdoptionRequest', required: true },
  pdfUrl: { type: String, required: true },
  generatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const PDFContract = mongoose.model('PDFContract', pdfContractSchema);
export default PDFContract;
