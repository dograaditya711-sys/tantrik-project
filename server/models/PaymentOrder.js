const mongoose = require('mongoose');

// 🎯 SECURITY FIX (C2): Payment orders alag collection mein
// Kyun alag? Transaction sirf completed ledger ke liye hai. Pending/failed
// orders ledger mein nahi ghusne chahiye — isse reconciliation clean rehta hai.
const paymentOrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    razorpayOrderId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    // verify ke baad set hota hai. Sparse unique — multiple pending orders
    // mein null/undefined allowed, lekin ek payment_id sirf ek document mein.
    razorpayPaymentId: {
        type: String,
        unique: true,
        sparse: true
    },
    // 🎯 Amount hamesha paise (integer) mein — floating point nahi
    amount: {
        type: Number,
        required: true,
        min: 1
    },
    status: {
        type: String,
        enum: ['created', 'paid', 'failed'],
        default: 'created',
        index: true
    }
}, { timestamps: true });

module.exports = mongoose.model('PaymentOrder', paymentOrderSchema);