#!/usr/bin/env node

/**
 * Database Seed Script for Travel Ease Application
 * 
 * This script populates the database with sample flights and hotels data
 * for development and testing purposes.
 * 
 * Usage:
 *   node scripts/seedDatabase.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Flight = require('../models/Flight');
const Hotel = require('../models/Hotel');

// MongoDB connection
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/travelEas';
        console.log('🔌 Connecting to MongoDB:', mongoUri);
        
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
};

// Sample flights data - Updated to match frontend expected formats with 200-1000 price range
const sampleFlights = [
    {
        airline: "Air India",
        flightNumber: "AI101",
        from: "NYC - New York",
        to: "LAX - Los Angeles",
        depart: "06:30",
        return: "08:45",
        price: 850,
        duration: "5h 15m",
        stops: 0,
        availableSeats: 150,
        aircraft: "Boeing 737",
        terminal: "Terminal 3",
        status: "active"
    },
    {
        airline: "IndiGo",
        flightNumber: "6E202",
        from: "LAX - Los Angeles",
        to: "LHR - London",
        depart: "10:15",
        return: "11:45",
        price: 620,
        duration: "11h 30m",
        stops: 0,
        availableSeats: 180,
        aircraft: "Airbus A320",
        terminal: "Terminal 1",
        status: "active"
    },
    {
        airline: "SpiceJet",
        flightNumber: "SG303",
        from: "NYC - New York",
        to: "CDG - Paris",
        depart: "14:20",
        return: "16:55",
        price: 980,
        duration: "7h 35m",
        stops: 0,
        availableSeats: 160,
        aircraft: "Boeing 737",
        terminal: "Terminal 2",
        status: "active"
    },
    {
        airline: "Vistara",
        flightNumber: "UK404",
        from: "LHR - London",
        to: "DXB - Dubai",
        depart: "09:45",
        return: "12:30",
        price: 720,
        duration: "6h 45m",
        stops: 0,
        availableSeats: 140,
        aircraft: "Airbus A321",
        terminal: "Terminal 1",
        status: "active"
    },
    {
        airline: "Air Asia",
        flightNumber: "I5505",
        from: "DXB - Dubai",
        to: "NYC - New York",
        depart: "18:30",
        return: "21:15",
        price: 780,
        duration: "12h 45m",
        stops: 1,
        availableSeats: 170,
        aircraft: "Airbus A320",
        terminal: "Terminal 2",
        status: "active"
    },
    {
        airline: "GoAir",
        flightNumber: "G8606",
        from: "CDG - Paris",
        to: "LAX - Los Angeles",
        depart: "12:15",
        return: "13:45",
        price: 550,
        duration: "11h 30m",
        stops: 0,
        availableSeats: 190,
        aircraft: "Airbus A320neo",
        terminal: "Terminal 1",
        status: "active"
    },
    {
        airline: "Air India Express",
        flightNumber: "IX707",
        from: "LAX - Los Angeles",
        to: "NRT - Tokyo",
        depart: "02:45",
        return: "05:30",
        price: 560,
        duration: "11h 45m",
        stops: 0,
        availableSeats: 165,
        aircraft: "Boeing 737",
        terminal: "Terminal 2",
        status: "active"
    },
    {
        airline: "Emirates",
        flightNumber: "EK808",
        from: "NRT - Tokyo",
        to: "SIN - Singapore",
        depart: "08:20",
        return: "13:15",
        price: 320,
        duration: "7h 55m",
        stops: 0,
        availableSeats: 300,
        aircraft: "Airbus A380",
        terminal: "Terminal 3",
        status: "active"
    },
    {
        airline: "Jet Airways",
        flightNumber: "9W909",
        from: "SIN - Singapore",
        to: "SYD - Sydney",
        depart: "15:30",
        return: "17:00",
        price: 680,
        duration: "8h 30m",
        stops: 0,
        availableSeats: 155,
        aircraft: "Boeing 737",
        terminal: "Terminal 3",
        status: "active"
    },
    {
        airline: "AirAsia India",
        flightNumber: "I5101",
        from: "SYD - Sydney",
        to: "DXB - Dubai",
        depart: "07:00",
        return: "08:15",
        price: 420,
        duration: "14h 15m",
        stops: 1,
        availableSeats: 180,
        aircraft: "Airbus A320",
        terminal: "Terminal 1",
        status: "active"
    },
    {
        airline: "Qatar Airways",
        flightNumber: "QR134",
        from: "DXB - Dubai",
        to: "FRA - Frankfurt",
        depart: "03:15",
        return: "08:45",
        price: 350,
        duration: "6h 30m",
        stops: 0,
        availableSeats: 250,
        aircraft: "Boeing 777",
        terminal: "Terminal 3",
        status: "active"
    },
    {
        airline: "Singapore Airlines",
        flightNumber: "SQ406",
        from: "FRA - Frankfurt",
        to: "AMS - Amsterdam",
        depart: "11:30",
        return: "14:15",
        price: 420,
        duration: "1h 45m",
        stops: 0,
        availableSeats: 280,
        aircraft: "Airbus A350",
        terminal: "Terminal 2",
        status: "active"
    },
    {
        airline: "Thai Airways",
        flightNumber: "TG319",
        from: "AMS - Amsterdam",
        to: "LHR - London",
        depart: "16:45",
        return: "19:30",
        price: 280,
        duration: "1h 45m",
        stops: 0,
        availableSeats: 200,
        aircraft: "Boeing 787",
        terminal: "Terminal 1",
        status: "active"
    },
    {
        airline: "Lufthansa",
        flightNumber: "LH754",
        from: "LHR - London",
        to: "NYC - New York",
        depart: "13:20",
        return: "01:45+1",
        price: 650,
        duration: "8h 25m",
        stops: 0,
        availableSeats: 320,
        aircraft: "Airbus A380",
        terminal: "Terminal 3",
        status: "active"
    },
    {
        airline: "Air France",
        flightNumber: "AF225",
        from: "CDG - Paris",
        to: "NYC - New York",
        depart: "22:35",
        return: "12:15+1",
        price: 580,
        duration: "8h 40m",
        stops: 0,
        availableSeats: 290,
        aircraft: "Boeing 777",
        terminal: "Terminal 2",
        status: "active"
    },
    {
        airline: "British Airways",
        flightNumber: "BA131",
        from: "LHR - London",
        to: "CDG - Paris",
        depart: "21:10",
        return: "10:35+1",
        price: 620,
        duration: "1h 25m",
        stops: 0,
        availableSeats: 310,
        aircraft: "Boeing 787",
        terminal: "Terminal 3",
        status: "active"
    },
    {
        airline: "Cathay Pacific",
        flightNumber: "CX695",
        from: "NRT - Tokyo",
        to: "LAX - Los Angeles",
        depart: "01:35",
        return: "05:20",
        price: 380,
        duration: "9h 45m",
        stops: 0,
        availableSeats: 240,
        aircraft: "Airbus A330",
        terminal: "Terminal 2",
        status: "active"
    },
    {
        airline: "Turkish Airlines",
        flightNumber: "TK721",
        from: "SIN - Singapore",
        to: "FRA - Frankfurt",
        depart: "02:05",
        return: "12:45",
        price: 450,
        duration: "12h 40m",
        stops: 1,
        availableSeats: 260,
        aircraft: "Boeing 777",
        terminal: "Terminal 3",
        status: "active"
    },
    {
        airline: "Etihad Airways",
        flightNumber: "EY205",
        from: "DXB - Dubai",
        to: "SIN - Singapore",
        depart: "09:15",
        return: "14:30",
        price: 300,
        duration: "7h 15m",
        stops: 0,
        availableSeats: 220,
        aircraft: "Airbus A320",
        terminal: "Terminal 1",
        status: "active"
    },
    {
        airline: "Malaysian Airlines",
        flightNumber: "MH191",
        from: "SYD - Sydney",
        to: "SIN - Singapore",
        depart: "23:45",
        return: "01:30+1",
        price: 220,
        duration: "8h 45m",
        stops: 0,
        availableSeats: 190,
        aircraft: "Boeing 737",
        terminal: "Terminal 1",
        status: "active"
    },
    // Additional 10 flights with same locations, different times and pricing based on stops
    {
        airline: "Air India",
        flightNumber: "AI102",
        from: "NYC - New York",
        to: "LAX - Los Angeles",
        depart: "14:45",
        return: "17:20",
        price: 950, // Higher price - 1 stop
        duration: "7h 35m",
        stops: 1,
        availableSeats: 120,
        aircraft: "Boeing 777",
        terminal: "Terminal 1",
        status: "active"
    },
    {
        airline: "Emirates",
        flightNumber: "EK234",
        from: "LAX - Los Angeles",
        to: "LHR - London",
        depart: "22:30",
        return: "18:15+1",
        price: 780, // Higher price - 1 stop
        duration: "13h 45m",
        stops: 1,
        availableSeats: 200,
        aircraft: "Airbus A380",
        terminal: "Terminal 2",
        status: "active"
    },
    {
        airline: "Air India",
        flightNumber: "AI405",
        from: "NYC - New York",
        to: "CDG - Paris",
        depart: "08:15",
        return: "21:45",
        price: 590, // Lower price - direct flight, early morning
        duration: "7h 30m",
        stops: 0,
        availableSeats: 180,
        aircraft: "Airbus A330",
        terminal: "Terminal 1",
        status: "active"
    },
    {
        airline: "British Airways",
        flightNumber: "BA456",
        from: "LHR - London",
        to: "DXB - Dubai",
        depart: "16:20",
        return: "01:45+1",
        price: 820, // Higher price - 1 stop
        duration: "8h 25m",
        stops: 1,
        availableSeats: 160,
        aircraft: "Boeing 787",
        terminal: "Terminal 2",
        status: "active"
    },
    {
        airline: "Air India",
        flightNumber: "AI678",
        from: "DXB - Dubai",
        to: "NYC - New York",
        depart: "05:45",
        return: "11:30",
        price: 480, // Lower price - early morning departure
        duration: "12h 45m",
        stops: 0,
        availableSeats: 190,
        aircraft: "Boeing 777",
        terminal: "Terminal 3",
        status: "active"
    },
    {
        airline: "Lufthansa",
        flightNumber: "LH892",
        from: "CDG - Paris",
        to: "LAX - Los Angeles",
        depart: "19:40",
        return: "22:15",
        price: 720, // Medium price - evening flight
        duration: "11h 35m",
        stops: 0,
        availableSeats: 210,
        aircraft: "Airbus A340",
        terminal: "Terminal 3",
        status: "active"
    },
    {
        airline: "JAL",
        flightNumber: "JL123",
        from: "LAX - Los Angeles",
        to: "NRT - Tokyo",
        depart: "11:20",
        return: "15:45+1",
        price: 650, // Medium price - direct midday flight
        duration: "11h 25m",
        stops: 0,
        availableSeats: 175,
        aircraft: "Boeing 787",
        terminal: "Terminal 1",
        status: "active"
    },
    {
        airline: "Air India",
        flightNumber: "AI999",
        from: "NRT - Tokyo",
        to: "SIN - Singapore",
        depart: "17:35",
        return: "23:50",
        price: 420, // Lower price - evening flight
        duration: "7h 15m",
        stops: 0,
        availableSeats: 165,
        aircraft: "Airbus A321",
        terminal: "Terminal 2",
        status: "active"
    },
    {
        airline: "Qantas",
        flightNumber: "QF567",
        from: "SIN - Singapore",
        to: "SYD - Sydney",
        depart: "04:15",
        return: "14:30",
        price: 350, // Lower price - very early morning
        duration: "8h 15m",
        stops: 0,
        availableSeats: 185,
        aircraft: "Airbus A330",
        terminal: "Terminal 1",
        status: "active"
    },
    {
        airline: "KLM",
        flightNumber: "KL789",
        from: "SYD - Sydney",
        to: "AMS - Amsterdam",
        depart: "12:30",
        return: "06:45+1",
        price: 890, // Higher price - 2 stops
        duration: "22h 15m",
        stops: 2,
        availableSeats: 140,
        aircraft: "Boeing 777",
        terminal: "Terminal 2",
        status: "active"
    }
];

// Sample hotels data - Updated to include cities matching frontend formats with 200-1000 price range
const sampleHotels = [
    {
        name: "The Plaza Hotel",
        location: "New York",
        rating: 5,
        pricePerNight: 950,
        amenities: ["WiFi", "Pool", "Spa", "Gym", "Restaurant", "Bar", "Concierge", "Valet Parking"],
        description: "Iconic luxury hotel in the heart of Manhattan with world-class amenities and historic charm.",
        availableRooms: 50,
        status: "active"
    },
    {
        name: "The Beverly Hills Hotel",
        location: "Los Angeles",
        rating: 5,
        pricePerNight: 880,
        amenities: ["WiFi", "Pool", "Spa", "Gym", "Restaurant", "Bar", "Business Center"],
        description: "Luxury heritage hotel in Beverly Hills with elegant Hollywood glamour.",
        availableRooms: 40,
        status: "active"
    },
    {
        name: "The Savoy Hotel",
        location: "London",
        rating: 5,
        pricePerNight: 750,
        amenities: ["WiFi", "Pool", "Spa", "Gym", "Restaurant", "Bar", "Airport Shuttle"],
        description: "Magnificent luxury hotel in London with modern amenities and traditional British charm.",
        availableRooms: 35,
        status: "active"
    },
    {
        name: "Hotel Le Bristol",
        location: "Paris",
        rating: 5,
        pricePerNight: 720,
        amenities: ["WiFi", "Pool", "Spa", "Gym", "Restaurant", "Bar", "Garden"],
        description: "Opulent palace hotel with royal French architecture and landscaped gardens.",
        availableRooms: 45,
        status: "active"
    },
    {
        name: "Burj Al Arab",
        location: "Dubai",
        rating: 5,
        pricePerNight: 1000,
        amenities: ["WiFi", "Beach Access", "Pool", "Restaurant", "Bar", "Water Sports", "Helicopter Pad"],
        description: "Iconic sail-shaped luxury resort offering stunning ocean views and world-class amenities.",
        availableRooms: 60,
        status: "active"
    },
    {
        name: "The Ritz-Carlton Tokyo",
        location: "Tokyo",
        rating: 5,
        pricePerNight: 820,
        amenities: ["WiFi", "Pool", "Spa", "Gym", "Restaurant", "Bar", "Meeting Rooms"],
        description: "Contemporary luxury hotel in Tokyo with modern amenities and city skyline views.",
        availableRooms: 55,
        status: "active"
    },
    {
        name: "Marina Bay Sands",
        location: "Singapore",
        rating: 5,
        pricePerNight: 798,
        amenities: ["WiFi", "Infinity Pool", "Spa", "Gym", "Restaurant", "Bar", "Business Center", "Casino"],
        description: "Iconic hotel with infinity pool and excellent conference facilities with marina views.",
        availableRooms: 42,
        status: "active"
    },
    {
        name: "Park Hyatt Sydney",
        location: "Sydney",
        rating: 5,
        pricePerNight: 680,
        amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Bar", "Harbor View"],
        description: "Waterfront hotel showcasing Sydney harbor with contemporary Australian hospitality.",
        availableRooms: 38,
        status: "active"
    },
    {
        name: "The Westin Frankfurt",
        location: "Frankfurt",
        rating: 5,
        pricePerNight: 655,
        amenities: ["WiFi", "Pool", "Restaurant", "Bar", "Business Center", "Airport Shuttle"],
        description: "Business hotel offering authentic German experiences and financial district access.",
        availableRooms: 48,
        status: "active"
    },
    {
        name: "The Hoxton Amsterdam",
        location: "Amsterdam",
        rating: 4,
        pricePerNight: 420,
        amenities: ["WiFi", "Restaurant", "Bar", "Bike Rental", "Canal View"],
        description: "Modern boutique hotel with comfortable amenities and efficient service near the canals.",
        availableRooms: 65,
        status: "active"
    },
    {
        name: "W New York",
        location: "New York",
        rating: 4,
        pricePerNight: 580,
        amenities: ["WiFi", "Pool", "Restaurant", "Gym", "Rooftop Bar"],
        description: "Trendy hotel in Times Square with modern amenities and vibrant nightlife.",
        availableRooms: 70,
        status: "active"
    },
    {
        name: "The Standard Los Angeles",
        location: "Los Angeles",
        rating: 4,
        pricePerNight: 515,
        amenities: ["WiFi", "Pool", "Restaurant", "Bar", "Rooftop Lounge"],
        description: "Comfortable hotel in downtown LA with easy access to entertainment districts.",
        availableRooms: 32,
        status: "active"
    },
    {
        name: "Claridge's",
        location: "London",
        rating: 5,
        pricePerNight: 840,
        amenities: ["WiFi", "Spa", "Restaurant", "Bar", "Afternoon Tea", "Butler Service"],
        description: "Historic luxury hotel with stunning Mayfair location and royal British hospitality.",
        availableRooms: 28,
        status: "active"
    },
    {
        name: "Four Seasons George V",
        location: "Paris",
        rating: 5,
        pricePerNight: 865,
        amenities: ["WiFi", "Pool", "Spa", "Gym", "Restaurant", "Bar", "Business Center"],
        description: "Premium palace hotel near Champs-Élysées with modern amenities and excellent service.",
        availableRooms: 36,
        status: "active"
    },
    {
        name: "Atlantis The Palm",
        location: "Dubai",
        rating: 5,
        pricePerNight: 985,
        amenities: ["WiFi", "Waterpark", "Spa", "Gym", "Restaurant", "Bar", "Aquarium"],
        description: "Resort-style hotel on Palm Jumeirah with waterpark and world-class spa facilities.",
        availableRooms: 44,
        status: "active"
    },
    {
        name: "The Shangri-La Tokyo",
        location: "Tokyo",
        rating: 5,
        pricePerNight: 708,
        amenities: ["WiFi", "Pool", "Restaurant", "Gym", "Business Center"],
        description: "Modern hotel with contemporary design and business-friendly amenities in central Tokyo.",
        availableRooms: 52,
        status: "active"
    },
    {
        name: "The Fullerton Hotel",
        location: "Singapore",
        rating: 5,
        pricePerNight: 682,
        amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Bar", "Heritage Tours"],
        description: "Contemporary heritage hotel with modern amenities and Marina Bay views.",
        availableRooms: 58,
        status: "active"
    },
    {
        name: "The Langham Sydney",
        location: "Sydney",
        rating: 4,
        pricePerNight: 545,
        amenities: ["WiFi", "Pool", "Restaurant", "Gym", "Business Center", "Harbor Shuttle"],
        description: "Business hotel with modern facilities and convenient location in The Rocks.",
        availableRooms: 46,
        status: "active"
    },
    {
        name: "Steigenberger Frankfurter Hof",
        location: "Frankfurt",
        rating: 5,
        pricePerNight: 572,
        amenities: ["WiFi", "Restaurant", "Gym", "Business Center", "City View"],
        description: "Grand hotel with city views and easy access to financial district and trade fairs.",
        availableRooms: 38,
        status: "active"
    },
    {
        name: "Hotel V Nesplein",
        location: "Amsterdam",
        rating: 4,
        pricePerNight: 398,
        amenities: ["WiFi", "Restaurant", "Bar", "Gym", "Museum Quarter Access"],
        description: "Modern hotel with easy access to famous museums and cultural sites in Amsterdam.",
        availableRooms: 42,
        status: "active"
    },
    // Additional 10 hotels with same locations, different ratings and prices
    {
        name: "Pod Hotel New York",
        location: "New York",
        rating: 3,
        pricePerNight: 285,
        amenities: ["WiFi", "Restaurant", "24/7 Front Desk"],
        description: "Budget-friendly hotel in Midtown Manhattan with compact, modern rooms and efficient service.",
        availableRooms: 85,
        status: "active"
    },
    {
        name: "Holiday Inn Express LA",
        location: "Los Angeles",
        rating: 3,
        pricePerNight: 320,
        amenities: ["WiFi", "Pool", "Gym", "Business Center", "Airport Shuttle"],
        description: "Convenient mid-range hotel near LAX with complimentary breakfast and modern amenities.",
        availableRooms: 95,
        status: "active"
    },
    {
        name: "Premier Inn London",
        location: "London",
        rating: 3,
        pricePerNight: 245,
        amenities: ["WiFi", "Restaurant", "24/7 Reception"],
        description: "Comfortable budget hotel chain with consistent quality and central London locations.",
        availableRooms: 78,
        status: "active"
    },
    {
        name: "Hotel des Arts Paris",
        location: "Paris",
        rating: 3,
        pricePerNight: 298,
        amenities: ["WiFi", "Restaurant", "Bar", "City Tours"],
        description: "Charming boutique hotel near Montmartre with artistic decor and Parisian atmosphere.",
        availableRooms: 56,
        status: "active"
    },
    {
        name: "Citymax Hotel Dubai",
        location: "Dubai",
        rating: 3,
        pricePerNight: 385,
        amenities: ["WiFi", "Pool", "Gym", "Restaurant", "Business Center"],
        description: "Modern business hotel in Dubai's commercial district with competitive rates.",
        availableRooms: 92,
        status: "active"
    },
    {
        name: "Capsule Hotel Tokyo",
        location: "Tokyo",
        rating: 2,
        pricePerNight: 220,
        amenities: ["WiFi", "Shared Lounge", "Vending Machines"],
        description: "Traditional Japanese capsule hotel offering unique accommodation experience at budget prices.",
        availableRooms: 150,
        status: "active"
    },
    {
        name: "Hotel 81 Singapore",
        location: "Singapore",
        rating: 2,
        pricePerNight: 248,
        amenities: ["WiFi", "Air Conditioning", "24/7 Reception"],
        description: "No-frills budget hotel with clean, comfortable rooms in central Singapore location.",
        availableRooms: 88,
        status: "active"
    },
    {
        name: "YHA Sydney Harbour",
        location: "Sydney",
        rating: 2,
        pricePerNight: 198,
        amenities: ["WiFi", "Kitchen Facilities", "Common Room", "Harbor View"],
        description: "Budget hostel with spectacular harbor views and social atmosphere for backpackers.",
        availableRooms: 120,
        status: "active"
    },
    {
        name: "Meininger Hotel Frankfurt",
        location: "Frankfurt",
        rating: 3,
        pricePerNight: 275,
        amenities: ["WiFi", "Bar", "Game Room", "Bike Rental"],
        description: "Hybrid hotel-hostel concept with both private rooms and dorms, perfect for business travelers.",
        availableRooms: 68,
        status: "active"
    },
    {
        name: "ClinkNOORD Amsterdam",
        location: "Amsterdam",
        rating: 3,
        pricePerNight: 235,
        amenities: ["WiFi", "Restaurant", "Bar", "Terrace", "Bike Rental"],
        description: "Contemporary hostel in a former laboratory building with industrial chic design.",
        availableRooms: 102,
        status: "active"
    }
];

// Function to clear existing data
const clearExistingData = async () => {
    try {
        console.log('🗑️  Clearing existing data...');
        await Flight.deleteMany({});
        await Hotel.deleteMany({});
        console.log('✅ Existing data cleared successfully');
    } catch (error) {
        console.error('❌ Error clearing data:', error.message);
        throw error;
    }
};

// Function to seed flights
const seedFlights = async () => {
    try {
        console.log('✈️  Seeding flights data...');
        const flights = await Flight.insertMany(sampleFlights);
        console.log(`✅ Successfully inserted ${flights.length} flights`);
        return flights;
    } catch (error) {
        console.error('❌ Error seeding flights:', error.message);
        throw error;
    }
};

// Function to seed hotels
const seedHotels = async () => {
    try {
        console.log('🏨 Seeding hotels data...');
        const hotels = await Hotel.insertMany(sampleHotels);
        console.log(`✅ Successfully inserted ${hotels.length} hotels`);
        return hotels;
    } catch (error) {
        console.error('❌ Error seeding hotels:', error.message);
        throw error;
    }
};

// Function to verify seeded data
const verifyData = async () => {
    try {
        console.log('🔍 Verifying seeded data...');
        
        const flightCount = await Flight.countDocuments();
        const hotelCount = await Hotel.countDocuments();
        
        console.log(`📊 Database Statistics:`);
        console.log(`   ✈️  Flights: ${flightCount}`);
        console.log(`   🏨 Hotels: ${hotelCount}`);
        
        // Test a sample query
        console.log('\n🧪 Testing sample queries...');
        
        const mumbaiFlights = await Flight.find({ 
            $or: [
                { from: { $regex: 'mumbai', $options: 'i' } },
                { to: { $regex: 'mumbai', $options: 'i' } }
            ]
        });
        console.log(`   🔍 Mumbai flights found: ${mumbaiFlights.length}`);
        
        const delhiHotels = await Hotel.find({ 
            location: { $regex: 'delhi', $options: 'i' } 
        });
        console.log(`   🔍 Delhi hotels found: ${delhiHotels.length}`);
        
        return { flightCount, hotelCount };
    } catch (error) {
        console.error('❌ Error verifying data:', error.message);
        throw error;
    }
};

// Main seed function
const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding process...\n');
        
        // Connect to database
        await connectDB();
        
        // Clear existing data (optional - comment out if you want to keep existing data)
        await clearExistingData();
        
        // Seed new data
        await seedFlights();
        await seedHotels();
        
        // Verify seeded data
        await verifyData();
        
        console.log('\n🎉 Database seeding completed successfully!');
        console.log('📝 You can now test the application with the sample data.');
        
    } catch (error) {
        console.error('\n💥 Database seeding failed:', error.message);
        process.exit(1);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('🔌 Database connection closed.');
        process.exit(0);
    }
};

// Run the seed script
if (require.main === module) {
    seedDatabase();
}

module.exports = {
    seedDatabase,
    sampleFlights,
    sampleHotels
};
