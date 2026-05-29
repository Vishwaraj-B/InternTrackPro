const express = require('express');
const router = express.Router();
const { getInternships, getInternship, createInternship, updateInternship, deleteInternship } = require('../controllers/internshipController');
const { protect, isAdmin } = require('../middleware/auth');

router.get('/', protect, getInternships);
router.get('/:id', protect, getInternship);
router.post('/', protect, isAdmin, createInternship);
router.put('/:id', protect, isAdmin, updateInternship);
router.delete('/:id', protect, isAdmin, deleteInternship);

module.exports = router;
