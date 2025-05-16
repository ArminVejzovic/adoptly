import AdoptionRequest from '../../models/AdoptionRequest.js';
import Animal from '../../models/Animal.js';


export const createAdoptionRequest = async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.animalId);
    if (!animal || animal.status !== 'available') {
      return res.status(404).json({ message: 'Animal not available for adoption' });
    }

    if (animal.owner.toString() === req.user._id) {
      return res.status(400).json({ message: 'You cannot adopt your own animal' });
    }

    const existingRequest = await AdoptionRequest.findOne({
      animal: animal._id,
      requester: req.user._id,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You already sent a request for this animal' });
    }

    const request = new AdoptionRequest({
      animal: animal._id,
      requester: req.user._id,
      owner: animal.owner,
      message: req.body.message || ''
    });

    await request.save();
    res.status(201).json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAvailableAnimals = async (req, res) => {
  try {
    const animals = await Animal.find({ status: 'available' })
      .populate('species', 'name')
      .populate('owner', 'name email');

    // Pretvori buffer slike u base64 string za frontend
    const animalsWithBase64 = animals.map(animal => {
      const profileImage = animal.profileImage?.data
        ? {
            base64: Buffer.from(animal.profileImage.data).toString('base64'),
            contentType: animal.profileImage.contentType,
          }
        : null;

      return {
        ...animal.toObject(),
        profileImage,
      };
    });

    res.json(animalsWithBase64);
  } catch (error) {
    console.error('Error fetching available animals:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

