const express = require('express');
const SearchHistory = require('../models/SearchHistory');

const router = express.Router();

// Save search history
router.post('/', async (req, res) => {
    try {
        const { type, searchParams } = req.body;
        const userId = req.session?.userId || 'anonymous';
        
        console.log('📝 Saving search history:', { type, userId, searchParams });
        
        const searchHistory = new SearchHistory({
            userId,
            type,
            searchParams,
            timestamp: new Date()
        });
        
        await searchHistory.save();
        
        res.json({ success: true, message: 'Search history saved' });
    } catch (error) {
        console.error('Error saving search history:', error);
        res.status(500).json({ success: false, message: 'Error saving search history' });
    }
});

// Get search history for flights
router.get('/flights', async (req, res) => {
    try {
        const userId = req.session?.userId || 'anonymous';
        
        const history = await SearchHistory.find({
            userId,
            type: 'flight'
        }).sort({ timestamp: -1 }).limit(10);
        
        res.json({ success: true, data: history });
    } catch (error) {
        console.error('Error fetching flight search history:', error);
        res.status(500).json({ success: false, message: 'Error fetching search history' });
    }
});

// Get search history for hotels
router.get('/hotels', async (req, res) => {
    try {
        const userId = req.session?.userId || 'anonymous';
        
        const history = await SearchHistory.find({
            userId,
            type: 'hotel'
        }).sort({ timestamp: -1 }).limit(10);
        
        res.json({ success: true, data: history });
    } catch (error) {
        console.error('Error fetching hotel search history:', error);
        res.status(500).json({ success: false, message: 'Error fetching search history' });
    }
});

module.exports = router;
