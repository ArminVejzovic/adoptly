import jwt from 'jsonwebtoken';
import User from '../models/User.js';
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