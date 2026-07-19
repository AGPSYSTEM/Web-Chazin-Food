const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deactivateUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

// Public auth endpoints
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// User profile endpoints
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
  .delete(protect, deactivateUser);

// Alternative endpoint to deactivate profile
router.put('/deactivate', protect, deactivateUser);

// Administrative CRUD endpoints (usually restricted to admin, protected by protect middleware)
router.route('/')
  .get(protect, getUsers)
  .post(protect, createUser);

router.route('/:id')
  .put(protect, updateUser)
  .delete(protect, deleteUser);

module.exports = router;
