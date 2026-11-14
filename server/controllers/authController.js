const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// JWT Token generate karne ka function
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
const authUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Email check karo
        const user = await User.findOne({ email });

        // Password check karo (bcrypt se compare karo)
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role, // Admin, User ya Tantrik
                walletBalance: user.walletBalance,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { authUser };