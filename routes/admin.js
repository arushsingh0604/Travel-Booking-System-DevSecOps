const express = require('express');
const rateLimit = require('express-rate-limit');
const adminController = require('../controllers/adminController');
const flightController = require('../controllers/flightController');
const hotelController = require('../controllers/hotelController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

// Auth rate limiting
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many authentication attempts, please try again later.'
});

// Admin authentication routes
router.post('/register', authLimiter, adminController.register);
router.post('/login', authLimiter, adminController.login);
router.post('/logout', adminController.logout);

// Admin profile routes
router.get('/current', adminController.requireAdmin, adminController.getCurrentAdmin);
router.get('/count', adminController.getAdminCount); // Debug route

// Admin dashboard routes
router.get('/stats', adminController.requireAdmin, adminController.getDashboardStats);

// Public dashboard stats (for user dashboard)
router.get('/public-stats', adminController.getDashboardStats);

// Admin management routes
router.get('/users', adminController.requireAdmin, adminController.getAllUsers);
router.put('/users/:id', adminController.requireAdmin, adminController.updateUser);
router.get('/flights', adminController.requireAdmin, adminController.getAllFlights);
router.post('/flights', adminController.requireAdmin, adminController.createFlight);
router.get('/hotels', adminController.requireAdmin, adminController.getAllHotels);
router.post('/hotels', adminController.requireAdmin, adminController.createHotel);
router.get('/bookings', adminController.requireAdmin, bookingController.getAllBookings);

// Debug routes (remove in production)
router.get('/users-debug', adminController.getUsersDebug);
router.get('/flights-debug', flightController.getFlightsDebug);
router.get('/hotels-debug', hotelController.getHotelsDebug);

module.exports = router;
