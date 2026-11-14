const Withdrawal = require('../models/Withdrawal');
const Tantrik = require('../models/Tantrik');

const requestWithdrawal = async (req, res) => {
    try {
        const { amount } = req.body; 
        const tantrik = await Tantrik.findById(req.user._id);

        if (!tantrik) return res.status(404).json({ message: 'Tantrik not found' });

        const amountInPaise = Math.round(Number(amount) * 100); // 🎯 H3 Fix

        if (amountInPaise < 1000) {
            return res.status(400).json({ message: 'Minimum withdrawal amount is ₹10' });
        }

        if (tantrik.walletBalance < amountInPaise) {
            return res.status(400).json({ message: 'Insufficient wallet balance' });
        }

        if (!tantrik.bankDetails || !tantrik.bankDetails.accountNumber) {
            return res.status(400).json({ message: 'Please update your bank details first.' });
        }

        tantrik.walletBalance -= amountInPaise; // 🎯 Paise deduct
        await tantrik.save();

        const withdrawal = await Withdrawal.create({
            tantrikId: tantrik._id,
            amount: amountInPaise, // 🎯 Paise save
            accountName: tantrik.bankDetails.accountName,
            accountNumber: tantrik.bankDetails.accountNumber,
            ifscCode: tantrik.bankDetails.ifscCode,
            upiId: tantrik.bankDetails.upiId || '',
            status: 'Pending'
        });

        res.status(201).json({ 
            message: 'Withdrawal request submitted successfully!', 
            withdrawal: { ...withdrawal._doc, amount: withdrawal.amount / 100 },
            newBalance: tantrik.walletBalance / 100 // 🎯 Rupees bheje
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyWithdrawals = async (req, res) => {
    try {
        const withdrawals = await Withdrawal.find({ tantrikId: req.user._id }).sort({ createdAt: -1 });
        const formatted = withdrawals.map(w => ({ ...w._doc, amount: w.amount / 100 }));
        res.status(200).json(formatted);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllWithdrawalsAdmin = async (req, res) => {
    try {
        const withdrawals = await Withdrawal.find({})
            .populate('tantrikId', 'name email phone')
            .sort({ createdAt: -1 });
        
        const formatted = withdrawals.map(w => {
            const wObj = w.toObject();
            wObj.amount = wObj.amount / 100; // 🎯 H3 Fix
            return wObj;
        });
        res.status(200).json(formatted);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateWithdrawalStatus = async (req, res) => {
    try {
        const { status, transactionReference } = req.body;
        const withdrawal = await Withdrawal.findById(req.params.id);

        if (!withdrawal) return res.status(404).json({ message: 'Withdrawal not found' });
        if (withdrawal.status !== 'Pending') return res.status(400).json({ message: 'Already processed' });

        withdrawal.status = status;
        if (transactionReference) withdrawal.transactionReference = transactionReference;

        if (status === 'Rejected') {
            const tantrik = await Tantrik.findById(withdrawal.tantrikId);
            if (tantrik) {
                tantrik.walletBalance += withdrawal.amount; // 🎯 Paise wapas add
                await tantrik.save();
            }
        }

        await withdrawal.save();
        res.status(200).json({ 
            message: `Request ${status}`, 
            withdrawal: { ...withdrawal._doc, amount: withdrawal.amount / 100 } 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { requestWithdrawal, getMyWithdrawals, getAllWithdrawalsAdmin, updateWithdrawalStatus };