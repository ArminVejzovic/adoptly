import Animal from '../../models/Animal.js';
import AnimalImage from '../../models/AnimalImage.js';
import Like from '../../models/Like.js';
import Comment from '../../models/Comment.js';
import WishList from '../../models/WishList.js';

export const getMyAnimals = async (req, res) => {
  try {
    const animals = await Animal.find({ owner: req.user._id })
      .populate('species')
      .lean();

    for (let animal of animals) {
      if (animal.profileImage?.data) {
        animal.profileImage = {
          contentType: animal.profileImage.contentType,
          base64: animal.profileImage.data.toString('base64')
        };
      }

      const additionalImages = await AnimalImage.find({ animal: animal._id }).lean();
      animal.additionalImages = additionalImages.map(img => ({
        contentType: img.image.contentType,
        base64: img.image.data.toString('base64')
      }));

      const [likes, comments, saves] = await Promise.all([
        Like.countDocuments({ animal: animal._id }),
        Comment.countDocuments({ animal: animal._id }),
        WishList.countDocuments({ animal: animal._id }),
      ]);

      animal.stats = { likes, comments, saves };

      const commentsList = await Comment.find({ animal: animal._id })
        .populate('user', 'username email')
        .sort({ createdAt: 1 })
        .lean();

      animal.comments = commentsList;
    }

    res.status(200).json(animals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteAnimal = async (req, res) => {
    try {
      const animal = await Animal.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
      if (!animal) return res.status(404).json({ message: 'Animal not found' });
      res.status(200).json({ message: 'Animal deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };
  
  export const archiveAnimal = async (req, res) => {
    try {
      const animal = await Animal.findOneAndUpdate(
        { _id: req.params.id, owner: req.user._id },
        { status: 'archived' },
        { new: true }
      );
      if (!animal) return res.status(404).json({ message: 'Animal not found' });
      res.status(200).json(animal);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };
  
  export const unarchiveAnimal = async (req, res) => {
    try {
      const animal = await Animal.findOneAndUpdate(
        { _id: req.params.id, owner: req.user._id },
        { status: 'available' },
        { new: true }
      );
      if (!animal) return res.status(404).json({ message: 'Animal not found' });
      res.status(200).json(animal);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  } 
  
  export const updateAnimal = async (req, res) => {
    try {
      const animal = await Animal.findOne({ _id: req.params.id, owner: req.user._id });
  
      if (!animal) {
        return res.status(404).json({ message: 'Animal not found' });
      }
  
      animal.name = req.body.name || animal.name;
      animal.breed = req.body.breed || animal.breed;
      animal.age = req.body.age || animal.age;
      animal.gender = req.body.gender || animal.gender;
      animal.size = req.body.size || animal.size;
      animal.vaccinated = req.body.vaccinated ?? animal.vaccinated;
      animal.sterilized = req.body.sterilized ?? animal.sterilized;
      animal.description = req.body.description || animal.description;
      if (req.body.coordinates) {
        animal.location.coordinates = req.body.coordinates;
      }
  
      await animal.save();
      res.status(200).json({ message: 'Animal updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };

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

export const getComments = async (req, res) => {
  const { animalId } = req.params;

  const comments = await Comment.find({ animal: animalId })
    .populate('user', 'username email')
    .sort({ createdAt: 1 });

  res.json(comments);
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
