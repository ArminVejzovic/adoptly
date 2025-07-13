import Review from '../models/Review.js';
import Animal from '../models/Animal.js';
import User from '../models/User.js';
import AdoptionRequest from '../models/AdoptionRequest.js';

async function validateReviewPermissions(reviewerId, targetUserId, targetAnimalId, reviewerRole) {
  if (targetUserId) {
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) return false;

    if (reviewerRole === 'user') {
      return targetUser.role === 'owner';
    }
    if (reviewerRole === 'owner') {
      return targetUser.role === 'user';
    }
    return false;
  }

  if (targetAnimalId) {
    if (reviewerRole === 'user') {
      const animal = await Animal.findById(targetAnimalId);
      return !!animal;
    }
    return false;
  }

  return false;
}

export const createOrUpdateReview = async (req, res) => {
  try {
    const reviewerId = req.user.id;
    const reviewerRole = req.user.role;
    const { targetUser, targetAnimal, rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Invalid rating value.' });
    }

    const permitted = await validateReviewPermissions(reviewerId, targetUser, targetAnimal, reviewerRole);
    if (!permitted) {
      return res.status(403).json({ message: 'Not allowed to rate this entity.' });
    }

    let review;
    if (targetUser) {
      review = await Review.findOneAndUpdate(
        { user: reviewerId, targetUser },
        { rating, comment },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } else if (targetAnimal) {
      review = await Review.findOneAndUpdate(
        { user: reviewerId, targetAnimal },
        { rating, comment },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } else {
      return res.status(400).json({ message: 'No target specified.' });
    }

    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving review.' });
  }
};

export const getReviewTargets = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    if (role === 'user') {
      // User vidi sve životinje i sve vlasnike
      const animals = await Animal.find({}).select('name');
      const owners = await User.find({ role: 'owner' }).select('username');

      return res.json({ animals, owners });
    }

    if (role === 'owner') {
      // Owner vidi sve usere
      const users = await User.find({ role: 'user' }).select('username email');

      return res.json({ users });
    }

    return res.status(403).json({ message: 'Admins do not rate entities.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching targets.' });
  }
};

export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .select('targetUser targetAnimal rating comment');

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching reviews.' });
  }
};

export const getAnimalReviewStats = async (req, res) => {
  try {
    const { animalId } = req.params;

    const reviews = await Review.find({ targetAnimal: animalId });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    res.json({ averageRating, totalReviews });
  } catch (err) {
    console.error('Error fetching animal review stats:', err);
    res.status(500).json({ message: 'Error fetching review stats' });
  }
};


