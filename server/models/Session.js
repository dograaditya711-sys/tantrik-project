const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tantrikId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tantrik', required: true },

    type: { type: String, enum: ['chat', 'call'], required: true },
    status: { type: String, enum: ['ongoing', 'completed', 'missed'], default: 'ongoing' },

    startTime: { type: Date, default: Date.now },
    endTime: { type: Date },
    durationInMinutes: { type: Number, default: 0 },

    totalCost: { type: Number, default: 0 },

    // 🎯 FIX #6: Heartbeat tracking
    // Client har 30 sec `heartbeat` emit karta hai — yahan timestamp update.
    // 2 min tak update na ho → server auto-end + billing karta hai.
    // Index zaroori — auto-end interval is field pe query karta hai har 60 sec.
    lastHeartbeatAt: { type: Date, default: Date.now, index: true },

    // 🎯 FIX #6: Auto-end vs manual end distinguish karne ke liye
    // true = server ne inactivity pe end kiya, billing lastHeartbeatAt tak
    // false = user/tantrik ne manually "End Chat" click kiya, billing now tak
    autoEnded: { type: Boolean, default: false },

    // Agar chat hai toh messages yahan save honge
 chatMessages: [{
        sender: { type: String, enum: ['user', 'tantrik', 'system'] }, // 🎯 'system' add karein
        message: { type: String },
        timestamp: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);