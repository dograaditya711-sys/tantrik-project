const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const connectDB = require('./config/db');
const Session = require('./models/Session');
const { endSessionAndBill } = require('./utils/sessionBilling');
 // 🎯 Naya Import
const Tantrik = require('./models/Tantrik'); // 🎯 Naya Import

dotenv.config();
connectDB();

const app = express();
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors());
app.use(express.json());

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { message: 'Too many attempts.' } });
const forgotPasswordLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 3, message: { message: 'Too many OTP requests.' } });
const registerLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5, message: { message: 'Too many accounts created.' } });
const paymentLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 20, message: { message: 'Too many payment requests.' } });
const generalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300, message: { message: 'Too many requests.' } });

app.use('/api/users/login', authLimiter);
app.use('/api/users/tantrik-login', authLimiter);
app.use('/api/users/register', registerLimiter);
app.use('/api/users/forgot-password', forgotPasswordLimiter);
app.use('/api/users/reset-password', forgotPasswordLimiter);
app.use('/api/users/create-payment-order', paymentLimiter);
app.use('/api/users/verify-payment', paymentLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/astrology', require('./routes/astrologyRoutes'));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', generalLimiter);

app.get('/', (req, res) => {
    res.send('Tantrik Site Backend is running successfully!');
});

const server = http.createServer(app);
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const io = new Server(server, {
    cors: { 
        origin: CLIENT_URL, 
        methods: ['GET', 'POST'],
        credentials: true 
    }
});

io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.data.userId = decoded.id;
        socket.data.role = decoded.role || 'user';
        next();
    } catch {
        next(new Error('Invalid token'));
    }
});

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

const saveSystemMessage = async (senderId, receiverId, messageText) => {
    try {
        const session = await Session.findOne({
            $or: [
                { userId: senderId, tantrikId: receiverId, status: 'ongoing' },
                { userId: receiverId, tantrikId: senderId, status: 'ongoing' }
            ]
        });

        if (session) {
            session.chatMessages.push({ sender: 'system', message: messageText, timestamp: new Date() });
            await session.save();

            const sysMsg = {
                senderId: 'system', senderName: 'System', receiverId: receiverId,
                message: messageText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            io.to(receiverId).emit('receive_message', sysMsg);
            io.to(senderId).emit('receive_message', sysMsg);
        }
    } catch (err) {
        console.error("Error saving system message:", err);
    }
};

io.on('connection', (socket) => {
    console.log('✅ Connected:', socket.id, '| userId:', socket.data.userId, '| role:', socket.data.role);

    socket.on('join_room', () => {
        socket.join(socket.data.userId);
    });

    socket.on('typing', (data) => {
        if (!data.receiverId) return;
        io.to(data.receiverId).emit('user_typing', { senderId: socket.data.userId, receiverId: data.receiverId });
    });

    socket.on('stop_typing', (data) => {
        if (!data.receiverId) return;
        io.to(data.receiverId).emit('user_stopped_typing', { senderId: socket.data.userId, receiverId: data.receiverId });
    });

    // 🎯 CALL SIGNALING & CHAT MESSAGES
    socket.on('call_user', async (data) => {
        if (!data.receiverId) return;
        
        // 1. Socket Event
        io.to(data.receiverId).emit('incoming_call', {
            senderId: socket.data.userId, senderName: data.senderName, receiverId: data.receiverId, peerId: data.peerId
        });
        
        // 2. Chat Message
        await saveSystemMessage(socket.data.userId, data.receiverId, `📞 ${data.senderName} initiated a voice call`);

        // 🎯 3. FCM Push Notification (Agar app background mein hai)
        try {
            const tantrik = await Tantrik.findById(data.receiverId);
            if (tantrik && tantrik.fcmToken) {
                const message = {
                    notification: { title: 'Incoming Call 📞', body: `${data.senderName} is calling you!` },
                    token: tantrik.fcmToken,
                };
                await admin.messaging().send(message);
            }
        } catch (error) {
            console.error("FCM Error:", error);
        }
    });

    socket.on('call_accepted', async (data) => {
        if (!data.receiverId) return;
        io.to(data.receiverId).emit('call_accepted', { senderId: socket.data.userId, peerId: data.peerId });
        await saveSystemMessage(socket.data.userId, data.receiverId, `📞 Call connected`);
    });

    socket.on('reject_call', async (data) => {
        if (!data.receiverId) return;
        io.to(data.receiverId).emit('call_rejected', { senderId: socket.data.userId, receiverId: data.receiverId });
        await saveSystemMessage(socket.data.userId, data.receiverId, `📞 Missed call`);
    });

    socket.on('end_call', async (data) => {
        if (!data.receiverId) return;
        io.to(data.receiverId).emit('call_ended');
        await saveSystemMessage(socket.data.userId, data.receiverId, `📞 Call ended`);
    });

    socket.on('heartbeat', async ({ receiverId } = {}) => {
        if (!receiverId) return;
        try {
            const session = await Session.findOne({
                $or: [
                    { userId: socket.data.userId, tantrikId: receiverId, status: 'ongoing' },
                    { userId: receiverId, tantrikId: socket.data.userId, status: 'ongoing' }
                ]
            });
            if (session) {
                session.lastHeartbeatAt = new Date();
                await session.save();
            }
        } catch (e) { console.error('Heartbeat error:', e.message); }
    });

    socket.on('send_message', async (data) => {
        try {
            const senderId = socket.data.userId;
            const receiverId = data.receiverId;

            if (!receiverId || !data.message || !data.message.trim()) return;

            const session = await Session.findOne({
                $or: [
                    { userId: senderId, tantrikId: receiverId },
                    { userId: receiverId, tantrikId: senderId }
                ],
                status: 'ongoing'
            });

            if (!session) return socket.emit('error', { message: 'No active session with this user' });

            const isUserSender = session.userId.toString() === senderId;
            session.chatMessages.push({
                sender: isUserSender ? 'user' : 'tantrik',
                message: data.message,
                timestamp: new Date()
            });
            session.lastHeartbeatAt = new Date();
            await session.save();

            const outgoingData = {
                senderId, senderName: data.senderName, receiverId, message: data.message,
                time: data.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            io.to(receiverId).emit('receive_message', outgoingData);
            socket.emit('receive_message', outgoingData);
        } catch (error) { console.error('Error in send_message:', error); }
    });

    socket.on('disconnect', () => {
        console.log('❌ Disconnected:', socket.id, '| userId:', socket.data.userId);
    });
});

const STALE_THRESHOLD_MS = 2 * 60 * 1000;
const CHECK_INTERVAL_MS = 60 * 1000;

setInterval(async () => {
    try {
        const cutoff = new Date(Date.now() - STALE_THRESHOLD_MS);
        const staleSessions = await Session.find({ status: 'ongoing', lastHeartbeatAt: { $lt: cutoff } });

        for (const sess of staleSessions) {
            console.log(`⏰ Auto-ending stale session: ${sess._id}`);
            try {
                const result = await endSessionAndBill(sess._id, { autoEnded: true });
                if (result) {
                    io.to(sess.userId.toString()).emit('session_ended', { sessionId: sess._id, reason: 'auto-stale', ...result });
                    io.to(sess.tantrikId.toString()).emit('session_ended', { sessionId: sess._id, reason: 'auto-stale', ...result });
                }
            } catch (e) { console.error('Auto-end failed:', e.message); }
        }
    } catch (e) { console.error('Auto-end interval error:', e.message); }
}, CHECK_INTERVAL_MS);

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // 👈 Yeh line lazmi add karein

server.listen(PORT, HOST, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});