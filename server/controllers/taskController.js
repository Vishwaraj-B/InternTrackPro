const Task = require('../models/Task');
const { AppError } = require('../middleware/errorHandler');

// GET /api/tasks
exports.getTasks = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'student') {
      query.assignedTo = req.user._id;
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, tasks, count: tasks.length });
  } catch (error) {
    next(error);
  }
};

// GET /api/tasks/:id
exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!task) {
      return next(new AppError('Task not found', 404));
    }
    res.json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// POST /api/tasks (Admin)
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, deadline, priority, assignedTo } = req.body;

    const task = await Task.create({
      title,
      description,
      deadline,
      priority: priority || 'Medium',
      assignedTo: assignedTo || [],
      createdBy: req.user._id
    });

    const populated = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.status(201).json({ success: true, task: populated });
  } catch (error) {
    next(error);
  }
};

// PUT /api/tasks/:id
exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return next(new AppError('Task not found', 404));
    }

    // Students can only update status
    if (req.user.role === 'student') {
      if (req.body.status) {
        task.status = req.body.status;
      }
    } else {
      // Admin can update everything
      Object.assign(task, req.body);
    }

    await task.save();

    const populated = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.json({ success: true, task: populated });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/tasks/:id (Admin)
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return next(new AppError('Task not found', 404));
    }
    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};

// GET /api/tasks/stats
exports.getTaskStats = async (req, res, next) => {
  try {
    let matchQuery = {};
    if (req.user.role === 'student') {
      matchQuery.assignedTo = req.user._id;
    }

    const statusStats = await Task.aggregate([
      { $match: matchQuery },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const priorityStats = await Task.aggregate([
      { $match: matchQuery },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    const total = await Task.countDocuments(matchQuery);

    res.json({
      success: true,
      stats: {
        total,
        byStatus: statusStats,
        byPriority: priorityStats
      }
    });
  } catch (error) {
    next(error);
  }
};
