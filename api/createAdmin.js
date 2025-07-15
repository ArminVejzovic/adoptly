// createAdmin.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    const existing = await User.findOne({ email: 'admin@gmail.com' });
    if (existing) {
      console.log('Admin već postoji.');
      return process.exit();
    }

    const admin = new User({
      username: 'admin',
      email: 'admin@gmail.com',
      password: 'admin123',
      role: 'admin',
    });

    await admin.save();
    console.log('Admin uspješno kreiran.');
    process.exit();
  } catch (err) {
    console.error('Greška:', err);
    process.exit(1);
  }
};

createAdmin();
