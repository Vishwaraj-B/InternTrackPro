const express = require('express');
const router = express.Router();
const { getApplications, createApplication, updateApplication, deleteApplication, getApplicationStats } = require('../controllers/applicationController');
const { protect, isStudent } = require('../middleware/auth');

router.get('/stats', protect, getApplicationStats);
router.get('/', protect, getApplications);
router.post('/', protect, isStudent, createApplication);
router.put('/:id', protect, updateApplication);
router.delete('/:id', protect, deleteApplication);

module.exports = router;
