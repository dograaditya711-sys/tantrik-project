const PoojaService = require('../models/PoojaService');
const PoojaBooking = require('../models/PoojaBooking');
const User = require('../models/User'); 

// ==========================================
// --- POOJA SERVICES CRUD ---
// ==========================================
const addPooja = async (req, res) => {
    try {
        const pooja = await PoojaService.create(req.body);
        res.status(201).json({ message: 'Pooja added successfully', pooja });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllPoojas = async (req, res) => {
    try {
        // Sirf active poojas user ko dikhein
        const poojas = await PoojaService.find({ isActive: true });
        res.status(200).json(poojas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// --- ADMIN: MANAGE BOOKINGS ---
// ==========================================
const getAllBookings = async (req, res) => {
    try {
        const bookings = await PoojaBooking.find({})
            .populate('userId', 'name email phone')
            .populate('poojaId', 'title price');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateBookingStatus = async (req, res) => {
    try {
        const { status, videoProofUrl } = req.body;
        const booking = await PoojaBooking.findById(req.params.id);
        
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        booking.status = status || booking.status;
        if (videoProofUrl) booking.videoProofUrl = videoProofUrl;

        await booking.save();
        res.status(200).json({ message: 'Booking updated', booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// --- USER: BOOK A POOJA ---
// ==========================================
const bookPooja = async (req, res) => {
    try {
        const { poojaId, fullName, gotra, preferredDate } = req.body;
        
        const pooja = await PoojaService.findById(poojaId);
        if (!pooja) return res.status(404).json({ message: 'Pooja not found' });

        const user = await User.findById(req.user._id);

        // Wallet Balance Check
        if (user.walletBalance < pooja.price) {
            return res.status(400).json({ message: 'Insufficient wallet balance. Please recharge.' });
        }

        // Deduct Balance
        user.walletBalance -= pooja.price;
        await user.save();

        // Create Booking
        const booking = await PoojaBooking.create({
            userId: user._id,
            poojaId: pooja._id,
            fullName,
            gotra,
            preferredDate,
            amountPaid: pooja.price,
            status: 'Pending'
        });

        res.status(201).json({ 
            message: 'Pooja booked successfully!', 
            booking,
            newBalance: user.walletBalance
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyBookings = async (req, res) => {
    try {
        const bookings = await PoojaBooking.find({ userId: req.user._id })
            .populate('poojaId', 'title price image')
            .sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    addPooja, 
    getAllPoojas, 
    getAllBookings, 
    updateBookingStatus, 
    bookPooja, 
    getMyBookings 
};