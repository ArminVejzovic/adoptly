import User from '../../models/User.js';
import Animal from '../../models/Animal.js';
import AdoptionRequest from '../../models/AdoptionRequest.js';
import BlogPost from '../../models/BlogPost.js';
import Chat from '../../models/Chat.js';
import Message from '../../models/Message.js';
import Comment from '../../models/Comment.js';
import Like from '../../models/Like.js';
import Species from '../../models/Species.js';
import WishList from '../../models/WishList.js';
import Review from '../../models/Review.js';

export const getAdminStats = async (req, res) => {
  try {
    const [userRoles, animalStats, adoptionStatus, dailyActivity, extras] = await Promise.all([
      User.aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } }
      ]),

      Animal.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]),

      AdoptionRequest.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]),

      User.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
            },
            registrations: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),

      Promise.all([
        BlogPost.countDocuments(),
        Chat.countDocuments(),
        Message.countDocuments(),
        Comment.countDocuments(),
        Like.countDocuments(),
        Species.countDocuments(),
        WishList.countDocuments(),
        Review.countDocuments(),
        Animal.countDocuments(),
        AdoptionRequest.countDocuments(),
      ])
    ]);

    res.json({
      userRoles,
      animalStats,
      adoptionStatus,
      dailyActivity,
      extraCounts: {
        blogPosts: extras[0],
        chats: extras[1],
        messages: extras[2],
        comments: extras[3],
        likes: extras[4],
        species: extras[5],
        wishlists: extras[6],
        reviews: extras[7],
        totalAnimals: extras[8],
        totalAdoptionRequests: extras[9],
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch statistics', error: err.message });
  }
};
