const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendOtp = require('../utils/sendOtp');

// ==========================================
// 🛠️ UTILITIES
// ==========================================
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// ==========================================
// 👤 USER AUTH & PROFILE
// ==========================================

// 1. REGISTER USER
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ name, email, phone, password: hashedPassword });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage,
            walletBalance: user.walletBalance / 100, // H3: Paise to Rupees
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. LOGIN USER
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            if (user.isBlocked) return res.status(403).json({ message: 'Account blocked by admin' });

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage,
                walletBalance: user.walletBalance / 100, // H3: Paise to Rupees
                settings: user.settings,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. FORGOT PASSWORD
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: 'User not found' });
        
        // Rate Limit: 1 minute wait
        if (user.resetOtpLastSent && Date.now() - user.resetOtpLastSent.getTime() < 60 * 1000) {
            return res.status(429).json({ message: 'Please wait 1 minute before requesting a new OTP' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp, salt);

        user.resetOtp = hashedOtp;
        user.resetOtpExpire = new Date(Date.now() + 10 * 60 * 1000);
        user.resetOtpAttempts = 0;
        user.resetOtpLastSent = new Date();
        await user.save();

        // 🎯 Send OTP via Email & SMS
        const { emailSent, smsSent } = await sendOtp({ email: user.email, phone: user.phone, otp });

        // Agar dono fail ho jayein toh error return karein
        if (!emailSent && !smsSent) {
            return res.status(500).json({ message: 'Failed to send OTP. Please try again later.' });
        }

        res.status(200).json({ message: 'OTP sent successfully to your email/phone' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. RESET PASSWORD
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email });

        // Checks: User exists, OTP exists, OTP not expired, Attempts < 5
        if (!user || !user.resetOtp || user.resetOtpExpire < Date.now() || user.resetOtpAttempts >= 5) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Verify hashed OTP
        const isMatch = await bcrypt.compare(otp, user.resetOtp);
        if (!isMatch) {
            user.resetOtpAttempts = (user.resetOtpAttempts || 0) + 1;
            await user.save();
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Success - Update Password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        
        // Clear OTP fields
        user.resetOtp = undefined;
        user.resetOtpExpire = undefined;
        user.resetOtpAttempts = 0;
        user.resetOtpLastSent = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 5. GET USER PROFILE
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password -resetOtp');
        if (user) {
            res.json({
                ...user._doc,
                walletBalance: user.walletBalance / 100 // H3: Paise to Rupees
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 6. UPDATE PROFILE
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;

        // H4: Cloudinary Image Upload
        if (req.file) {
            user.profileImage = req.file.path; 
        } else if (req.body.profileImage) {
            user.profileImage = req.body.profileImage;
        }

        if (req.body.settings) user.settings = { ...user.settings, ...req.body.settings };

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            profileImage: updatedUser.profileImage,
            walletBalance: updatedUser.walletBalance / 100, // H3: Paise to Rupees
            settings: updatedUser.settings,
            token: generateToken(updatedUser._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 👑 ADMIN USER MANAGEMENT
// ==========================================

// 7. GET ALL USERS (Admin)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        const formattedUsers = users.map(u => {
            const uObj = u.toObject();
            uObj.walletBalance = uObj.walletBalance / 100; // H3: Paise to Rupees
            return uObj;
        });
        res.status(200).json(formattedUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 8. GET SINGLE USER (Admin)
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (user) {
            res.status(200).json({
                ...user._doc,
                walletBalance: user.walletBalance / 100
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 9. UPDATE USER (Admin - Wallet/Block)
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;
        
        // H3: Rupees to Paise (Admin panel se rupees mein input aata hai)
        if (req.body.walletBalance !== undefined) {
            user.walletBalance = Number(req.body.walletBalance) * 100; 
        }
        user.isBlocked = req.body.isBlocked !== undefined ? req.body.isBlocked : user.isBlocked;

        const updatedUser = await user.save();
        res.status(200).json({ 
            message: 'User updated successfully', 
            user: { ...updatedUser._doc, walletBalance: updatedUser.walletBalance / 100 } 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 10. DELETE USER (Admin)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        await user.deleteOne();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const deleteMyAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        await user.deleteOne();
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = {
    registerUser, 
    loginUser, 
    forgotPassword, 
    resetPassword,
    getUserProfile, 
    updateUserProfile, 
    getAllUsers, 
    getUserById, 
    updateUser, 
    deleteUser,
     deleteMyAccount
};