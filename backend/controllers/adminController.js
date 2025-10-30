const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Flight = require('../models/Flight');
const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');

// Admin authentication middleware
const requireAdmin = (req, res, next) => {
    console.log('🔐 Admin auth check:', {
        hasSession: !!req.session,
        sessionKeys: req.session ? Object.keys(req.session) : 'No session',
        adminId: req.session?.adminId,
        path: req.path
    });
    
    if (req.session && req.session.adminId) {
        console.log('✅ Admin authenticated:', req.session.adminId);
        return next();
    }
    
    console.log('❌ Admin not authenticated');
    return res.status(401).json({ success: false, message: 'Admin authentication required', debug: { session: !!req.session, adminId: req.session?.adminId } });
};

// Admin registration
const register = async (req, res) => {
    console.log('🚀 Admin registration attempt started');
    console.log('📝 Request body:', req.body);
    
    try {
        const { name, email, password } = req.body;
        
        console.log('✅ Extracted fields:', { name, email, passwordLength: password?.length });
        
        // Input validation
        if (!name || !email || !password) {
            console.log('❌ Missing required fields');
            return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
        }
        
        if (password.length < 6) {
            console.log('❌ Password too short');
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('❌ Invalid email format');
            return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
        }
        
        console.log('🔍 Checking for existing admin with email:', email.toLowerCase().trim());
        const existingAdmin = await Admin.findOne({ email: email.toLowerCase().trim() });
        if (existingAdmin) {
            console.log('❌ Admin already exists');
            return res.status(400).json({ success: false, message: 'Admin email already registered' });
        }
        
        console.log('🔐 Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 12);
        
        console.log('🆕 Creating new admin document...');
        const adminData = { 
            name: name.trim(), 
            email: email.toLowerCase().trim(), 
            password: hashedPassword,
            role: 'admin',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        console.log('📄 Admin data to save:', { ...adminData, password: '[HIDDEN]' });
        
        console.log('💾 Attempting to save admin to database...');
        const savedAdmin = await Admin.create(adminData);
        console.log('✅ Admin saved successfully with ID:', savedAdmin._id);
        
        // Check total admin count
        const totalAdmins = await Admin.countDocuments();
        console.log('📊 Total admins in database:', totalAdmins);
        
        res.json({ 
            success: true,
            message: 'Admin registration successful',
            admin: {
                id: savedAdmin._id,
                name: savedAdmin.name,
                email: savedAdmin.email,
                role: savedAdmin.role,
                createdAt: savedAdmin.createdAt
            },
            totalAdmins: totalAdmins
        });
    } catch (error) {
        console.error('💥 Admin registration error:', error);
        
        // Handle specific MongoDB errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                success: false, 
                message: 'Validation error', 
                errors: validationErrors 
            });
        }
        
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: 'Admin with this email already exists' 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Server error during admin registration', 
            error: error.message 
        });
    }
};

// Admin login
const login = async (req, res) => {
    console.log('🚀 Admin login attempt started');
    console.log('📝 Request body:', { email: req.body.email, passwordProvided: !!req.body.password });
    
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            console.log('❌ Missing credentials');
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }
        
        console.log('🔍 Looking for admin with email:', email.toLowerCase().trim());
        const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
        if (!admin) {
            console.log('❌ Admin not found');
            return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
        }
        
        console.log('🔐 Verifying password...');
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            console.log('❌ Invalid password');
            return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
        }
        
        console.log('✅ Password valid, creating session...');
        // Create admin session
        req.session.adminId = admin._id;
        req.session.admin = {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role
        };
        
        // Update last login
        admin.lastLogin = new Date();
        admin.updatedAt = new Date();
        await admin.save();
        
        console.log('✅ Admin login successful:', {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role
        });
        
        res.json({ 
            success: true,
            message: 'Admin login successful', 
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            },
            token: 'admin-session-' + admin._id // Simple token for frontend storage
        });
    } catch (error) {
        console.error('💥 Admin login error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Admin logout
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Admin logout failed' });
        }
        res.clearCookie('connect.sid');
        res.json({ success: true, message: 'Admin logout successful' });
    });
};

