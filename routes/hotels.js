const express = require('express');
const hotelController = require('../controllers/hotelController');
const { requireAdmin } = require('../controllers/adminController');

const router = express.Router();

// Public hotel routes
router.get('/', hotelController.getAllHotelsPublic); // GET all hotels for initial load
router.post('/search', hotelController.searchHotels); // POST search with filters
router.get('/filter', hotelController.filterHotels); // GET hotels with query parameters

// Hotel utility routes
router.get('/locations', hotelController.getLocations); // Get available locations
router.get('/amenities', hotelController.getAmenities); // Get available amenities

// Admin hotel routes
router.get('/admin', requireAdmin, hotelController.getAllHotels);

// Debug route (remove in production)
router.get('/debug', hotelController.getHotelsDebug);

module.exports = router;
