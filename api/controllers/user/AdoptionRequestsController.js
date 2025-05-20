import AdoptionRequest from '../../models/AdoptionRequest.js';

export const getRequestsByUser = async (req, res) => {
    try {
      const userId = req.user._id;
  
      const requests = await AdoptionRequest.find({ requester: userId })
        .populate('animal')
        .populate('owner');
  
      res.status(200).json(requests);
    } catch (error) {
      console.error('Greška pri dohvatu zahtjeva:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
