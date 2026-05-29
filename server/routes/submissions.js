const express = require('express');
const router = express.Router();
const { getSubmissions, createSubmission, gradeSubmission } = require('../controllers/submissionController');
const { protect, isAdmin, isStudent } = require('../middleware/auth');
const { uploadSubmission } = require('../middleware/upload');

router.get('/', protect, getSubmissions);
router.post('/', protect, isStudent, uploadSubmission.single('file'), createSubmission);
router.put('/:id', protect, isAdmin, gradeSubmission);

module.exports = router;
