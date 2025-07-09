import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import crypto from 'crypto';
import sendEmail from '../utils/emailService.js';
import dotenv from 'dotenv';
dotenv.config();

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (userExists) return res.status(400).json({ message: 'Email or username already exists' });

    const user = await User.create({ username, email, password, role });
    const token = generateToken(user);

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({
        $or: [{ email }, { username: email }],
        });

        if (!user) {
        return res.status(401).json({ field: 'email', message: 'No user found with that email or username' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
        return res.status(401).json({ field: 'password', message: 'Incorrect password' });
        }

        const token = generateToken(user);

        res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
  

export const getDashboard = (req, res) => {
    const role = req.user.role;
    res.json({ message: `Welcome to the dashboard, ${role}` });

};

const tokenStore = new Map();

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 30 * 60 * 1000;

    tokenStore.set(resetToken, { userId: user._id.toString(), expiresAt });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const message = `
      <h1>Password Reset Request</h1>
      <p>Hello ${user.username},</p>
      <p>You requested to reset your password for Adoptly. Click the link below to reset it:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link is valid for 30 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    `;

    await sendEmail({
      to: user.email,
      subject: 'Adoptly Password Reset',
      htmlContent: message,
      name: user.username,
    });

    res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (err) {
    console.error('Forgot Password Error:', err);
    res.status(500).json({ message: 'Server error while processing forgot password.' });
  }
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    const data = tokenStore.get(token);
    if (!data || data.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }

    const user = await User.findById(data.userId);
    if (!user) {
      return res.status(400).json({ message: 'Invalid token user.' });
    }

    user.password = password;
    await user.save();
    tokenStore.delete(token);

    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    console.error('Reset Password Error:', err);
    res.status(500).json({ message: 'Server error while resetting password.' });
  }
};