// Get current admin
const getCurrentAdmin = async (req, res) => {
    try {
        const admin = await Admin.findById(req.session.adminId).select('-password');
        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }
        res.json({ success: true, admin });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching admin data', error: error.message });
    }
};

// Get admin count (debug)
const getAdminCount = async (req, res) => {
    try {
        const count = await Admin.countDocuments();
        const admins = await Admin.find().select('name email role createdAt');
        res.json({ 
            success: true,
            count, 
            admins,
            message: `Found ${count} admin(s) in database`
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error counting admins', error: error.message });
    }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        // Try to get stats from database first
        let totalUsers = 0;
        let restrictedUsers = 0;
        let totalFlights = 25; // Hardcoded number of flights from flightController.js
        let activeFlights = 25; // All flights are active
        let totalHotels = 25; // Hardcoded number of hotels from hotelController.js
        let activeHotels = 25; // All hotels are active
        let totalBookings = 2; // Set fixed number of bookings as required
        
        try {
            totalUsers = await User.countDocuments();
            restrictedUsers = await User.countDocuments({ isRestricted: true });
            
            // Only try to fetch from database if needed
            // These will only succeed if database is connected
            const dbFlights = await Flight.countDocuments();
            const dbActiveFlights = await Flight.countDocuments({ status: 'active' });
            const dbHotels = await Hotel.countDocuments();
            const dbActiveHotels = await Hotel.countDocuments({ status: 'active' });
            const dbBookings = await Booking.countDocuments();
            
            // Use database values if they're greater than hardcoded values
            if (dbFlights > 0) totalFlights = dbFlights;
            if (dbActiveFlights > 0) activeFlights = dbActiveFlights;
            if (dbHotels > 0) totalHotels = dbHotels;
            if (dbActiveHotels > 0) activeHotels = dbActiveHotels;
            if (dbBookings > 0) totalBookings = dbBookings;
        } catch (dbError) {
            console.log('Using hardcoded values for dashboard stats due to DB error:', dbError.message);
        }
        
        res.json({
            success: true,
            stats: {
                users: {
                    total: totalUsers,
                    restricted: restrictedUsers,
                    active: totalUsers - restrictedUsers
                },
                flights: {
                    total: totalFlights,
                    active: activeFlights,
                    inactive: totalFlights - activeFlights
                },
                hotels: {
                    total: totalHotels,
                    active: activeHotels,
                    inactive: totalHotels - activeHotels
                },
                bookings: {
                    total: totalBookings
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching statistics', error: error.message });
    }
};

// Get all users (admin)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching users', error: error.message });
    }
};

// Get users debug (remove in production)
const getUsersDebug = async (req, res) => {
    try {
        console.log('🔧 DEBUG: Fetching users without authentication');
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        console.log(`Found ${users.length} users`);
        res.json({ success: true, users, debug: true });
    } catch (error) {
        console.error('Error in debug users route:', error);
        res.status(500).json({ success: false, message: 'Error fetching users', error: error.message });
    }
};

// Update user (admin)
const updateUser = async (req, res) => {
    console.log('🚀 Admin user update attempt started');
    console.log('📝 Request params:', req.params);
    console.log('📝 Request body:', req.body);
    
    try {
        const { id } = req.params;
        const { name, email, balance, isRestricted } = req.body;
        
        if (!id) {
            console.log('❌ Missing user ID');
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }
        
        // Input validation
        if (!name || !email) {
            console.log('❌ Missing required fields');
            return res.status(400).json({ success: false, message: 'Name and email are required' });
        }
        
        if (balance && balance < 0) {
            console.log('❌ Invalid balance');
            return res.status(400).json({ success: false, message: 'Balance cannot be negative' });
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('❌ Invalid email format');
            return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
        }
        
        console.log('🔍 Finding user with ID:', id);
        const user = await User.findById(id);
        if (!user) {
            console.log('❌ User not found');
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        // Check if email is taken by another user
        if (email.toLowerCase().trim() !== user.email.toLowerCase()) {
            const existingUser = await User.findOne({ email: email.toLowerCase().trim(), _id: { $ne: id } });
            if (existingUser) {
                console.log('❌ Email already taken by another user');
                return res.status(400).json({ success: false, message: 'Email is already taken by another user' });
            }
        }
        
        console.log('📝 Updating user data...');
        const updateData = {
            name: name.trim(),
            email: email.toLowerCase().trim(),
            balance: parseFloat(balance) || 0,
            isRestricted: Boolean(isRestricted),
            updatedAt: new Date()
        };
        
        console.log('📄 Update data:', updateData);
        
        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!updatedUser) {
            console.log('❌ Failed to update user');
            return res.status(500).json({ success: false, message: 'Failed to update user' });
        }
        
        console.log('✅ User updated successfully:', updatedUser._id);
        
        res.json({ 
            success: true,
            message: 'User updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('💥 User update error:', error);
        
        // Handle specific MongoDB errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                success: false, 
                message: 'Validation error', 
                errors: validationErrors 
            });
        }
        
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email is already taken by another user' 
            });
        }
        
        if (error.name === 'CastError') {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid user ID format' 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Server error during user update', 
            error: error.message 
        });
    }
};

