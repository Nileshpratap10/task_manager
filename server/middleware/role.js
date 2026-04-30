const Project = require('../models/Project');
const asyncHandler = require('express-async-handler');

const authorizeProject = (roles = []) => {
  return asyncHandler(async (req, res, next) => {
    const projectId = req.params.projectId || req.body.projectId || req.params.id;

    if (!projectId) {
      res.status(400);
      throw new Error('Project ID is required');
    }

    const project = await Project.findById(projectId);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Check if user is a member
    const member = project.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!member) {
      res.status(403);
      throw new Error('Not authorized to access this project');
    }

    // Check if role is allowed (if roles provided)
    if (roles.length > 0 && !roles.includes(member.role)) {
      res.status(403);
      throw new Error(`User role ${member.role} is not authorized`);
    }

    req.project = project;
    req.projectMember = member;
    next();
  });
};

module.exports = { authorizeProject };
