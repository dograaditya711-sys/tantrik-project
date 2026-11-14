const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['recharge', 'deduction', 'refund'], required: true },
    
    paymentMethod: { type: String }, // 'UPI', 'Razorpay', etc.
    status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
    transactionId: { type: String }, // Gateway ka ID
    
    description: { type: String } // e.g., "Wallet Recharge" ya "Chat with Pandit ji"
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);