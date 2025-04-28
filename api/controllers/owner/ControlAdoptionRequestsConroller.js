import AdoptionRequest from "../../models/AdoptionRequest.js";

export const getMyAdoptionRequests = async (req, res) => {
    try {
      const requests = await AdoptionRequest.find({ owner: req.user._id })
        .populate('animal requester', 'name username email')
        .sort({ createdAt: -1 });
  
      res.status(200).json(requests);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error while fetching requests' });
    }
  };

export const approveRequest = async (req, res) => {
    try {
      const request = await AdoptionRequest.findByIdAndUpdate(
        req.params.id,
        { status: 'approved', decisionDate: new Date() },
        { new: true }
      );
  
      if (!request) return res.status(404).json({ message: 'Request not found' });
      res.status(200).json(request);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error while approving request' });
    }
  };
  
  export const rejectRequest = async (req, res) => {
    try {
      const request = await AdoptionRequest.findByIdAndUpdate(
        req.params.id,
        { status: 'rejected', decisionDate: new Date() },
        { new: true }
      );
  
      if (!request) return res.status(404).json({ message: 'Request not found' });
      res.status(200).json(request);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error while rejecting request' });
    }
  };