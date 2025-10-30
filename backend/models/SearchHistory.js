const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['flight', 'hotel'], required: true },
    searchParams: {
        // Flight search params
        from: String,
        to: String,
        depart: String,
        returnDate: String,
        passengers: {
            adults: Number,
            children: Number,
            infants: Number
        },
        class: String,
        
        // Hotel search params
        location: String,
        checkIn: String,
        checkOut: String,
        guests: {
            adults: Number,
            children: Number,
            infants: Number,
            rooms: Number
        },
        priceRange: {
            min: Number,
            max: Number
        }
    },
    resultsCount: Number,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SearchHistory', searchHistorySchema);
