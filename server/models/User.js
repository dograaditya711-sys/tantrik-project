    const mongoose = require('mongoose');

    const userSchema = new mongoose.Schema({
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String },
        password: { type: String }, // Google login mein password ki zaroorat nahi hoti
        profileImage: { type: String, default: 'default-avatar.png' }, // Profile picture URL
        googleId: { type: String }, // Google login ke liye
        walletBalance: { type: Number, default: 0 },
        role: { type: String, default: 'user' },
        isBlocked: { type: Boolean, default: false },
        fcmToken: { type: String, default: null },
        // Password Reset ke liye
        resetOtp: { type: String },
        resetOtpExpire: { type: Date },

        // Instagram jaisi Privacy Settings
        settings: {
            isPrivateAccount: { type: Boolean, default: false },
            showPhoneToTantrik: { type: Boolean, default: true },
            allowNotifications: { type: Boolean, default: true }
        }
    }, { timestamps: true });

    module.exports = mongoose.model('User', userSchema);