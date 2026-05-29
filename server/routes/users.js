const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, uploadResume, getAllStudents, getStudentById } = require('../controllers/userController');
const { protect, isAdmin, isStudent } = require('../middleware/auth');
const { uploadResume: uploadResumeMiddleware } = require('../middleware/upload');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/resume', protect, isStudent, uploadResumeMiddleware.single('resume'), uploadResume);
router.get('/students', protect, isAdmin, getAllStudents);
router.get('/students/:id', protect, isAdmin, getStudentById);

module.exports = router;
