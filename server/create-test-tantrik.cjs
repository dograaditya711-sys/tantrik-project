// create-test-tantrik.cjs — test ke liye ek tantrik account seed karta hai
// Server folder mein rakho (jahan .env hai).
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Tantrik = require('./models/Tantrik');

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected');

        const email = 'tantrik@test.com';

        // Purana delete karo agar hai (repeatable)
        const existing = await Tantrik.findOne({ email });
        if (existing) {
            await Tantrik.deleteOne({ email });
            console.log('🗑️  Purana account delete kiya');
        }

        const hashedPassword = await bcrypt.hash('pass1234', 10);

        const tantrik = await Tantrik.create({
            name: 'Test Tantrik',
            email,
            phone: '9999900000',
            password: hashedPassword,
            specializations: ['Astrology'],
            experience: 5,
            languages: ['Hindi'],
            pricePerMinute: 20,
            isVerified: true,
            isOnline: false,
            walletBalance: 0,
            rating: 5.0,
            totalReviews: 0,
            bankDetails: {
                accountName: 'Test Tantrik',
                accountNumber: '1234567890',
                ifscCode: 'TEST0001234',
                upiId: 'tantrik@test'
            }
        });

        console.log('\n✅ Test tantrik ready:');
        console.log('   Email:    tantrik@test.com');
        console.log('   Password: pass1234');
        console.log('   ID:      ', tantrik._id.toString());

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
})();