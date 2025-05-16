import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  application: { type: mongoose.Schema.Types.ObjectId, ref: 'AdoptionRequest', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
