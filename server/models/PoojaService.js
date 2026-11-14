const mongoose = require('mongoose');

const poojaServiceSchema = new mongoose.Schema({
    title: { type: String, required: true }, // e.g., Baglamukhi Pooja
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String }, // e.g., "3 Days", "1 Day"
    image: { type: String }, // Pooja ki photo
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('PoojaService', poojaServiceSchema);