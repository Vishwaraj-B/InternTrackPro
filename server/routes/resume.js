const express = require('express');
const router = express.Router();
const { analyzeResume, scoreATS } = require('../controllers/resumeController');
const { protect, isStudent } = require('../middleware/auth');

// POST /api/resume/analyze
// Analyze user's uploaded resume generally
router.post('/analyze', protect, isStudent, analyzeResume);

// POST /api/resume/ats
// Score user's uploaded resume against an internship (ATS)
router.post('/ats', protect, isStudent, scoreATS);

module.exports = router;
