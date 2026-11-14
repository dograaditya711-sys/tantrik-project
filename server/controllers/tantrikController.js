const Tantrik = require('../models/Tantrik');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ==========================================
// 🛠️ UTILITIES
// ==========================================
const generateToken = (id) => {
    return jwt.sign({ id, role: 'tantrik' }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// ==========================================
// 🔐 AUTH
// ==========================================

// 1. TANTRIK LOGIN
const authTantrik = async (req, res) => {
    try {
        const { email, password } = req.body;
        const tantrik = await Tantrik.findOne({ email });

        if (!tantrik) return res.status(401).json({ message: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, tantrik.password);

        if (isMatch) {
            if (tantrik.isBlocked) return res.status(403).json({ message: 'Account blocked by admin' });

            res.json({
                _id: tantrik._id,
                name: tantrik.name,
                email: tantrik.email,
                role: 'tantrik',
                walletBalance: tantrik.walletBalance / 100, 
                pricePerMinute: tantrik.pricePerMinute / 100, 
                isOnline: tantrik.isOnline,
                token: generateToken(tantrik._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 👤 PROFILE
// ==========================================

// 2. GET TANTRIK PROFILE
const getTantrikProfile = async (req, res) => {
    try {
        const tantrik = await Tantrik.findById(req.user._id).select('-password');
        if (!tantrik) return res.status(404).json({ message: 'Tantrik not found' });
        
        res.status(200).json({
            ...tantrik._doc,
            walletBalance: tantrik.walletBalance / 100,
            pricePerMinute: tantrik.pricePerMinute / 100
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. TOGGLE ONLINE STATUS
const toggleOnlineStatus = async (req, res) => {
    try {
        const tantrik = await Tantrik.findById(req.user._id);
        if (!tantrik) return res.status(404).json({ message: 'Tantrik not found' });

        tantrik.isOnline = !tantrik.isOnline;
        await tantrik.save();

        res.status(200).json({ isOnline: tantrik.isOnline });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// ⚙️ SETTINGS
// ==========================================

// 4. UPDATE SETTINGS
const updateTantrikSettings = async (req, res) => {
    try {
        const tantrik = await Tantrik.findById(req.user._id);
        if (!tantrik) return res.status(404).json({ message: 'Tantrik not found' });

        tantrik.name = req.body.name || tantrik.name;
        tantrik.phone = req.body.phone || tantrik.phone;
        tantrik.experience = req.body.experience ? Number(req.body.experience) : tantrik.experience;
        
        if (req.body.pricePerMinute) {
            tantrik.pricePerMinute = Number(req.body.pricePerMinute) * 100;
        }

        // 🎯 NEW: Handle Cloudinary Image Upload
        if (req.file) {
            tantrik.profileImage = req.file.path;
        }

        if (req.body.bankDetails) {
            tantrik.bankDetails = {
                accountName: req.body.bankDetails.accountName || '',
                accountNumber: req.body.bankDetails.accountNumber || '',
                ifscCode: req.body.bankDetails.ifscCode || '',
                upiId: req.body.bankDetails.upiId || ''
            };
        }

        const updatedTantrik = await tantrik.save();

        const responseTantrik = updatedTantrik.toObject();
        delete responseTantrik.password;
        responseTantrik.walletBalance = responseTantrik.walletBalance / 100;
        responseTantrik.pricePerMinute = responseTantrik.pricePerMinute / 100;

        res.status(200).json({
            message: 'Settings updated successfully',
            tantrik: responseTantrik
        });
    } catch (error) {
        console.error("Update Settings Error:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    authTantrik,
    getTantrikProfile,
    toggleOnlineStatus,
    updateTantrikSettings
};