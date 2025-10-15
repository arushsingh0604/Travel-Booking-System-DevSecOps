const express = require('express');
const bookingController = require('../controllers/bookingController');
const { requireAdmin } = require('../controllers/adminController');

const router = express.Router();

// Public booking routes
router.post('/flight', bookingController.bookFlight);
router.post('/hotel', bookingController.bookHotel);
router.get('/', bookingController.getBookings);
router.get('/:reference', bookingController.getBookingByReference);
router.put('/:reference/cancel', bookingController.cancelBooking);

// Search history routes
router.post('/search-history', bookingController.saveSearchHistory);
router.get('/search-history/flights', bookingController.getFlightSearchHistory);
router.get('/search-history/hotels', bookingController.getHotelSearchHistory);

// Admin booking routes
router.get('/admin/all', requireAdmin, bookingController.getAllBookings);

module.exports = router;
