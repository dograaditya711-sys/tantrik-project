require('dotenv').config();
const mongoose = require('mongoose');

const User = require('./models/User');
const Tantrik = require('./models/Tantrik');
const Session = require('./models/Session');
const Transaction = require('./models/Transaction');
const Product = require('./models/Product');
const PoojaService = require('./models/PoojaService');
const PoojaBooking = require('./models/PoojaBooking');
const Order = require('./models/Order');
const Withdrawal = require('./models/Withdrawal');

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Helper function: sirf unhe update karega jinki value < 1000 hai (taaki double *100 na ho)
        const migrate = async (Model, field, filter = {}) => {
            const docs = await Model.find(filter);
            let count = 0;
            for (let doc of docs) {
                if (doc[field] !== undefined && doc[field] !== null && doc[field] < 1000) {
                    doc[field] = Math.round(doc[field] * 100);
                    await doc.save();
                    count++;
                }
            }
            console.log(`✅ ${Model.modelName} - ${field} migrated: ${count} records`);
        };

        await migrate(User, 'walletBalance');
        await migrate(Tantrik, 'walletBalance');
        await migrate(Tantrik, 'pricePerMinute');
        await migrate(Session, 'totalCost');
        await migrate(Transaction, 'amount');
        await migrate(Product, 'price');
        await migrate(PoojaService, 'price');
        await migrate(PoojaBooking, 'amountPaid');
        await migrate(Order, 'totalAmount');
        await migrate(Withdrawal, 'amount');

        console.log('\n🎉 Migration Complete! Ab sab kuch paise (integer) mein hai.');
        mongoose.disconnect();
    } catch (err) {
        console.error('❌ Error:', err);
        mongoose.disconnect();
    }
})();