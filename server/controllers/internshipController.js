const Internship = require('../models/Internship');
const { AppError } = require('../middleware/errorHandler');

// GET /api/internships
exports.getInternships = async (req, res, next) => {
  try {
    const internships = await Internship.find()
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, internships, count: internships.length });
  } catch (error) {
    next(error);
  }
};

// GET /api/internships/:id
exports.getInternship = async (req, res, next) => {
  try {
    const internship = await Internship.findById(req.params.id)
      .populate('postedBy', 'name email');
    if (!internship) {
      return next(new AppError('Internship not found', 404));
    }
    res.json({ success: true, internship });
  } catch (error) {
    next(error);
  }
};

// POST /api/internships (Admin)
exports.createInternship = async (req, res, next) => {
  try {
    const { title, company, location, stipend, deadline, description } = req.body;
    const internship = await Internship.create({
      title,
      company,
      location,
      stipend,
      deadline,
      description,
      postedBy: req.user._id
    });
    res.status(201).json({ success: true, internship });
  } catch (error) {
    next(error);
  }
};

// PUT /api/internships/:id (Admin)
exports.updateInternship = async (req, res, next) => {
  try {
    const internship = await Internship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!internship) {
      return next(new AppError('Internship not found', 404));
    }
    res.json({ success: true, internship });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/internships/:id (Admin)
exports.deleteInternship = async (req, res, next) => {
  try {
    const internship = await Internship.findByIdAndDelete(req.params.id);
    if (!internship) {
      return next(new AppError('Internship not found', 404));
    }
    res.json({ success: true, message: 'Internship deleted' });
  } catch (error) {
    next(error);
  }
};
