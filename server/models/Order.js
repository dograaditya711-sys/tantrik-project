
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    
    // Shipping Details
    shippingAddress: {
        name: String,
        phone: String,
        addressLine: String,
        city: String,
        state: String,
        pincode: String
    },
    
    paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
    orderStatus: { type: String, enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Processing' },
    trackingId: { type: String } // Courier ka tracking ID
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