// Get all flights (admin)
const getAllFlights = async (req, res) => {
    try {
        console.log('✈️ Admin fetching flights...');
        
        // Try to get flights from database first
        let flights = [];
        try {
            flights = await Flight.find().sort({ createdAt: -1 });
            console.log(`Found ${flights.length} flights in database`);
        } catch (dbError) {
            console.log('Database not available, using hardcoded data');
        }
        
        // If no flights in database, use hardcoded data from flight controller
        if (flights.length === 0) {
            console.log('Using hardcoded flight data for admin');
            const flightController = require('./flightController');
            
            // Import hardcoded flights (we need to access them directly)
            const HARDCODED_FLIGHTS = [
                // NYC to LAX flights
                {
                    _id: 'flight_001',
                    airline: 'Delta Air Lines',
                    flightNumber: 'DL1234',
                    origin: 'NYC',
                    destination: 'LAX', 
                    departureTime: '2024-01-15T06:00:00Z',
                    arrivalTime: '2024-01-15T09:30:00Z',
                    duration: '6h 30m',
                    price: 299,
                    stops: 0,
                    availableSeats: 45,
                    aircraft: 'Boeing 737-800',
                    terminal: 'Terminal 4',
                    status: 'active',
                    available: true,
                    createdAt: new Date('2024-01-01')
                },
                {
                    _id: 'flight_002',
                    airline: 'American Airlines',
                    flightNumber: 'AA5678',
                    origin: 'NYC',
                    destination: 'LAX',
                    departureTime: '2024-01-15T08:15:00Z',
                    arrivalTime: '2024-01-15T11:45:00Z',
                    duration: '6h 30m',
                    price: 325,
                    stops: 0,
                    availableSeats: 32,
                    aircraft: 'Airbus A321',
                    terminal: 'Terminal 8',
                    status: 'active',
                    available: true,
                    createdAt: new Date('2024-01-01')
                },
                {
                    _id: 'flight_003',
                    airline: 'United Airlines',
                    flightNumber: 'UA9012',
                    origin: 'NYC',
                    destination: 'LAX',
                    departureTime: '2024-01-15T14:30:00Z',
                    arrivalTime: '2024-01-15T18:00:00Z',
                    duration: '6h 30m',
                    price: 275,
                    stops: 1,
                    availableSeats: 28,
                    aircraft: 'Boeing 777-200',
                    terminal: 'Terminal 7',
                    status: 'active',
                    available: true,
                    createdAt: new Date('2024-01-01')
                },
                {
                    _id: 'flight_004',
                    airline: 'British Airways',
                    flightNumber: 'BA117',
                    origin: 'NYC',
                    destination: 'LHR',
                    departureTime: '2024-01-15T21:55:00Z',
                    arrivalTime: '2024-01-16T08:20:00Z',
                    duration: '7h 25m',
                    price: 650,
                    stops: 0,
                    availableSeats: 24,
                    aircraft: 'Boeing 777-300ER',
                    terminal: 'Terminal 7',
                    status: 'active',
                    available: true,
                    createdAt: new Date('2024-01-01')
                },
                {
                    _id: 'flight_005',
                    airline: 'Emirates',
                    flightNumber: 'EK201',
                    origin: 'NYC',
                    destination: 'DXB',
                    departureTime: '2024-01-15T02:25:00Z',
                    arrivalTime: '2024-01-15T22:50:00Z',
                    duration: '12h 25m',
                    price: 850,
                    stops: 0,
                    availableSeats: 15,
                    aircraft: 'Airbus A380',
                    terminal: 'Terminal 4',
                    status: 'active',
                    available: true,
                    createdAt: new Date('2024-01-01')
                }
            ];
            
            flights = HARDCODED_FLIGHTS;
        }
        
        console.log(`Sending ${flights.length} flights to admin dashboard`);
        res.json({ success: true, flights });
    } catch (error) {
        console.error('Error fetching flights for admin:', error);
        res.status(500).json({ success: false, message: 'Error fetching flights', error: error.message });
    }
};

