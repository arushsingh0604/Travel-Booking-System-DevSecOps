const express = require('express');
const mongoose = require('mongoose');
const Flight = require('../models/Flight');
const Hotel = require('../models/Hotel');

const router = express.Router();

// Basic health check
router.get('/', async (req, res) => {
    try {
        const health = {
            status: 'OK',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            platform: process.platform,
            nodeVersion: process.version,
            database: {
                status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
                readyState: mongoose.connection.readyState,
                host: mongoose.connection.host,
                port: mongoose.connection.port,
                name: mongoose.connection.name
            }
        };

        res.json(health);
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Database connectivity check
router.get('/db', async (req, res) => {
    try {
        // Test database connection
        const dbStatus = mongoose.connection.readyState;
        let status = 'unknown';
        
        switch (dbStatus) {
            case 0: status = 'disconnected'; break;
            case 1: status = 'connected'; break;
            case 2: status = 'connecting'; break;
            case 3: status = 'disconnecting'; break;
        }

        // Test collections access
        const collections = await mongoose.connection.db.listCollections().toArray();
        
        // Count documents in main collections
        const flightCount = await Flight.countDocuments();
        const hotelCount = await Hotel.countDocuments();

        res.json({
            status: 'OK',
            database: {
                status,
                readyState: dbStatus,
                host: mongoose.connection.host,
                port: mongoose.connection.port,
                name: mongoose.connection.name,
                collections: collections.map(c => c.name),
                documentCounts: {
                    flights: flightCount,
                    hotels: hotelCount
                }
            },
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Database health check error:', error);
        res.status(500).json({
            status: 'ERROR',
            message: error.message,
            database: {
                status: 'error',
                readyState: mongoose.connection.readyState
            },
            timestamp: new Date().toISOString()
        });
    }
});

// Data verification check
router.get('/data', async (req, res) => {
    try {
        // Sample data verification
        const sampleFlight = await Flight.findOne({ status: 'active' });
        const sampleHotel = await Hotel.findOne({ status: 'active' });
        
        const dataStatus = {
            status: 'OK',
            flights: {
                total: await Flight.countDocuments(),
                active: await Flight.countDocuments({ status: 'active' }),
                sample: sampleFlight ? {
                    id: sampleFlight._id,
                    airline: sampleFlight.airline,
                    from: sampleFlight.from,
                    to: sampleFlight.to,
                    price: sampleFlight.price
                } : null
            },
            hotels: {
                total: await Hotel.countDocuments(),
                active: await Hotel.countDocuments({ status: 'active' }),
                sample: sampleHotel ? {
                    id: sampleHotel._id,
                    name: sampleHotel.name,
                    location: sampleHotel.location,
                    price: sampleHotel.pricePerNight,
                    rating: sampleHotel.rating
                } : null
            },
            timestamp: new Date().toISOString()
        };

        res.json(dataStatus);
        
    } catch (error) {
        console.error('Data verification error:', error);
        res.status(500).json({
            status: 'ERROR',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = router;
