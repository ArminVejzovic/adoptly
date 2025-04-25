import mongoose from 'mongoose';

const animalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: mongoose.Schema.Types.ObjectId, ref: 'Species', required: true },
  breed: { type: String },
  age: { type: Number },
  gender: { type: String, enum: ['male', 'female'] },
  size: { type: String, enum: ['small', 'medium', 'large'] },
  vaccinated: { type: Boolean, default: false },
  sterilized: { type: Boolean, default: false },
  description: { type: String },
  profileImage: { data: Buffer, contentType: String }, // ⬅️ Sada je buffer
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['available', 'adopted', 'pending'], default: 'available' },
}, { timestamps: true });

animalSchema.index({ location: '2dsphere' });

const Animal = mongoose.model('Animal', animalSchema);
export default Animal;
