import PDFContract from '../../models/PDFContract.js';

export const getAllContracts = async (req, res) => {
  try {
    const contracts = await PDFContract.find()
      .sort({ createdAt: -1 })
      .populate({
        path: 'application',
        populate: [
          {
            path: 'animal',
            select: 'name',
            populate: { path: 'owner', select: 'username' }
          },
          {
            path: 'requester',
            select: 'username'
          }
        ]
      });

    res.json(contracts);
  } catch (err) {
    console.error('Error fetching contracts', err);
    res.status(500).json({ message: 'Server error' });
  }
};
