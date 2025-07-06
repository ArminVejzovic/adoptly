import Review from '../models/Review.js';
import Animal from '../models/Animal.js';
import User from '../models/User.js';
import AdoptionRequest from '../models/AdoptionRequest.js';

async function validateReviewPermissions(reviewerId, targetUserId, targetAnimalId, reviewerRole) {
  if (targetUserId) {
    if (reviewerRole === 'user') {
      const adoption = await AdoptionRequest.findOne({
        requester: reviewerId,
        owner: targetUserId,
        status: 'approved',
      });
      return !!adoption;
    }
    if (reviewerRole === 'owner') {
      const adoption = await AdoptionRequest.findOne({
        owner: reviewerId,
        requester: targetUserId,
        status: 'approved',
      });
      return !!adoption;
    }
    return false;
  }
  if (targetAnimalId) {
    const adoption = await AdoptionRequest.findOne({
      animal: targetAnimalId,
      requester: reviewerId,
      status: 'approved',
    });
    return !!adoption;
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
      const requests = await AdoptionRequest.find({
        requester: userId,
        status: 'approved',
      }).populate([
        { path: 'animal', select: 'name' },
        { path: 'owner', select: 'username' }
      ]);

      const animals = [];
      const ownersMap = new Map();

      for (const req of requests) {
        if (req.animal) animals.push(req.animal);
        if (req.owner) ownersMap.set(req.owner._id.toString(), req.owner);
      }

      const owners = Array.from(ownersMap.values());
      return res.json({ animals, owners });
    }

    if (role === 'owner') {
      const requests = await AdoptionRequest.find({
        owner: userId,
        status: 'approved',
      }).populate('requester', 'username email');


      const usersMap = new Map();
      for (const req of requests) {
        if (req.requester) {
          usersMap.set(req.requester._id.toString(), req.requester);
        }
      }

      const users = Array.from(usersMap.values());

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

