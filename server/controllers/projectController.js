const asyncHandler = require('express-async-handler');
const Project = require('../models/Project');
const crypto = require('crypto');

// @desc    Get all user projects
// @route   GET /api/projects
// @access  Private
const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({
    'members.user': req.user._id,
  }).populate('createdBy', 'name email');

  res.json(projects);
});

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const project = await Project.create({
    name,
    description,
    createdBy: req.user._id,
    members: [{ user: req.user._id, role: 'admin' }],
    inviteToken: crypto.randomBytes(20).toString('hex'),
  });

  res.status(201).json(project);
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('members.user', 'name email avatar')
    .populate('createdBy', 'name email');

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check if user is a member
  const isMember = project.members.some(
    (m) => m.user._id.toString() === req.user._id.toString()
  );

  if (!isMember) {
    res.status(403);
    throw new Error('Not authorized to access this project');
  }

  res.json(project);
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin)
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Only admin can update
  const adminMember = project.members.find(
    (m) => m.user.toString() === req.user._id.toString() && m.role === 'admin'
  );

  if (!adminMember) {
    res.status(403);
    throw new Error('Only project admins can update the project');
  }

  project.name = req.body.name || project.name;
  project.description = req.body.description || project.description;
  project.status = req.body.status || project.status;

  const updatedProject = await project.save();
  res.json(updatedProject);
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin)
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Only creator or admin can delete
  const isAdmin = project.members.some(
    (m) => m.user.toString() === req.user._id.toString() && m.role === 'admin'
  );

  if (!isAdmin) {
    res.status(403);
    throw new Error('Only project admins can delete the project');
  }

  await project.deleteOne();
  res.json({ message: 'Project removed' });
});

// @desc    Join project via invite token
// @route   POST /api/projects/join/:token
// @access  Private
const joinProject = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ inviteToken: req.params.token });

  if (!project) {
    res.status(404);
    throw new Error('Invalid invite link');
  }

  // Check if already a member
  const isMember = project.members.some(
    (m) => m.user.toString() === req.user._id.toString()
  );

  if (isMember) {
    res.status(400);
    throw new Error('You are already a member of this project');
  }

  project.members.push({ user: req.user._id, role: 'member' });
  await project.save();

  res.json({ message: 'Joined project successfully', projectId: project._id });
});

// @desc    Update member role
// @route   PUT /api/projects/:id/members/:userId
// @access  Private (Admin)
const updateMemberRole = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Only admin can update roles
  const isAdmin = project.members.some(
    (m) => m.user.toString() === req.user._id.toString() && m.role === 'admin'
  );

  if (!isAdmin) {
    res.status(403);
    throw new Error('Only project admins can update member roles');
  }

  const member = project.members.find(
    (m) => m.user.toString() === req.params.userId
  );

  if (!member) {
    res.status(404);
    throw new Error('Member not found');
  }

  member.role = req.body.role;
  await project.save();

  res.json({ message: 'Member role updated successfully' });
});

// @desc    Remove member
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private (Admin)
const removeMember = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Only admin can remove members
  const isAdmin = project.members.some(
    (m) => m.user.toString() === req.user._id.toString() && m.role === 'admin'
  );

  if (!isAdmin) {
    res.status(403);
    throw new Error('Only project admins can remove members');
  }

  // Cannot remove self if only admin?
  if (req.params.userId === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot remove yourself from the project');
  }

  project.members = project.members.filter(
    (m) => m.user.toString() !== req.params.userId
  );

  await project.save();

  res.json({ message: 'Member removed successfully' });
});

module.exports = {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  joinProject,
  updateMemberRole,
  removeMember,
};
