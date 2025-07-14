import mongoose from 'mongoose';
import AbuseReport from '../../models/AbuseReport.js';
import User from '../../models/User.js';
import Notification from '../../models/Notifications.js';

export const createAbuseReport = async (req, res) => {
  try {
    const {
      targetModel,
      targetId,
      description,
      authorModel,
      authorId,
      contextModel,
      contextId,
    } = req.body;

    const report = await AbuseReport.create({
      reporter: req.user.id,
      targetModel,
      targetId,
      description,
      authorModel,
      authorId,
      contextModel,
      contextId,
    });

    const admins = await User.find({ role: 'admin' }).select('_id');

    const content = `New abuse report created for ${targetModel}`; 

    const notifications = admins.map((admin) => ({
      recipient: admin._id,
      type: 'abuseReport',
      content,
      link: '/admin/reports',
      relatedUser: req.user.id,
      relatedEntity: report._id,
      entityModel: 'AbuseReport',
    }));

    await Notification.insertMany(notifications);

    res.status(201).json(report);

  } catch (error) {
    console.error('Failed to create abuse report:', error);
    res.status(500).json({
      message: 'Failed to create abuse report',
      error: error.message,
    });
  }
};

export const getAllAbuseReports = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const reports = await AbuseReport.find(filter)
      .populate('reporter', 'username email')
      .sort({ createdAt: -1 })
      .lean();

    for (const report of reports) {
      if (report.targetModel === 'Animal') {
        const animal = await mongoose.model('Animal')
          .findById(report.targetId)
          .populate('owner', 'username email')
          .select('name owner')
          .lean();

        report.targetDisplay = animal ? animal.name : '(deleted)';
        report.animalOwner = animal?.owner
          ? `${animal.owner.username} (${animal.owner.email})`
          : null;
      } else if (report.targetModel === 'User') {
        const user = await mongoose.model('User').findById(report.targetId).select('username email').lean();
        report.targetDisplay = user ? `${user.username} (${user.email})` : '(deleted)';
      } else if (report.targetModel === 'Comment') {
        const comment = await mongoose.model('Comment').findById(report.targetId).select('text user').populate('user', 'username email').lean();
        report.targetDisplay = comment ? comment.text?.slice(0, 50) : '(deleted)';

        if (comment?.user) {
          report.authorDisplay = `${comment.user.username} (${comment.user.email})`;
        } else if (report.authorId) {
          const user = await mongoose.model('User').findById(report.authorId).select('username email').lean();
          report.authorDisplay = user ? `${user.username} (${user.email})` : '(deleted)';
        } else {
          report.authorDisplay = '(unknown)';
        }

        if (report.contextModel === 'Animal' && report.contextId) {
          const animal = await mongoose.model('Animal').findById(report.contextId).select('name').lean();
          report.contextDisplay = animal ? animal.name : '(deleted)';
        }
      }
    }

    res.json(reports);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch reports',
      error: error.message,
    });
  }
};

export const updateAbuseReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const report = await AbuseReport.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update report status',
      error: error.message,
    });
  }
};
