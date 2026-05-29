const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  internship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship',
    default: null
  },
  company: {
    type: String,
    trim: true,
    default: ''
  },
  role: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['Applied', 'Under Review', 'Interview', 'Accepted', 'Rejected'],
    default: 'Applied'
  },
  dateApplied: {
    type: Date,
    default: Date.now
  },
  link: {
    type: String,
    trim: true,
    default: ''
  },
  isCustom: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Application', applicationSchema);
