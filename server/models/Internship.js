const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  location: {
    type: String,
    trim: true,
    default: 'Remote'
  },
  stipend: {
    type: String,
    trim: true,
    default: 'Unpaid'
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required']
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Internship', internshipSchema);
