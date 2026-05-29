const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    trim: true,
    default: ''
  },
  fileUrl: {
    type: String,
    default: ''
  },
  feedback: {
    type: String,
    trim: true,
    default: ''
  },
  grade: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['Submitted', 'Graded'],
    default: 'Submitted'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Submission', submissionSchema);
