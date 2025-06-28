import Species from '../../models/Species.js';
import Animal from '../../models/Animal.js';
import Like from '../../models/Like.js';
import BlogPost from '../../models/BlogPost.js';
import mongoose from 'mongoose';
import User from '../../models/User.js';
import AdoptionRequest from '../../models/AdoptionRequest.js';

export const getAllSpecies = async (req, res) => {
  try {
    const species = await Species.find().lean();
    res.json(species);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPublicAnimals = async (req, res) => {
  try {
    const { species, age, size, gender, vaccinated, sortBy } = req.query;

    const filter = { status: 'available' };

    if (species && mongoose.Types.ObjectId.isValid(species)) {
      filter.species = species;
    }
    if (age) filter.age = parseInt(age);
    if (size) filter.size = size;
    if (gender) filter.gender = gender;
    if (vaccinated !== undefined) filter.vaccinated = vaccinated === 'true';

    let sort = { createdAt: -1 };
    if (sortBy === 'popular') sort = null;
    if (sortBy === 'newest') sort = { createdAt: -1 };

    let animalsQuery = Animal.find(filter).populate('species');
    if (sort) animalsQuery = animalsQuery.sort(sort);

    let animals = await animalsQuery.lean();

    for (let animal of animals) {
      const likeCount = await Like.countDocuments({ animal: animal._id });
      animal.likes = likeCount;

      if (animal.profileImage?.data) {
        animal.profileImage = {
          contentType: animal.profileImage.contentType,
          base64: animal.profileImage.data.toString('base64')
        };
      } else {
        animal.profileImage = null;
      }
    }

    if (sortBy === 'popular') {
      animals.sort((a, b) => b.likes - a.likes);
    }

    res.json(animals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getGuestBlogs = async (req, res) => {
  try {
    const blogs = await BlogPost.find()
      .populate('author', 'username email')
      .sort({ createdAt: -1 });

    res.json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getGuestStats = async (req, res) => {
  try {
    const [userCount, totalAnimals, adoptionRequests, blogPosts] = await Promise.all([
      User.countDocuments(),
      Animal.countDocuments(),
      AdoptionRequest.countDocuments(),
      BlogPost.countDocuments()
    ]);

    res.json({
      userCount,
      totalAnimals,
      adoptionRequests,
      blogPosts
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
