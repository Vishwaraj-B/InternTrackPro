const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');

// GET /api/users/profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, college, branch, semester } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, college, branch, semester },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// POST /api/users/resume
exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('Please upload a file', 400));
    }
    const resumeUrl = `/uploads/resumes/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { resumeUrl },
      { new: true }
    );
    res.json({ success: true, user, resumeUrl });
  } catch (error) {
    next(error);
  }
};

// GET /api/users/students (Admin)
exports.getAllStudents = async (req, res, next) => {
  try {
    const students = await User.find({ role: 'student' }).sort({ createdAt: -1 });
    res.json({ success: true, students, count: students.length });
  } catch (error) {
    next(error);
  }
};

// GET /api/users/students/:id (Admin)
exports.getStudentById = async (req, res, next) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student || student.role !== 'student') {
      return next(new AppError('Student not found', 404));
    }
    res.json({ success: true, student });
  } catch (error) {
    next(error);
  }
};
