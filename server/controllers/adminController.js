const Tantrik = require('../models/Tantrik');
const User = require('../models/User');
const Session = require('../models/Session');
const PoojaService = require('../models/PoojaService');
const PoojaBooking = require('../models/PoojaBooking');
const bcrypt = require('bcryptjs');

// 1. TANTRIK MANAGEMENT
const addTantrik = async (req, res) => {
    try {
        const { name, email, phone, password, specializations, experience, languages, pricePerMinute } = req.body;
        const tantrikExists = await Tantrik.findOne({ email });
        if (tantrikExists) return res.status(400).json({ message: 'Tantrik with this email already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const tantrik = await Tantrik.create({
            name, email, phone, password: hashedPassword,
            specializations, experience, languages, 
            pricePerMinute: Number(pricePerMinute) * 100, // 🎯 H3 Fix: Rupees to Paise
            isVerified: true 
        });

        const responseTantrik = tantrik.toObject();
        delete responseTantrik.password;
        responseTantrik.pricePerMinute = responseTantrik.pricePerMinute / 100;

        res.status(201).json({ message: 'Tantrik added successfully', tantrik: responseTantrik });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const getAllTantriks = async (req, res) => {
    try {
        const tantriks = await Tantrik.find({}).select('-password');
        const formatted = tantriks.map(t => {
            const tObj = t.toObject();
            tObj.pricePerMinute = tObj.pricePerMinute / 100;
            tObj.walletBalance = tObj.walletBalance / 100;
            return tObj;
        });
        res.status(200).json(formatted);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const getTantrikById = async (req, res) => {
    try {
        const tantrik = await Tantrik.findById(req.params.id).select('-password');
        if (tantrik) {
            res.status(200).json({ 
                ...tantrik._doc, 
                pricePerMinute: tantrik.pricePerMinute / 100, 
                walletBalance: tantrik.walletBalance / 100 
            });
        }
        else res.status(404).json({ message: 'Tantrik not found' });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const updateTantrik = async (req, res) => {
    try {
        const tantrik = await Tantrik.findById(req.params.id);
        if (!tantrik) return res.status(404).json({ message: 'Tantrik not found' });

        tantrik.name = req.body.name || tantrik.name;
        tantrik.phone = req.body.phone || tantrik.phone;
        tantrik.specializations = req.body.specializations || tantrik.specializations;
        tantrik.experience = req.body.experience || tantrik.experience;
        tantrik.languages = req.body.languages || tantrik.languages;
        if (req.body.pricePerMinute) {
            tantrik.pricePerMinute = Number(req.body.pricePerMinute) * 100; // 🎯 H3 Fix
        }

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            tantrik.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedTantrik = await tantrik.save();
        const responseTantrik = updatedTantrik.toObject();
        delete responseTantrik.password;
        responseTantrik.pricePerMinute = responseTantrik.pricePerMinute / 100;
        responseTantrik.walletBalance = responseTantrik.walletBalance / 100;

        res.status(200).json({ message: 'Tantrik updated successfully', tantrik: responseTantrik });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteTantrik = async (req, res) => {
    try {
        const tantrik = await Tantrik.findById(req.params.id);
        if (!tantrik) return res.status(404).json({ message: 'Tantrik not found' });
        await tantrik.deleteOne();
        res.status(200).json({ message: 'Tantrik removed successfully' });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

// 2. STATS & USER MANAGEMENT
const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalTantriks = await Tantrik.countDocuments();
        const totalSessions = await Session.countDocuments({ status: 'completed' });

        const sessions = await Session.find({ status: 'completed' });
        const totalRevenueInPaise = sessions.reduce((acc, session) => acc + (session.totalCost * 0.30), 0);

        res.status(200).json({
            totalUsers, totalTantriks, totalSessions,
            totalRevenue: Math.round(totalRevenueInPaise / 100) // 🎯 H3 Fix
        });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const getAllUsersAdmin = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password');
        const formatted = users.map(u => ({ ...u._doc, walletBalance: u.walletBalance / 100 }));
        res.status(200).json(formatted);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const toggleBlockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.isBlocked = !user.isBlocked;
        await user.save();
        res.status(200).json({ message: `User ${user.isBlocked ? 'Blocked' : 'Unblocked'} successfully` });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

// 3. POOJA MANAGEMENT
const addPooja = async (req, res) => {
    try {
        const { title, description, price } = req.body;
        if (!title || !description || !price) return res.status(400).json({ message: 'Please provide all details' });

        let imageUrl = '';
        if (req.file) imageUrl = req.file.path; 

        const pooja = await PoojaService.create({ 
            title, description, 
            price: Number(price) * 100, // 🎯 H3 Fix
            image: imageUrl 
        });
        res.status(201).json({ message: 'Pooja added successfully', pooja });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const getAllPoojas = async (req, res) => {
    try {
        const poojas = await PoojaService.find({ isActive: true });
        const formatted = poojas.map(p => ({ ...p._doc, price: p.price / 100 }));
        res.status(200).json(formatted);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

// 4. POOJA BOOKINGS
const getAllPoojaBookings = async (req, res) => {
    try {
        const bookings = await PoojaBooking.find({})
            .populate('userId', 'name email phone')
            .populate('poojaId', 'title price')
            .sort({ createdAt: -1 });
        
        const formatted = bookings.map(b => {
            const bObj = b.toObject();
            bObj.amountPaid = bObj.amountPaid / 100;
            if (bObj.poojaId) bObj.poojaId.price = bObj.poojaId.price / 100;
            return bObj;
        });
        res.status(200).json(formatted);
    } catch (error) { res.status(500).json({ message: error.message }); }
};

const updatePoojaBookingStatus = async (req, res) => {
    try {
        const { status, videoProofUrl } = req.body;
        const booking = await PoojaBooking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        booking.status = status || booking.status;
        if (videoProofUrl) booking.videoProofUrl = videoProofUrl;
        await booking.save();

        res.status(200).json({ message: 'Booking status updated', booking });
    } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { 
    addTantrik, getAllTantriks, getTantrikById, updateTantrik, deleteTantrik,
    getAdminStats, getAllUsersAdmin, toggleBlockUser,
    addPooja, getAllPoojas, getAllPoojaBookings, updatePoojaBookingStatus
};