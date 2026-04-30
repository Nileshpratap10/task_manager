const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { authorizeProject } = require('../middleware/role');

router.use(protect);

// Routes with projectId in params
router.get('/project/:projectId', authorizeProject(), getTasks);
router.post('/project/:projectId', authorizeProject(['admin']), createTask);

// Individual task routes
router.route('/:id').put(updateTask).delete(deleteTask);
router.patch('/:id/status', updateTaskStatus);

module.exports = router;
