const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['flight', 'hotel'], required: true },
    bookingReference: { type: String, required: true, unique: true },
    status: { type: String, enum: ['confirmed', 'cancelled', 'completed'], default: 'confirmed' },
    
    // Flight booking details
    flightId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight' },
    flightDetails: {
        airline: String,
        flightNumber: String,
        from: String,
        to: String,
        departureTime: String,
        arrivalTime: String,
        duration: String,
        stops: Number,
        aircraft: String,
        terminal: String
    },
    passengers: {
        adults: { type: Number, default: 1 },
        children: { type: Number, default: 0 },
        infants: { type: Number, default: 0 }
    },
    class: { type: String, enum: ['economy', 'premium', 'business', 'first'], default: 'economy' },
    departureDate: Date,
    returnDate: Date,
    
    // Hotel booking details
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
    hotelDetails: {
        name: String,
        location: String,
        rating: Number,
        amenities: [String]
    },
    checkIn: Date,
    checkOut: Date,
    nights: Number,
    guests: {
        adults: { type: Number, default: 2 },
        children: { type: Number, default: 0 },
        infants: { type: Number, default: 0 },
        rooms: { type: Number, default: 1 }
    },
    
    // Common booking details
    totalPrice: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'paid' },
    paymentMethod: String,
    specialRequests: String,
    contactInfo: {
        email: String,
        phone: String
    },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
