import Species from "../../models/Species.js";
import Animal from '../../models/Animal.js';
import AnimalImage from '../../models/AnimalImage.js';


export const getSpecies = async (req, res) => {
    try {
        const species = await Species.find();
        res.status(200).json(species);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const addAnimal = async (req, res) => {
  try {
    const {
      name, breed, age, gender, size,
      vaccinated, sterilized, description,
      species, longitude, latitude
    } = req.body;

    const coordinates = [parseFloat(longitude), parseFloat(latitude)];

    const profileImageBuffer = req.files?.profileImage ? req.files.profileImage[0].buffer : null;

    const newAnimal = new Animal({
      name,
      breed,
      age,
      gender,
      size,
      vaccinated,
      sterilized,
      description,
      species,
      profileImage: {
        data: profileImageBuffer,
        contentType: req.files?.profileImage[0]?.mimetype || 'image/jpeg'
      },
      location: {
        type: 'Point',
        coordinates
      },
      owner: req.user._id,
    });

    const savedAnimal = await newAnimal.save();

    if (req.files?.images) {
      await Promise.all(
        req.files.images.map(file => {
          return AnimalImage.create({
            animal: savedAnimal._id,
            image: {
              data: file.buffer,
              contentType: file.mimetype
            }
          });
        })
      );
    }

    res.status(201).json(savedAnimal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};