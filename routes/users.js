const express = require('express');
const rateLimit = require('express-rate-limit');
const userController = require('../controllers/userController');

const router = express.Router();

// Auth rate limiting
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many authentication attempts, please try again later.'
});

// User authentication routes
router.post('/register', authLimiter, userController.register);
router.post('/login', authLimiter, userController.login);
router.post('/logout', userController.logout);

// Protected user routes
router.get('/current', userController.requireAuth, userController.getCurrentUser);
router.put('/profile', userController.requireAuth, userController.updateProfile);

module.exports = router;
