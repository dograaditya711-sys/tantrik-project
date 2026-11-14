const Transaction = require('../models/Transaction');

// 🎯 SECURITY FIX (C1):
// Purana rechargeWallet() hata diya gaya hai.
// Free wallet credit ka route seedha paise ka fraud tha — koi bhi logged-in
// user API call karke unlimited balance bana sakta tha. Ab wallet balance
// SIRF Razorpay verify hone ke baad badhega (paymentController.verifyPayment).
// Agar kabhi manual/admin credit chahiye to alag admin-only route banayenge
// (audit log ke sath), public route ke roop mein nahi.

// @desc    Get My Transactions
// @route   GET /api/users/wallet/transactions
const getMyTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMyTransactions };