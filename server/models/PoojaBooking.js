const mongoose = require('mongoose');

const poojaBookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    poojaId: { type: mongoose.Schema.Types.ObjectId, ref: 'PoojaService', required: true },
    tantrikId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tantrik' }, // Kisne pooja ki
    
    // User ki details pooja ke liye
    fullName: { type: String, required: true },
    gotra: { type: String },
    birthDetails: { date: Date, time: String, place: String },
    
    amountPaid: { type: Number, required: true },
    preferredDate: { type: Date },
    status: { type: String, enum: ['Pending', 'In-Progress', 'Completed', 'Cancelled'], default: 'Pending' },
    videoProofUrl: { type: String } // Tantrik pooja ka video upload karega
}, { timestamps: true });

module.exports = mongoose.model('PoojaBooking', poojaBookingSchema);