import User from '../../models/User.js';

export const getAllUsers = async (req, res) => {
  try {
    const { search } = req.query;
    const query = search
      ? { $or: [{ username: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }] }
      : {};

    const users = await User.find(query).select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};

export const toggleBanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isFlagged = !user.isFlagged;
    user.flaggedReason = user.isFlagged ? 'Banned by admin' : undefined;
    await user.save();

    res.status(200).json({ message: `User ${user.isFlagged ? 'banned' : 'unbanned'}`, user });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user status' });
  }
};
