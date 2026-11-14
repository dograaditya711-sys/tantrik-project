const mongoose = require('mongoose');

const tantrikSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    profileImage: { type: String }, 
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    
    specializations: [{ type: String }], 
    experience: { type: Number, required: true }, 
    languages: [{ type: String }], 
    
    pricePerMinute: { type: Number, required: true }, 
    rating: { type: Number, default: 5.0 },
    totalReviews: { type: Number, default: 0 },
    
    isOnline: { type: Boolean, default: false }, 
    isVerified: { type: Boolean, default: false }, 
    isBlocked: { type: Boolean, default: false },
    
    walletBalance: { type: Number, default: 0 },

    // 🎯 NAYA: Bank Details Withdrawal ke liye
    bankDetails: {
        accountName: { type: String, default: '' },
        accountNumber: { type: String, default: '' },
        ifscCode: { type: String, default: '' },
        upiId: { type: String, default: '' }
    }
}, { timestamps: true });

module.exports = mongoose.model('Tantrik', tantrikSchema);