// check-payment-order.cjs — PaymentOrder DB record inspect karo
require('dotenv').config();
const mongoose = require('mongoose');
const PaymentOrder = require('./models/PaymentOrder');

const ORDER_ID = process.argv[2]; // command line argument

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB\n');

        if (!ORDER_ID) {
            // Saare recent orders dikhao
            const orders = await PaymentOrder.find({}).sort({ createdAt: -1 }).limit(5);
            console.log(`Last ${orders.length} payment orders:\n`);
            orders.forEach(o => {
                console.log(`  Razorpay:  ${o.razorpayOrderId}`);
                console.log(`  Amount:    ${o.amount} paise (₹${o.amount / 100})`);
                console.log(`  Status:    ${o.status}`);
                console.log(`  PaymentId: ${o.razorpayPaymentId || '(not paid yet)'}`);
                console.log(`  UserId:    ${o.userId}`);
                console.log(`  Created:   ${o.createdAt}`);
                console.log('');
            });
        } else {
            // Specific order dikhao
            const order = await PaymentOrder.findOne({ razorpayOrderId: ORDER_ID });
            if (!order) {
                console.log('❌ Order not found:', ORDER_ID);
            } else {
                console.log('Order found:');
                console.log(JSON.stringify(order.toObject(), null, 2));
            }
        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
})();