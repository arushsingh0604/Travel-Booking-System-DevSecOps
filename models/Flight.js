const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    airline: String,
    flightNumber: String,
    from: String,
    to: String,
    depart: String,
    return: String,
    price: Number,
    duration: String,
    stops: { type: Number, default: 0 },
    availableSeats: { type: Number, default: 150 },
    aircraft: String,
    terminal: String,
    status: { type: String, default: 'active', enum: ['active', 'cancelled', 'delayed'] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Flight', flightSchema);
