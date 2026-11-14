const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const multer = require('multer');
const { storage } = require('../config/cloudinary'); // 🎯 Cloudinary Storage

// 🎯 Multer setup for image uploads
const upload = multer({ storage: storage });

// 🎯 H5 Fix: Joi Validation Middleware & Schemas
const validate = require('../middlewares/validate');
const { 
    registerSchema, 
    loginSchema, 
    forgotPasswordSchema, 
    resetPasswordSchema, 
    createOrderSchema, 
    verifyPaymentSchema, 
    startSessionSchema 
} = require('../validators/schemas');

// Controllers Import
const { generateCallToken } = require('../controllers/callController');
const { generateKundli } = require('../controllers/kundliController');
const { authTantrik, getTantrikProfile, toggleOnlineStatus, updateTantrikSettings } = require('../controllers/tantrikController');
const { registerUser, loginUser, forgotPassword, resetPassword, getUserProfile, updateUserProfile } = require('../controllers/userController');
const { getMyTransactions } = require('../controllers/walletController');
const { startSession, endSession, getSessionMessages, getMySessions } = require('../controllers/sessionController');
const { addReview, getTantrikReviews } = require('../controllers/reviewController');
const { placeOrder, getMyOrders } = require('../controllers/orderController');
const { bookPooja, getMyBookings, getAllPoojas } = require('../controllers/poojaController');
const { requestWithdrawal, getMyWithdrawals } = require('../controllers/withdrawalController');
const { createPaymentOrder, verifyPayment } = require('../controllers/paymentController');
const { addBlog, getAllBlogs, getBlogById } = require('../controllers/contentController');
const { deleteMyAccount } = require('../controllers/userController');
// Models Import
const Tantrik = require('../models/Tantrik');
const Product = require('../models/Product');

const User = require('../models/User');
// ==========================================
// --- PUBLIC ROUTES (No Login Required) ---
// ==========================================
router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.post('/tantrik-login', authTantrik);
router.delete('/delete-account', protect, deleteMyAccount);
router.get('/reviews/:tantrikId', getTantrikReviews);
router.get('/poojas', getAllPoojas);
router.post('/generate-kundli', generateKundli);
router.get('/blogs', getAllBlogs);
router.get('/blogs/:id', getBlogById);

// Tantrik list aur details
router.get('/tantriks', async (req, res) => {
    try {
        const tantriks = await Tantrik.find({ isVerified: true }).select('-password');
        res.status(200).json(tantriks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.post('/save-fcm-token', protect, async (req, res) => {
    try {
        const { token } = req.body;
        await User.findByIdAndUpdate(req.user._id, { fcmToken: token });
        res.json({ message: 'Token saved successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get('/tantrik/:id', async (req, res) => {
    try {
        const tantrik = await Tantrik.findById(req.params.id).select('-password');
        if (!tantrik) {
            return res.status(404).json({ message: 'Tantrik not found' });
        }
        res.status(200).json(tantrik);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Products list
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find({ isActive: true });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ==========================================
// --- PROTECTED ROUTES (Login Required) ---
// ==========================================
router.use(protect);

// Payment Routes
router.post('/create-payment-order', validate(createOrderSchema), createPaymentOrder);
router.post('/verify-payment', validate(verifyPaymentSchema), verifyPayment);
router.post('/generate-call-token', generateCallToken);

// Settings & Profile (🎯 Added upload.single for images)
router.put('/tantrik-settings', upload.single('profileImage'), updateTantrikSettings);
router.route('/profile').get(getUserProfile).put(upload.single('profileImage'), updateUserProfile);

// Withdrawal Routes
router.post('/request-withdrawal', requestWithdrawal);
router.get('/my-withdrawals', getMyWithdrawals);

// Wallet 
router.get('/wallet/transactions', getMyTransactions);

// Session & History
router.post('/session/start', validate(startSessionSchema), startSession);
router.put('/session/end/:id', endSession);
router.get('/session/:id/messages', getSessionMessages); 
router.get('/my-sessions', getMySessions);

// Pooja Routes
router.post('/book-pooja', bookPooja);
router.get('/my-poojas', getMyBookings);

// Tantrik Dashboard Routes
router.get('/tantrik-profile', getTantrikProfile);
router.put('/tantrik-online-status', toggleOnlineStatus);

// Reviews & Orders
router.post('/review', addReview);
router.post('/order', placeOrder);
router.get('/my-orders', getMyOrders);

module.exports = router;