const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true }, // e.g., FIRST50
    discountType: { type: String, enum: ['percentage', 'flat'], required: true },
    discountValue: { type: Number, required: true }, // e.g., 50 (for 50% or ₹50)
    minRechargeAmount: { type: Number, default: 0 }, // Minimum kitna recharge karna padega
    maxDiscount: { type: Number }, // Agar percentage hai toh max kitna off milega
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);