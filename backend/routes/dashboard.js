const express = require('express');
const router = express.Router();

// Dashboard stats endpoint (public access)
router.get('/stats', async (req, res) => {
    try {
        console.log('📊 Fetching dashboard stats for user dashboard...');
        
        // Return hardcoded values for flights and hotels from our static data
        const stats = {
            totalFlights: 25, // Number of flights in flightController.js hardcoded data
            totalHotels: 25,  // Number of hotels in hotelController.js hardcoded data
            totalPackages: 5, // Estimated packages count
            estimatedSavings: 2500 // Default savings amount
        };
        
        console.log('✅ Dashboard stats response:', stats);
        
        res.json({
            success: true,
            ...stats
        });
    } catch (error) {
        console.error('❌ Error fetching dashboard stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard statistics',
            error: error.message
        });
    }
});

module.exports = router;
