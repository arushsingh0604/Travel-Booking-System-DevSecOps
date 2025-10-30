const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: String,
    location: String,
    rating: { type: Number, min: 1, max: 5 },
    pricePerNight: Number,
    amenities: [String],
    description: String,
    availableRooms: { type: Number, default: 50 },
    status: { type: String, default: 'active', enum: ['active', 'inactive', 'maintenance'] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Hotel', hotelSchema);
