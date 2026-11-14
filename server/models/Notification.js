const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipientId: { type: mongoose.Schema.Types.ObjectId, required: true }, // User ya Tantrik ki ID
    recipientType: { type: String, enum: ['User', 'Tantrik'], required: true },
    title: { type: String, required: true }, // e.g., "Low Wallet Balance"
    message: { type: String, required: true },
    type: { type: String, enum: ['Wallet', 'Chat', 'Order', 'System'] },
    isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);