// Create flight (admin)
const createFlight = async (req, res) => {
    console.log('✈️ Admin flight creation attempt started');
    console.log('📝 Request body:', req.body);
    
    try {
        const { 
            airline, flightNumber, from, to, depart, return: returnTime, 
            price, duration, stops, availableSeats, aircraft, terminal 
        } = req.body;
        
        // Input validation
        if (!airline || !flightNumber || !from || !to || !depart || !price) {
            console.log('❌ Missing required fields');
            return res.status(400).json({ 
                success: false, 
                message: 'Airline, flight number, origin, destination, departure time, and price are required' 
            });
        }
        
        if (price <= 0) {
            console.log('❌ Invalid price');
            return res.status(400).json({ success: false, message: 'Price must be greater than 0' });
        }
        
        // Check if flight number already exists
        const existingFlight = await Flight.findOne({ flightNumber });
        if (existingFlight) {
            console.log('❌ Flight number already exists');
            return res.status(400).json({ success: false, message: 'Flight number already exists' });
        }
        
        console.log('📝 Creating new flight...');
        const flightData = {
            airline,
            flightNumber,
            from,
            to,
            depart,
            return: returnTime,
            price: parseFloat(price),
            duration: duration || '2h 00m',
            stops: parseInt(stops) || 0,
            availableSeats: parseInt(availableSeats) || 150,
            aircraft: aircraft || 'Boeing 737',
            terminal: terminal || 'Terminal 1',
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const newFlight = await Flight.create(flightData);
        console.log('✅ Flight created successfully:', newFlight._id);
        
        res.json({ 
            success: true,
            message: 'Flight created successfully',
            flight: newFlight
        });
    } catch (error) {
        console.error('💥 Flight creation error:', error);
        
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                success: false, 
                message: 'Validation error', 
                errors: validationErrors 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Server error during flight creation', 
            error: error.message 
        });
    }
};

