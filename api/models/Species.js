import mongoose from 'mongoose';

const speciesSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
}, { timestamps: true });


const Species = mongoose.model('Species', speciesSchema);
export default Species;
