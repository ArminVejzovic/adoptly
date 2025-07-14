import Like from '../../models/Like.js';
import Comment from '../../models/Comment.js';
import WishList from '../../models/WishList.js';
import Notification from '../../models/Notifications.js';
import Animal from '../../models/Animal.js';
import AnimalImage from '../../models/AnimalImage.js';

export const toggleLike = async (req, res) => {
  const { animalId } = req.params;
  const userId = req.user._id;

  const existing = await Like.findOne({ user: userId, animal: animalId });
  const animal = await Animal.findById(animalId).select('owner name');

  if (!animal) return res.status(404).json({ message: 'Animal not found.' });

  if (existing) {
    await existing.deleteOne();
    return res.json({ liked: false, message: 'Disliked' });
  } else {
    const like = await Like.create({ user: userId, animal: animalId });

    if (animal.owner.toString() !== userId.toString()) {
      await Notification.create({
        recipient: animal.owner,
        type: 'like',
        content: `${req.user.username} liked your animal "${animal.name}".`,
        link: `/my-animals`,
        relatedUser: userId,
        relatedEntity: like._id,
        entityModel: 'Like'
      });
    }

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

  const animal = await Animal.findById(animalId);
  if (!animal) return res.status(404).json({ message: 'Animal not found.' });

  const comment = await Comment.create({
    user: userId,
    animal: animalId,
    text
  });

  if (animal.owner.toString() !== userId.toString()) {
    await Notification.create({
      recipient: animal.owner,
      type: 'comment',
      content: `${req.user.username} commented on your animal "${animal.name}".`,
      link: `/my-animals`,
      relatedUser: userId,
      relatedEntity: comment._id,
      entityModel: 'Comment'
    });
  }

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

export const getStats = async (req, res) => {
  try {
    const animalId = req.params.animalId;
    const userId = req.user._id;

    const [likes, comments, saves] = await Promise.all([
      Like.countDocuments({ animal: animalId }),
      Comment.countDocuments({ animal: animalId }),
      WishList.countDocuments({ animal: animalId }),
    ]);


    const isLiked = await Like.exists({ animal: animalId, user: userId });
    const isSaved = await WishList.exists({ animal: animalId, user: userId });

    res.json({
      likes,
      comments,
      saves,
      isLiked: !!isLiked,
      isSaved: !!isSaved
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

export const getComments = async (req, res) => {
  const { animalId } = req.params;

  const comments = await Comment.find({ animal: animalId })
    .populate('user', 'username')
    .sort({ createdAt: 1 });

  res.json(comments);
};

export const getAnimalImages = async (req, res) => {
  try {
    const { animalId } = req.params;

    const images = await AnimalImage.find({ animal: animalId });

    const formattedImages = images.map((img) => ({
      base64: Buffer.from(img.image.data).toString('base64'),
      contentType: img.image.contentType,
    }));

    res.json(formattedImages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching animal images.' });
  }
};