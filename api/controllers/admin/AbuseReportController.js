import AbuseReport from '../../models/AbuseReport.js';

export const createAbuseReport = async (req, res) => {
  try {
    const { targetModel, targetId, description } = req.body;

    const report = await AbuseReport.create({
      reporter: req.user.id,
      targetModel,
      targetId,
      description,
    });

    res.status(201).json(report);
  } catch (error) {
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
      .sort({ createdAt: -1 });

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
