const Submission = require('../models/Submission');
const Task = require('../models/Task');
const { AppError } = require('../middleware/errorHandler');

// GET /api/submissions
exports.getSubmissions = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'student') {
      query.student = req.user._id;
    }

    // Filter by task if provided
    if (req.query.taskId) {
      query.task = req.query.taskId;
    }

    const submissions = await Submission.find(query)
      .populate('student', 'name email')
      .populate('task', 'title description deadline priority')
      .sort({ submittedAt: -1 });

    res.json({ success: true, submissions, count: submissions.length });
  } catch (error) {
    next(error);
  }
};

// POST /api/submissions
exports.createSubmission = async (req, res, next) => {
  try {
    const { taskId, content } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return next(new AppError('Task not found', 404));
    }

    // Check if already submitted
    const existing = await Submission.findOne({
      task: taskId,
      student: req.user._id
    });
    if (existing) {
      return next(new AppError('You have already submitted this task', 400));
    }

    const submissionData = {
      task: taskId,
      student: req.user._id,
      content: content || ''
    };

    if (req.file) {
      submissionData.fileUrl = `/uploads/submissions/${req.file.filename}`;
    }

    const submission = await Submission.create(submissionData);

    const populated = await Submission.findById(submission._id)
      .populate('student', 'name email')
      .populate('task', 'title description');

    res.status(201).json({ success: true, submission: populated });
  } catch (error) {
    next(error);
  }
};

// PUT /api/submissions/:id (Admin - grade/feedback)
exports.gradeSubmission = async (req, res, next) => {
  try {
    const { feedback, grade } = req.body;

    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return next(new AppError('Submission not found', 404));
    }

    submission.feedback = feedback || submission.feedback;
    submission.grade = grade || submission.grade;
    submission.status = 'Graded';
    await submission.save();

    const populated = await Submission.findById(submission._id)
      .populate('student', 'name email')
      .populate('task', 'title description');

    res.json({ success: true, submission: populated });
  } catch (error) {
    next(error);
  }
};
