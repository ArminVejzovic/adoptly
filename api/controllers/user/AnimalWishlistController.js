import WishList from '../../models/WishList.js';

export const getWishlistAnimals = async (req, res) => {
  try {
    const userId = req.user._id;

    const wishEntries = await WishList.find({ user: userId }).populate({
      path: 'animal',
      populate: [
        { path: 'species', select: 'name' },
        { path: 'owner', select: 'username email' },
      ],
    });

    const animals = wishEntries
      .map(entry => {
        if (!entry.animal) return null;

        const profileImage = entry.animal.profileImage?.data
          ? {
              base64: Buffer.from(entry.animal.profileImage.data).toString('base64'),
              contentType: entry.animal.profileImage.contentType,
            }
          : null;

        return {
          ...entry.animal.toObject(),
          profileImage,
        };
      })
      .filter(Boolean);

    res.status(200).json(animals);
  } catch (error) {
    console.error('Error fetching wishlist animals:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
