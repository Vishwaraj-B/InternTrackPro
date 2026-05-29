const express = require('express');
const router = express.Router();
const { getTasks, getTask, createTask, updateTask, deleteTask, getTaskStats } = require('../controllers/taskController');
const { protect, isAdmin } = require('../middleware/auth');

router.get('/stats', protect, getTaskStats);
router.get('/', protect, getTasks);
router.get('/:id', protect, getTask);
router.post('/', protect, isAdmin, createTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, isAdmin, deleteTask);

module.exports = router;
