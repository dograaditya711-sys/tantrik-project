const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tantrikId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tantrik', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 }, // 1 se 5 star
    comment: { type: String }, // User ka feedback
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' } // Kis chat/call ke baad review diya
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);