const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
    tantrikId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tantrik', required: true },
    amount: { type: Number, required: true },
    
    // Bank Details
    accountName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true },
    upiId: { type: String },
    
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    transactionReference: { type: String } // Admin jab paise bhej de tab UTR number
}, { timestamps: true });

module.exports = mongoose.model('Withdrawal', withdrawalSchema);