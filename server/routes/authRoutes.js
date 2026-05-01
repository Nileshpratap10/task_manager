const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/upload-avatar', protect, upload.single('avatar'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a file' });
  }
  const protocol = req.protocol;
  const host = req.get('host');
  const avatarUrl = `${protocol}://${host}/uploads/${req.file.filename}`;
  res.json({ avatarUrl });
});

module.exports = router;
