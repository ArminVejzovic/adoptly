import AdoptionRequest from '../../models/AdoptionRequest.js';
import Animal from '../../models/Animal.js';

export const createAdoptionRequest = async (req, res) => {
  try {
    const { animalId, message } = req.body;
    const animal = await Animal.findById(animalId);

    if (!animal) return res.status(404).json({ message: 'Animal not found' });

    const newRequest = new AdoptionRequest({
      animal: animalId,
      requester: req.user._id,
      owner: animal.owner,
      message,
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while creating request' });
  }
};