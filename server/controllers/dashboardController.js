const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  // Get all projects user belongs to
  const projects = await Project.find({ 'members.user': req.user._id });
  const projectIds = projects.map((p) => p._id);

  // Stats
  const totalTasks = await Task.countDocuments({ project: { $in: projectIds } });
  const completedTasks = await Task.countDocuments({
    project: { $in: projectIds },
    status: 'done',
  });
  const pendingTasks = await Task.countDocuments({
    project: { $in: projectIds },
    status: { $ne: 'done' },
  });

  const overdueTasks = await Task.countDocuments({
    project: { $in: projectIds },
    status: { $ne: 'done' },
    dueDate: { $lt: new Date() },
  });

  // Task distribution by priority
  const priorityStats = await Task.aggregate([
    { $match: { project: { $in: projectIds } } },
    { $group: { _id: '$priority', count: { $sum: 1 } } },
  ]);

  // Task distribution by status
  const statusStats = await Task.aggregate([
    { $match: { project: { $in: projectIds } } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  // Project distribution by status
  const projectStatusStats = await Project.aggregate([
    { $match: { 'members.user': req.user._id } },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  // Last 30 Days Activity Report (Tasks Created vs Completed)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const activityStats = await Task.aggregate([
    { 
      $match: { 
        project: { $in: projectIds },
        createdAt: { $gte: thirtyDaysAgo }
      } 
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        created: { $sum: 1 },
        completed: { 
          $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] } 
        }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  res.json({
    totalProjects: projects.length,
    totalTasks,
    completedTasks,
    pendingTasks,
    overdueTasks,
    priorityStats,
    statusStats,
    projectStatusStats,
    activityStats,
  });
});

module.exports = { getDashboardStats };
