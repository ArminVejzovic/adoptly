import Animal from '../../models/Animal.js';
import AnimalImage from '../../models/AnimalImage.js';

export const getMyAnimals = async (req, res) => {
  try {
    const animals = await Animal.find({ owner: req.user._id })
      .populate('species')
      .lean();

    for (let animal of animals) {
      // Profile image - convert to base64
      if (animal.profileImage?.data) {
        animal.profileImage = {
          contentType: animal.profileImage.contentType,
          base64: animal.profileImage.data.toString('base64')
        };
      }

      // Additional images
      const additionalImages = await AnimalImage.find({ animal: animal._id }).lean();
      animal.additionalImages = additionalImages.map(img => ({
        contentType: img.image.contentType,
        base64: img.image.data.toString('base64')
      }));
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
