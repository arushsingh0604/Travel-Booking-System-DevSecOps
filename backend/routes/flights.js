const express = require('express');
const flightController = require('../controllers/flightController');
const { requireAdmin } = require('../controllers/adminController');

const router = express.Router();

// Public flight routes
router.get('/', flightController.getAllFlightsPublic); // GET all flights for initial load
router.post('/search', flightController.searchFlights); // POST search with filters
router.get('/filter', flightController.filterFlights); // GET flights with query parameters

// Flight utility routes
router.get('/airlines', flightController.getAirlines); // Get available airlines
router.get('/locations', flightController.getLocations); // Get available locations

// Admin flight routes
router.get('/admin', requireAdmin, flightController.getAllFlights);

// Debug route (remove in production)
router.get('/debug', flightController.getFlightsDebug);

module.exports = router;
