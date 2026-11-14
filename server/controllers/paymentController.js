const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const PaymentOrder = require('../models/PaymentOrder');

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error('❌ RAZORPAY_KEY_ID ya RAZORPAY_KEY_SECRET .env mein set nahi hai!');
}

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ==========================================
// 1. CREATE PAYMENT ORDER
// ==========================================
const createPaymentOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || amount < 10) {
            return res.status(400).json({ message: 'Minimum recharge amount is ₹10' });
        }

        const amountInPaise = Math.round(Number(amount) * 100);

        const options = {
            amount: amountInPaise,
            currency: 'INR',
            receipt: `receipt_${Date.now()}_${req.user._id.toString().slice(-6)}`
        };

        const razorpayOrder = await razorpay.orders.create(options);

        await PaymentOrder.create({
            userId: req.user._id,
            razorpayOrderId: razorpayOrder.id,
            amount: amountInPaise,
            status: 'created'
        });

        res.status(200).json({
            id: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency
        });
    } catch (error) {
        console.error('Payment Order Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 2. VERIFY PAYMENT
// ==========================================
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'Not authorized, please login again' });
        }

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: 'Missing payment fields' });
        }

        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: 'Payment verification failed' });
        }

        const paymentOrder = await PaymentOrder.findOne({
            razorpayOrderId: razorpay_order_id,
            userId: req.user._id
        });

        if (!paymentOrder) {
            return res.status(404).json({ message: 'Order not found. Please create a new order.' });
        }

        if (paymentOrder.status === 'paid') {
            const user = await User.findById(req.user._id);
            return res.status(200).json({
                message: 'Payment already verified',
                newBalance: user ? user.walletBalance / 100 : 0 // 🎯 H3 Fix: Rupees
            });
        }

        let rzpOrder;
        try {
            rzpOrder = await razorpay.orders.fetch(razorpay_order_id);
        } catch (err) {
            return res.status(400).json({ message: 'Could not verify payment with Razorpay' });
        }

        if (rzpOrder.amount !== paymentOrder.amount) {
            return res.status(400).json({ message: 'Amount mismatch' });
        }

        const updatedOrder = await PaymentOrder.findOneAndUpdate(
            { _id: paymentOrder._id, status: 'created' },
            { $set: { status: 'paid', razorpayPaymentId: razorpay_payment_id } },
            { returnDocument: 'after' }
        );

        if (!updatedOrder) {
            const user = await User.findById(req.user._id);
            return res.status(200).json({
                message: 'Payment already verified',
                newBalance: user ? user.walletBalance / 100 : 0
            });
        }

        // 🎯 H3 Fix: Credit amount paise mein hi hai
        const creditAmountInPaise = paymentOrder.amount; 

        try {
            const user = await User.findById(req.user._id);
            if (!user) throw new Error('User not found');

            user.walletBalance += creditAmountInPaise; // Paise mein add kiya
            await user.save();

            await Transaction.create({
                userId: user._id,
                amount: creditAmountInPaise, // 🎯 Paise mein save kiya
                type: 'recharge',
                status: 'success',
                description: `Wallet Recharge via Razorpay (ID: ${razorpay_payment_id})`
            });

            res.status(200).json({
                message: 'Payment verified & Wallet updated',
                newBalance: user.walletBalance / 100 // 🎯 Rupees return kiye
            });
        } catch (creditErr) {
            await PaymentOrder.updateOne(
                { _id: paymentOrder._id },
                { $set: { status: 'created' }, $unset: { razorpayPaymentId: 1 } }
            );
            throw creditErr;
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createPaymentOrder, verifyPayment };