#!/usr/bin/env node

/**
 * MongoDB Diagnostic Script for Travel Ease Application
 * 
 * This script tests MongoDB connection and checks database content
 * to help diagnose issues with data retrieval in Linux environments.
 * 
 * Usage:
 *   node scripts/testMongoDB.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Flight = require('../models/Flight');
const Hotel = require('../models/Hotel');

// MongoDB connection test
const testConnection = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/travelEas';
        console.log('🔌 Testing MongoDB connection...');
        console.log('   URI:', mongoUri);
        
        await mongoose.connect(mongoUri);
        console.log('✅ MongoDB connection successful!');
        
        // Test database access
        const dbName = mongoose.connection.db.databaseName;
        console.log('   Database name:', dbName);
        
        return true;
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        return false;
    }
};

// Test collections existence
const testCollections = async () => {
    try {
        console.log('\n📂 Testing collections...');
        
        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);
        
        console.log('   Available collections:', collectionNames);
        
        // Check for expected collections
        const expectedCollections = ['flights', 'hotels', 'users', 'admins', 'bookings'];
        const foundCollections = expectedCollections.filter(col => collectionNames.includes(col));
        const missingCollections = expectedCollections.filter(col => !collectionNames.includes(col));
        
        console.log('   Found expected collections:', foundCollections);
        if (missingCollections.length > 0) {
            console.log('   Missing collections:', missingCollections);
        }
        
        return collectionNames;
    } catch (error) {
        console.error('❌ Error listing collections:', error.message);
        return [];
    }
};

// Test flights data
const testFlightsData = async () => {
    try {
        console.log('\n✈️  Testing flights data...');
        
        // Count documents
        const flightCount = await Flight.countDocuments();
        console.log(`   Total flights: ${flightCount}`);
        
        if (flightCount === 0) {
            console.log('   ⚠️  No flights found in database!');
            return { count: 0, flights: [] };
        }
        
        // Get sample flights
        const sampleFlights = await Flight.find().limit(3);
        console.log('   Sample flights:');
        sampleFlights.forEach((flight, index) => {
            console.log(`     ${index + 1}. ${flight.airline} ${flight.flightNumber}: ${flight.from} → ${flight.to} (₹${flight.price})`);
        });
        
        // Test search queries
        console.log('\n   Testing search queries:');
        
        // Test Mumbai flights
        const mumbaiFlights = await Flight.find({ 
            $or: [
                { from: { $regex: 'mumbai', $options: 'i' } },
                { to: { $regex: 'mumbai', $options: 'i' } }
            ]
        });
        console.log(`     Mumbai flights: ${mumbaiFlights.length}`);
        
        // Test Delhi flights
        const delhiFlights = await Flight.find({ 
            $or: [
                { from: { $regex: 'delhi', $options: 'i' } },
                { to: { $regex: 'delhi', $options: 'i' } }
            ]
        });
        console.log(`     Delhi flights: ${delhiFlights.length}`);
        
        // Test active status
        const activeFlights = await Flight.find({ status: 'active' });
        console.log(`     Active flights: ${activeFlights.length}`);
        
        return { count: flightCount, flights: sampleFlights };
        
    } catch (error) {
        console.error('❌ Error testing flights data:', error.message);
        return { count: 0, flights: [], error: error.message };
    }
};

// Test hotels data
const testHotelsData = async () => {
    try {
        console.log('\n🏨 Testing hotels data...');
        
        // Count documents
        const hotelCount = await Hotel.countDocuments();
        console.log(`   Total hotels: ${hotelCount}`);
        
        if (hotelCount === 0) {
            console.log('   ⚠️  No hotels found in database!');
            return { count: 0, hotels: [] };
        }
        
        // Get sample hotels
        const sampleHotels = await Hotel.find().limit(3);
        console.log('   Sample hotels:');
        sampleHotels.forEach((hotel, index) => {
            console.log(`     ${index + 1}. ${hotel.name} in ${hotel.location} (₹${hotel.pricePerNight}/night)`);
        });
        
        // Test search queries
        console.log('\n   Testing search queries:');
        
        // Test Mumbai hotels
        const mumbaiHotels = await Hotel.find({ 
            location: { $regex: 'mumbai', $options: 'i' } 
        });
        console.log(`     Mumbai hotels: ${mumbaiHotels.length}`);
        
        // Test Delhi hotels
        const delhiHotels = await Hotel.find({ 
            location: { $regex: 'delhi', $options: 'i' } 
        });
        console.log(`     Delhi hotels: ${delhiHotels.length}`);
        
        // Test active status
        const activeHotels = await Hotel.find({ status: 'active' });
        console.log(`     Active hotels: ${activeHotels.length}`);
        
        return { count: hotelCount, hotels: sampleHotels };
        
    } catch (error) {
        console.error('❌ Error testing hotels data:', error.message);
        return { count: 0, hotels: [], error: error.message };
    }
};

// Test query performance
const testQueryPerformance = async () => {
    try {
        console.log('\n⚡ Testing query performance...');
        
        const startTime = Date.now();
        
        // Test flight search query
        const flightQuery = Flight.find({ status: 'active' }).limit(10);
        const flights = await flightQuery;
        const flightTime = Date.now() - startTime;
        
        const hotelStartTime = Date.now();
        // Test hotel search query
        const hotelQuery = Hotel.find({ status: 'active' }).limit(10);
        const hotels = await hotelQuery;
        const hotelTime = Date.now() - hotelStartTime;
        
        console.log(`   Flight query time: ${flightTime}ms`);
        console.log(`   Hotel query time: ${hotelTime}ms`);
        
        if (flightTime > 1000 || hotelTime > 1000) {
            console.log('   ⚠️  Slow query performance detected!');
        } else {
            console.log('   ✅ Query performance is good');
        }
        
        return { flightTime, hotelTime };
    } catch (error) {
        console.error('❌ Error testing query performance:', error.message);
        return { error: error.message };
    }
};

// Test index usage (if any)
const testIndexes = async () => {
    try {
        console.log('\n📊 Testing database indexes...');
        
        // Get flight indexes
        const flightIndexes = await Flight.collection.getIndexes();
        console.log('   Flight collection indexes:', Object.keys(flightIndexes));
        
        // Get hotel indexes
        const hotelIndexes = await Hotel.collection.getIndexes();
        console.log('   Hotel collection indexes:', Object.keys(hotelIndexes));
        
        return { flightIndexes, hotelIndexes };
    } catch (error) {
        console.error('❌ Error checking indexes:', error.message);
        return { error: error.message };
    }
};

// Test environment variables
const testEnvironment = async () => {
    console.log('\n🔧 Environment Configuration:');
    console.log('   NODE_ENV:', process.env.NODE_ENV || 'undefined');
    console.log('   MONGODB_URI:', process.env.MONGODB_URI || 'using default');
    console.log('   PORT:', process.env.PORT || 'using default (4000)');
    
    // Test platform-specific issues
    console.log('   Platform:', process.platform);
    console.log('   Node version:', process.version);
    
    // Check for case sensitivity issues (Linux-specific)
    if (process.platform === 'linux') {
        console.log('   ⚠️  Running on Linux - checking for case sensitivity issues...');
        
        // Check model file names
        const fs = require('fs');
        const path = require('path');
        
        const modelFiles = ['Flight.js', 'Hotel.js', 'User.js', 'Admin.js', 'Booking.js'];
        const modelsDir = path.join(__dirname, '../models');
        
        console.log('   Checking model files in:', modelsDir);
        
        try {
            const existingFiles = fs.readdirSync(modelsDir);
            console.log('   Found model files:', existingFiles);
            
            const missingFiles = modelFiles.filter(file => !existingFiles.includes(file));
            if (missingFiles.length > 0) {
                console.log('   ❌ Missing model files:', missingFiles);
            } else {
                console.log('   ✅ All model files found');
            }
        } catch (error) {
            console.error('   ❌ Error reading models directory:', error.message);
        }
    }
};

// Main diagnostic function
const runDiagnostics = async () => {
    console.log('🔬 MongoDB Diagnostic Tool');
    console.log('==========================\n');
    
    try {
        // Test environment
        await testEnvironment();
        
        // Test connection
        const connected = await testConnection();
        if (!connected) {
            console.log('\n💥 Cannot proceed - MongoDB connection failed!');
            process.exit(1);
        }
        
        // Test collections
        await testCollections();
        
        // Test data
        const flightData = await testFlightsData();
        const hotelData = await testHotelsData();
        
        // Test performance
        await testQueryPerformance();
        
        // Test indexes
        await testIndexes();
        
        // Summary
        console.log('\n📋 Diagnostic Summary:');
        console.log('========================');
        console.log(`   Flights in database: ${flightData.count}`);
        console.log(`   Hotels in database: ${hotelData.count}`);
        
        if (flightData.count === 0 || hotelData.count === 0) {
            console.log('\n💡 Recommendation:');
            console.log('   Run the seed script to populate sample data:');
            console.log('   node scripts/seedDatabase.js');
        } else {
            console.log('\n✅ Database appears to be working correctly!');
            console.log('   If you\'re still experiencing issues, check:');
            console.log('   1. API endpoint URLs in frontend code');
            console.log('   2. CORS configuration');
            console.log('   3. Authentication/session requirements');
            console.log('   4. Network connectivity between frontend and backend');
        }
        
    } catch (error) {
        console.error('\n💥 Diagnostic failed:', error.message);
        process.exit(1);
    } finally {
        // Close database connection
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log('\n🔌 Database connection closed.');
        }
        process.exit(0);
    }
};

// Run diagnostics if called directly
if (require.main === module) {
    runDiagnostics();
}

module.exports = {
    testConnection,
    testCollections,
    testFlightsData,
    testHotelsData,
    testQueryPerformance,
    testIndexes,
    runDiagnostics
};
