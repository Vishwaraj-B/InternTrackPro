const Application = require('../models/Application');
const Internship = require('../models/Internship');
const { AppError } = require('../middleware/errorHandler');

// GET /api/applications
exports.getApplications = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'student') {
      query.student = req.user._id;
    }

    const applications = await Application.find(query)
      .populate('student', 'name email college branch')
      .populate('internship', 'title company location')
      .sort({ createdAt: -1 });

    res.json({ success: true, applications, count: applications.length });
  } catch (error) {
    next(error);
  }
};

// POST /api/applications
exports.createApplication = async (req, res, next) => {
  try {
    const { internshipId, company, role, status, dateApplied, link, isCustom } = req.body;

    const applicationData = {
      student: req.user._id,
      status: status || 'Applied',
      dateApplied: dateApplied || Date.now(),
      link: link || ''
    };

    if (isCustom) {
      applicationData.isCustom = true;
      applicationData.company = company;
      applicationData.role = role;
    } else {
      const internship = await Internship.findById(internshipId);
      if (!internship) {
        return next(new AppError('Internship not found', 404));
      }
      applicationData.internship = internshipId;
      applicationData.company = internship.company;
      applicationData.role = internship.title;
    }

    const application = await Application.create(applicationData);
    const populated = await Application.findById(application._id)
      .populate('student', 'name email')
      .populate('internship', 'title company');

    res.status(201).json({ success: true, application: populated });
  } catch (error) {
    next(error);
  }
};

// PUT /api/applications/:id
exports.updateApplication = async (req, res, next) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return next(new AppError('Application not found', 404));
    }

    // Students can only update their own
    if (req.user.role === 'student' && application.student.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized', 403));
    }

    application.status = status || application.status;
    await application.save();

    const populated = await Application.findById(application._id)
      .populate('student', 'name email')
      .populate('internship', 'title company');

    res.json({ success: true, application: populated });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/applications/:id
exports.deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return next(new AppError('Application not found', 404));
    }
    if (req.user.role === 'student' && application.student.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized', 403));
    }
    await Application.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Application deleted' });
  } catch (error) {
    next(error);
  }
};

// GET /api/applications/stats
exports.getApplicationStats = async (req, res, next) => {
  try {
    let matchQuery = {};
    if (req.user.role === 'student') {
      matchQuery.student = req.user._id;
    }

    const statusStats = await Application.aggregate([
      { $match: matchQuery },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const monthlyStats = await Application.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            month: { $month: '$dateApplied' },
            year: { $year: '$dateApplied' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const total = await Application.countDocuments(matchQuery);

    res.json({
      success: true,
      stats: {
        total,
        byStatus: statusStats,
        byMonth: monthlyStats
      }
    });
  } catch (error) {
    next(error);
  }
};
