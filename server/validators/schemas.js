const Joi = require('joi');

// ==========================================
// 👤 USER SCHEMAS
// ==========================================
const registerSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().length(10).pattern(/^[0-9]+$/).required() // 10 digit
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required()
});

const resetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
    newPassword: Joi.string().min(6).required()
});

// ==========================================
// 👑 ADMIN SCHEMAS
// ==========================================
const addTantrikSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    password: Joi.string().min(6).required(),
    specializations: Joi.array().items(Joi.string()).min(1).required(),
    experience: Joi.number().min(0).required(),
    languages: Joi.array().items(Joi.string()).min(1).required(),
    pricePerMinute: Joi.number().min(1).required()
});

const addPoojaSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().min(1).required()
});

const addProductSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().min(1).required(),
    category: Joi.string().required(),
    stock: Joi.number().min(0).required()
});

const addBlogSchema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    tags: Joi.string().allow('') // Optional, comma separated string
});

// ==========================================
// 💰 PAYMENT & SESSION SCHEMAS
// ==========================================
const createOrderSchema = Joi.object({
    amount: Joi.number().min(10).required()
});

const verifyPaymentSchema = Joi.object({
    razorpay_order_id: Joi.string().required(),
    razorpay_payment_id: Joi.string().required(),
    razorpay_signature: Joi.string().required(),
    // amount: Joi.number() // Hata diya kyunki server ab body.amount trust nahi karta
});

const startSessionSchema = Joi.object({
    tantrikId: Joi.string().hex().length(24).required(), // Valid MongoDB ID
    type: Joi.string().valid('chat', 'call').required()
});

module.exports = {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    addTantrikSchema,
    addPoojaSchema,
    addProductSchema,
    addBlogSchema,
    createOrderSchema,
    verifyPaymentSchema,
    startSessionSchema
};