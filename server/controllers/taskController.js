const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');
const Project = require('../models/Project');
const Notification = require('../models/Notification');

// @desc    Get all tasks for a project
// @route   GET /api/projects/:projectId/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  const { status, priority, sort } = req.query;
  const query = { project: req.params.projectId };

  if (status) query.status = status;
  if (priority) query.priority = priority;

  let apiQuery = Task.find(query).populate('assignedTo', 'name email avatar');

  if (sort) {
    const sortBy = sort.split(',').join(' ');
    apiQuery = apiQuery.sort(sortBy);
  } else {
    apiQuery = apiQuery.sort('-createdAt');
  }

  const tasks = await apiQuery;
  res.json(tasks);
});

// @desc    Create a task
// @route   POST /api/projects/:projectId/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, priority, dueDate } = req.body;

  const task = await Task.create({
    title,
    description,
    priority,
    dueDate,
    assignedTo: assignedTo || null,
    project: req.params.projectId,
    createdBy: req.user._id,
    activityLog: [{ user: req.user._id, action: 'created the task' }],
  });

  // Notify assigned user
  if (assignedTo && assignedTo.toString() !== req.user._id.toString()) {
    await Notification.create({
      recipient: assignedTo,
      sender: req.user._id,
      type: 'task_assigned',
      message: `You were assigned to task: ${title}`,
      relatedProject: req.params.projectId,
      relatedTask: task._id,
    });
  }

  res.status(201).json(task);
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const oldAssignedTo = task.assignedTo;

  task.title = req.body.title || task.title;
  task.description = req.body.description || task.description;
  task.status = req.body.status || task.status;
  task.priority = req.body.priority || task.priority;
  task.dueDate = req.body.dueDate || task.dueDate;
  task.assignedTo = req.body.assignedTo || task.assignedTo;

  if (req.body.status && req.body.status !== task.status) {
    task.activityLog.push({
      user: req.user._id,
      action: `changed status to ${req.body.status}`,
    });
  }

  const updatedTask = await task.save();

  // Notify if assignment changed
  if (req.body.assignedTo && req.body.assignedTo.toString() !== oldAssignedTo?.toString()) {
    await Notification.create({
      recipient: req.body.assignedTo,
      sender: req.user._id,
      type: 'task_assigned',
      message: `You were assigned to task: ${updatedTask.title}`,
      relatedProject: updatedTask.project,
      relatedTask: updatedTask._id,
    });
  }

  res.json(updatedTask);
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  await task.deleteOne();
  res.json({ message: 'Task removed' });
});

// @desc    Update task status (Kanban drag)
// @route   PATCH /api/tasks/:id/status
// @access  Private
const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  task.status = status;
  task.activityLog.push({
    user: req.user._id,
    action: `moved task to ${status}`,
  });

  await task.save();
  res.json(task);
});

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
};
