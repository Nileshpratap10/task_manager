const express = require('express');
const router = express.Router();
const {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  joinProject,
  updateMemberRole,
  removeMember,
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getProjects).post(createProject);
router.route('/:id').get(getProjectById).put(updateProject).delete(deleteProject);
router.post('/join/:token', joinProject);
router.put('/:id/members/:userId', updateMemberRole);
router.delete('/:id/members/:userId', removeMember);

module.exports = router;
