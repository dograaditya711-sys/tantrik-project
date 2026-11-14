const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., Shree Yantra
    category: { type: String, required: true }, // e.g., Yantra, Rudraksha, Pooja Samagri
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String }, // Product image URL
    stock: { type: Number, default: 10 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);