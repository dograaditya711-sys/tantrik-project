const Session = require('../models/Session');
const User = require('../models/User');
const Tantrik = require('../models/Tantrik');
const { endSessionAndBill } = require('../utils/sessionBilling');

// ==========================================
// 1. START SESSION (Chat/Call)
// ==========================================
const startSession = async (req, res) => {
    try {
        const { tantrikId, type } = req.body;
        const user = await User.findById(req.user._id);
        const tantrik = await Tantrik.findById(tantrikId);

        if (!tantrik) return res.status(404).json({ message: 'Tantrik not found' });

        // 🎯 H3 Fix: Balance aur rate dono paise mein hain, direct compare karenge
        if (user.walletBalance < tantrik.pricePerMinute) {
            return res.status(400).json({ message: 'Insufficient wallet balance. Please recharge.' });
        }

        const existingSession = await Session.findOne({
            userId: user._id,
            tantrikId: tantrik._id,
            status: 'ongoing'
        });

        if (existingSession) {
            return res.status(200).json({
                message: 'Resuming existing session',
                sessionId: existingSession._id,
                rate: tantrik.pricePerMinute / 100 // 🎯 Rupees mein bhejein
            });
        }

        const session = await Session.create({
            userId: user._id,
            tantrikId: tantrik._id,
            type: type || 'chat',
            status: 'ongoing',
            startTime: new Date(),
            lastHeartbeatAt: new Date()
        });

        res.status(201).json({
            message: 'Session started',
            sessionId: session._id,
            rate: tantrik.pricePerMinute / 100 // 🎯 Rupees mein bhejein
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 2. END SESSION (Manual)
// ==========================================
const endSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);
        if (!session || session.status !== 'ongoing') {
            return res.status(400).json({ message: 'Session already ended or invalid' });
        }

        const isParticipant =
            session.userId.toString() === req.user._id.toString() ||
            session.tantrikId.toString() === req.user._id.toString();
        if (!isParticipant) {
            return res.status(403).json({ message: 'Not authorized to end this session' });
        }

        const result = await endSessionAndBill(session._id, { autoEnded: false });
        if (!result) {
            return res.status(400).json({ message: 'Session already ended' });
        }

        // 🎯 H3 Fix: Helper se result paise mein aata hai, usko rupees mein convert karke bhejein
        res.status(200).json({ 
            message: 'Session ended', 
            duration: result.duration,
            totalDeducted: result.totalDeducted / 100,
            remainingBalance: result.remainingBalance / 100,
            autoEnded: result.autoEnded
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 3. GET MY SESSIONS (History)
// ==========================================
const getMySessions = async (req, res) => {
    try {
        const query = { status: 'completed' };
        if (req.user.role === 'tantrik') {
            query.tantrikId = req.user._id;
        } else {
            query.userId = req.user._id;
        }

        const sessions = await Session.find(query)
            .populate('tantrikId', 'name profileImage')
            .populate('userId', 'name profileImage')
            .sort({ createdAt: -1 });

        // 🎯 H3 Fix: totalCost paise mein hai, usko rupees mein convert karein
        const formattedSessions = sessions.map(sess => {
            const s = sess.toObject();
            s.totalCost = s.totalCost / 100;
            return s;
        });

        res.status(200).json(formattedSessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 4. GET SESSION MESSAGES
// ==========================================
const getSessionMessages = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);
        if (!session) return res.status(404).json({ message: 'Session not found' });

        const isParticipant =
            session.userId.toString() === req.user._id.toString() ||
            session.tantrikId.toString() === req.user._id.toString();
        if (!isParticipant) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.status(200).json(session.chatMessages || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    startSession,
    endSession,
    getMySessions,
    getSessionMessages
};