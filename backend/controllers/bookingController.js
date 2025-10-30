const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const Hotel = require('../models/Hotel');
const SearchHistory = require('../models/SearchHistory');

// Flight booking
const bookFlight = async (req, res) => {
    try {
        const { flightId, flightDetails, passengers, class: flightClass, totalPrice, departureDate, returnDate } = req.body;
        
        // Generate booking reference
        const bookingReference = 'FL' + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase();
        
        // Create booking (simplified - in real app would get userId from auth token)
        const booking = new Booking({
            userId: new mongoose.Types.ObjectId(), // Mock user ID
            type: 'flight',
            bookingReference,
            flightId: mongoose.Types.ObjectId.isValid(flightId) ? flightId : null,
            flightDetails,
            passengers,
            class: flightClass,
            departureDate: new Date(departureDate),
            returnDate: returnDate ? new Date(returnDate) : null,
            totalPrice,
            paymentStatus: 'paid'
        });
        
        await booking.save();
        
        // Update flight available seats (if real flight ID provided)
        if (mongoose.Types.ObjectId.isValid(flightId)) {
            const flight = await Flight.findById(flightId);
            if (flight) {
                const totalPassengers = passengers.adults + passengers.children + passengers.infants;
                flight.availableSeats = Math.max(0, flight.availableSeats - totalPassengers);
                await flight.save();
            }
        }
        
        res.json({ 
            success: true,
            message: 'Flight booked successfully', 
            bookingReference,
            bookingId: booking._id,
            updatedSeats: booking.flightDetails?.availableSeats 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Booking failed', error: error.message });
    }
};

// Hotel booking
const bookHotel = async (req, res) => {
    try {
        const { hotelId, hotelDetails, checkIn, checkOut, nights, guests, totalPrice, location } = req.body;
        
        // Generate booking reference
        const bookingReference = 'HT' + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase();
        
        // Create booking (simplified - in real app would get userId from auth token)
        const booking = new Booking({
            userId: new mongoose.Types.ObjectId(), // Mock user ID
            type: 'hotel',
            bookingReference,
            hotelId: mongoose.Types.ObjectId.isValid(hotelId) ? hotelId : null,
            hotelDetails,
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            nights,
            guests,
            totalPrice,
            paymentStatus: 'paid'
        });
        
        await booking.save();
        
        // Update hotel available rooms (if real hotel ID provided)
        if (mongoose.Types.ObjectId.isValid(hotelId)) {
            const hotel = await Hotel.findById(hotelId);
            if (hotel) {
                hotel.availableRooms = Math.max(0, hotel.availableRooms - guests.rooms);
                await hotel.save();
            }
        }
        
        res.json({ 
            success: true,
            message: 'Hotel booked successfully', 
            bookingReference,
            bookingId: booking._id,
            updatedRooms: booking.hotelDetails?.availableRooms 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Booking failed', error: error.message });
    }
};

// Get user bookings
const getBookings = async (req, res) => {
    try {
        // In real app, get userId from auth token
        const bookings = await Booking.find().sort({ createdAt: -1 }).limit(50);
        res.json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching bookings', error: error.message });
    }
};

// Get booking by reference
const getBookingByReference = async (req, res) => {
    try {
        const booking = await Booking.findOne({ bookingReference: req.params.reference });
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        res.json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching booking', error: error.message });
    }
};

// Cancel booking
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findOne({ bookingReference: req.params.reference });
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        
        booking.status = 'cancelled';
        booking.updatedAt = new Date();
        await booking.save();
        
        res.json({ success: true, message: 'Booking cancelled successfully', booking });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error cancelling booking', error: error.message });
    }
};

// Get all bookings (admin)
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching bookings', error: error.message });
    }
};

// Save search history
const saveSearchHistory = async (req, res) => {
    try {
        const { type, searchParams, timestamp } = req.body;
        
        // In real app, get userId from auth token
        const searchHistory = new SearchHistory({
            userId: new mongoose.Types.ObjectId(), // Mock user ID
            type,
            searchParams,
            timestamp: new Date(timestamp || Date.now())
        });
        
        await searchHistory.save();
        res.json({ success: true, message: 'Search history saved' });
    } catch (error) {
        // Silently fail for search history to not disrupt user experience
        console.warn('Search history save failed:', error.message);
        res.status(200).json({ success: true, message: 'OK' });
    }
};

// Get flight search history
const getFlightSearchHistory = async (req, res) => {
    try {
        // In real app, get userId from auth token
        const searches = await SearchHistory.find({ type: 'flight' })
            .sort({ timestamp: -1 })
            .limit(10);
        res.json({ success: true, data: searches });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching search history', error: error.message });
    }
};

// Get hotel search history
const getHotelSearchHistory = async (req, res) => {
    try {
        // In real app, get userId from auth token
        const searches = await SearchHistory.find({ type: 'hotel' })
            .sort({ timestamp: -1 })
            .limit(10);
        res.json({ success: true, data: searches });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching search history', error: error.message });
    }
};

module.exports = {
    bookFlight,
    bookHotel,
    getBookings,
    getBookingByReference,
    cancelBooking,
    getAllBookings,
    saveSearchHistory,
    getFlightSearchHistory,
    getHotelSearchHistory
};
