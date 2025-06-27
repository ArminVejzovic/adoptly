import mongoose from 'mongoose';
import Animal from '../../models/Animal.js';
import Like from '../../models/Like.js';
import Species from '../../models/Species.js';

export const getAllSpecies = async (req, res) => {
  try {
    const species = await Species.find().lean();
    res.status(200).json(species);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPublicAnimals = async (req, res) => {
  try {
    const { species, age, size, gender, vaccinated, sortBy } = req.query;

    let filter = { status: 'available' };

    if (species && mongoose.Types.ObjectId.isValid(species)) {
      filter.species = species;
    }
    if (age && !isNaN(parseInt(age))) {
      filter.age = parseInt(age);
    }
    if (size && size !== '') filter.size = size;
    if (gender && gender !== '') filter.gender = gender;
    if (vaccinated !== undefined && vaccinated !== '') {
      filter.vaccinated = vaccinated === 'true';
    }

    console.log("FILTER KORISTEN:", filter);

    let sort = { createdAt: -1 };
    if (sortBy === 'popular') {
      sort = null;
    } else if (sortBy === 'newest') {
      sort = { createdAt: -1 };
    }

    let animalsQuery = Animal.find(filter).populate('species');

    if (sort) {
      animalsQuery = animalsQuery.sort(sort);
    }

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

    res.status(200).json(animals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
