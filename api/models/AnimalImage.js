import mongoose from 'mongoose';

const animalImageSchema = new mongoose.Schema({
  animal: { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true },
  image: { data: Buffer, contentType: String },
}, { timestamps: true });

const AnimalImage = mongoose.model('AnimalImage', animalImageSchema);
export default AnimalImage;
