const express = require('express');
const router = express.Router();
const { registerUser, authUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/registro', registerUser);
router.post('/login', authUser);
router.get('/perfil', protect, getUserProfile);

module.exports = router;
