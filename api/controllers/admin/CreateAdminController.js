import User from '../../models/User.js';
import bcrypt from 'bcrypt';

export const createAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ field: 'username', message: 'Username already in use.' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ field: 'email', message: 'Email already in use.' });
    }

    const admin = new User({
        username: username,
        email: email,
        password: password,
        role: 'admin',
        isVerified: true,
    });

    await admin.save();
    res.status(201).json({ message: 'Admin successfully created.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