// Get all hotels (admin)
const getAllHotels = async (req, res) => {
    try {
        console.log('🏨 Admin fetching hotels...');
        
        // Try to get hotels from database first
        let hotels = [];
        try {
            hotels = await Hotel.find().sort({ createdAt: -1 });
            console.log(`Found ${hotels.length} hotels in database`);
        } catch (dbError) {
            console.log('Database not available, using hardcoded data');
        }
        
        // If no hotels in database, use hardcoded data
        if (hotels.length === 0) {
            console.log('Using hardcoded hotel data for admin');
            
            const HARDCODED_HOTELS = [
                {
                    _id: 'hotel_001',
                    name: 'The Plaza Hotel',
                    location: 'New York, NY',
                    rating: 4.8,
                    pricePerNight: 595,
                    amenities: ['Free WiFi', 'Spa', 'Restaurant', 'Fitness Center', 'Room Service', 'Concierge', 'Valet Parking', 'Business Center'],
                    description: 'Iconic luxury hotel in the heart of Manhattan, steps from Central Park and Fifth Avenue shopping.',
                    availableRooms: 15,
                    status: 'active',
                    starRating: 5,
                    createdAt: new Date('2024-01-01')
                },
                {
                    _id: 'hotel_002',
                    name: 'Pod Hotels Times Square',
                    location: 'New York, NY',
                    rating: 4.2,
                    pricePerNight: 189,
                    amenities: ['Free WiFi', 'Restaurant', 'Fitness Center', '24/7 Front Desk', 'Pet Friendly', 'Rooftop Bar'],
                    description: 'Modern budget-friendly hotel in Times Square with compact, efficient rooms and great city views.',
                    availableRooms: 32,
                    status: 'active',
                    starRating: 3,
                    createdAt: new Date('2024-01-01')
                },
                {
                    _id: 'hotel_003',
                    name: 'The Beverly Hills Hotel',
                    location: 'Los Angeles, CA',
                    rating: 4.7,
                    pricePerNight: 795,
                    amenities: ['Spa', 'Pool', 'Restaurant', 'Fitness Center', 'Room Service', 'Valet Parking', 'Tennis Court', 'Garden'],
                    description: 'Legendary pink palace in Beverly Hills, frequented by Hollywood stars since 1912.',
                    availableRooms: 12,
                    status: 'active',
                    starRating: 5,
                    createdAt: new Date('2024-01-01')
                },
                {
                    _id: 'hotel_004',
                    name: 'The Savoy',
                    location: 'London, UK',
                    rating: 4.9,
                    pricePerNight: 685,
                    amenities: ['Spa', 'Restaurant', 'Fitness Center', 'Room Service', 'Concierge', 'Business Center', 'Butler Service', 'Thames Views'],
                    description: 'Legendary luxury hotel on the Strand with Art Deco elegance and unparalleled service.',
                    availableRooms: 18,
                    status: 'active',
                    starRating: 5,
                    createdAt: new Date('2024-01-01')
                },
                {
                    _id: 'hotel_005',
                    name: 'Hotel Ritz Paris',
                    location: 'Paris, France',
                    rating: 4.8,
                    pricePerNight: 895,
                    amenities: ['Spa', 'Restaurant', 'Fitness Center', 'Pool', 'Room Service', 'Concierge', 'Valet Parking', 'Shopping Arcade'],
                    description: 'Legendary palace hotel in Place Vendôme, epitome of Parisian luxury and elegance.',
                    availableRooms: 9,
                    status: 'active',
                    starRating: 5,
                    createdAt: new Date('2024-01-01')
                }
            ];
            
            hotels = HARDCODED_HOTELS;
        }
        
        console.log(`Sending ${hotels.length} hotels to admin dashboard`);
        res.json({ success: true, hotels });
    } catch (error) {
        console.error('Error fetching hotels for admin:', error);
        res.status(500).json({ success: false, message: 'Error fetching hotels', error: error.message });
    }
};

// Create hotel (admin)
const createHotel = async (req, res) => {
    console.log('🏨 Admin hotel creation attempt started');
    console.log('📝 Request body:', req.body);
    
    try {
        const { 
            name, location, rating, pricePerNight, amenities, 
            description, availableRooms 
        } = req.body;
        
        // Input validation
        if (!name || !location || !pricePerNight) {
            console.log('❌ Missing required fields');
            return res.status(400).json({ 
                success: false, 
                message: 'Name, location, and price per night are required' 
            });
        }
        
        if (pricePerNight <= 0) {
            console.log('❌ Invalid price');
            return res.status(400).json({ success: false, message: 'Price per night must be greater than 0' });
        }
        
        if (rating && (rating < 1 || rating > 5)) {
            console.log('❌ Invalid rating');
            return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
        }
        
        console.log('📝 Creating new hotel...');
        const hotelData = {
            name,
            location,
            rating: parseFloat(rating) || 3.0,
            pricePerNight: parseFloat(pricePerNight),
            amenities: Array.isArray(amenities) ? amenities : (amenities ? [amenities] : []),
            description: description || 'A comfortable hotel with great amenities.',
            availableRooms: parseInt(availableRooms) || 50,
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const newHotel = await Hotel.create(hotelData);
        console.log('✅ Hotel created successfully:', newHotel._id);
        
        res.json({ 
            success: true,
            message: 'Hotel created successfully',
            hotel: newHotel
        });
    } catch (error) {
        console.error('💥 Hotel creation error:', error);
        
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                success: false, 
                message: 'Validation error', 
                errors: validationErrors 
            });
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Server error during hotel creation', 
            error: error.message 
        });
    }
};

module.exports = {
    requireAdmin,
    register,
    login,
    logout,
    getCurrentAdmin,
    getAdminCount,
    getDashboardStats,
    getAllUsers,
    getUsersDebug,
    updateUser,
    getAllFlights,
    createFlight,
    getAllHotels,
    createHotel
};
