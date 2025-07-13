import User from '../models/User.js';
import Review from '../models/Review.js';
import multer from 'multer';
const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const getProfile = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


export const changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { currentPassword, newPassword } = req.body;
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect current password' });

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const removeProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.profilePicture = '';
    await user.save();

    res.status(200).json({ message: 'Profile picture removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { username, bio, location } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (username) user.username = username;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;

    if (req.file) {
      user.profilePicture = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getUserReviewsStats = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const stats = await Review.aggregate([
      { $match: { targetUser: user._id } },
      {
        $group: {
          _id: '$targetUser',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.status(200).json({
        averageRating: 0,
        totalReviews: 0
      });
    }

    res.status(200).json({
      averageRating: stats[0].averageRating.toFixed(1),
      totalReviews: stats[0].totalReviews
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
