const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // e.g., Black Magic Removal
    iconUrl: { type: String }, // Category ka icon
    description: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('ConsultationCategory', categorySchema);