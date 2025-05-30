import AdoptionRequest from '../../models/AdoptionRequest.js';

export const getAllAdoptionRequests = async (req, res) => {
  try {
    const requests = await AdoptionRequest.find()
      .populate('animal', 'name species')
      .populate('requester', 'username email')
      .populate('owner', 'username email');

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch adoption requests', error: err.message });
  }
};
