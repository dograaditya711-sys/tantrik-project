const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect, admin } = require('../middlewares/authMiddleware');

// 🎯 H5 Fix: Joi Validation Middleware & Schemas
const validate = require('../middlewares/validate');
const { 
    addTantrikSchema, 
    addPoojaSchema, 
    addProductSchema, 
    addBlogSchema 
} = require('../validators/schemas');

// 🎯 H4 Fix: Cloudinary Storage Setup
const { storage } = require('../config/cloudinary');
const upload = multer({ storage: storage });

// Controllers Import
const { getAllWithdrawalsAdmin, updateWithdrawalStatus } = require('../controllers/withdrawalController');
const { 
    addTantrik, 
    getAllTantriks, 
    getTantrikById, 
    updateTantrik, 
    deleteTantrik,
    getAdminStats,      
    getAllUsersAdmin,   
    toggleBlockUser,
    addPooja,           
    getAllPoojas,       
    getAllPoojaBookings, 
    updatePoojaBookingStatus 
} = require('../controllers/adminController');

const { addProduct, getAllProducts, updateProduct, deleteProduct } = require('../controllers/productController');
const { addBlog, getAllBlogs, addCategory, getAllCategories, addCoupon, getAllCoupons } = require('../controllers/contentController');

// Sabhi routes admin protected hain
router.use(protect, admin);

// ==========================================
// --- STATS & USER MANAGEMENT ROUTES ---
// ==========================================
router.get('/stats', getAdminStats);
router.get('/users', getAllUsersAdmin);
router.put('/users/:id/block', toggleBlockUser);

// Withdrawal Routes
router.get('/withdrawals', getAllWithdrawalsAdmin);
router.put('/withdrawals/:id', updateWithdrawalStatus);

// ==========================================
// --- TANTRIK ROUTES ---
// ==========================================
router.route('/tantrik').post(validate(addTantrikSchema), addTantrik).get(getAllTantriks);
router.route('/tantrik/:id').get(getTantrikById).put(updateTantrik).delete(deleteTantrik);

// ==========================================
// --- POOJA & BOOKINGS ROUTES ---
// ==========================================
router.route('/poojas').post(upload.single('image'), validate(addPoojaSchema), addPooja).get(getAllPoojas);
router.get('/pooja-bookings', getAllPoojaBookings);
router.put('/pooja-bookings/:id', updatePoojaBookingStatus);

// ==========================================
// --- PRODUCT ROUTES (Shop) ---
// ==========================================
router.route('/products').post(upload.single('image'), validate(addProductSchema), addProduct).get(getAllProducts);
router.route('/products/:id').put(updateProduct).delete(deleteProduct);

// ==========================================
// --- CONTENT (BLOG, CATEGORY, COUPON) ROUTES ---
// ==========================================
router.route('/blogs').post(upload.single('image'), validate(addBlogSchema), addBlog).get(getAllBlogs);
router.route('/categories').post(addCategory).get(getAllCategories);
router.route('/coupons').post(addCoupon).get(getAllCoupons);

module.exports = router;