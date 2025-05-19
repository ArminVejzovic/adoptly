import Like from '../../models/Like.js';
import Comment from '../../models/Comment.js';
import WishList from '../../models/WishList.js';

export const toggleLike = async (req, res) => {
  const { animalId } = req.params;
  const userId = req.user._id;

  const existing = await Like.findOne({ user: userId, animal: animalId });
  if (existing) {
    await existing.deleteOne();
    return res.json({ liked: false, message: 'Disliked' });
  } else {
    await Like.create({ user: userId, animal: animalId });
    return res.json({ liked: true, message: 'Liked' });
  }
};

export const toggleWishlist = async (req, res) => {
  const { animalId } = req.params;
  const userId = req.user._id;

  const existing = await WishList.findOne({ user: userId, animal: animalId });
  if (existing) {
    await existing.deleteOne();
    return res.json({ saved: false, message: 'Removed from wishlist' });
  } else {
    await WishList.create({ user: userId, animal: animalId });
    return res.json({ saved: true, message: 'Saved to wishlist' });
  }
};

export const addComment = async (req, res) => {
  const { animalId } = req.params;
  const { text } = req.body;
  const userId = req.user._id;

  if (!text || text.trim() === '') {
    return res.status(400).json({ message: 'Comment text is required.' });
  }

  const comment = await Comment.create({
    user: userId,
    animal: animalId,
    text
  });

  const populated = await comment.populate('user', 'username');

  res.status(201).json(populated);
};

export const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  const comment = await Comment.findById(commentId);
  if (!comment) return res.status(404).json({ message: 'Comment not found' });
  if (comment.user.toString() !== userId.toString()) {
    return res.status(403).json({ message: 'Not authorized to delete this comment' });
  }

  await comment.deleteOne();
  res.json({ message: 'Comment deleted' });
};

export const getAnimalStats = async (req, res) => {
  const { animalId } = req.params;

  const [likes, comments, saves] = await Promise.all([
    Like.countDocuments({ animal: animalId }),
    Comment.countDocuments({ animal: animalId }),
    WishList.countDocuments({ animal: animalId }),
  ]);

  res.json({ likes, comments, saves });
};

export const getComments = async (req, res) => {
  const { animalId } = req.params;

  const comments = await Comment.find({ animal: animalId })
    .populate('user', 'username')
    .sort({ createdAt: 1 });

  res.json(comments);
};
