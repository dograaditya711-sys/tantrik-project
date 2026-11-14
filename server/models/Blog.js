const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true }, // Pura article
    author: { type: String, default: 'Admin' },
    image: { type: String }, // Thumbnail image
    tags: [{ type: String }], // e.g., ['Vashikaran', 'Horoscope', 'Shani']
    isPublished: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);