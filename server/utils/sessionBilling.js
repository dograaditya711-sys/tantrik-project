const Session = require('../models/Session');
const User = require('../models/User');
const Tantrik = require('../models/Tantrik');
const Transaction = require('../models/Transaction');

/**
 * 🎯 FIX #6: Session end + billing (shared logic)
 *
 * Manual end (endSession API) aur auto-end (interval) dono yahan se guzarte hain.
 * Ek jagah billing logic = consistent behavior, no duplication.
 *
 * Atomic gate: sirf ek call 'ongoing' → 'completed' transition kar sakta hai.
 * Concurrent calls duplicate billing nahi karenge (race-safe).
 *
 * @param {string} sessionId
 * @param {object} opts
 *   - autoEnded: true  → endTime = lastHeartbeatAt (fair, inactivity ke baad)
 *                false → endTime = now (manual "End Chat" click)
 * @returns {object|null} billing result ya null agar already ended
 */
async function endSessionAndBill(sessionId, { autoEnded = false } = {}) {
    // 🎯 Atomic gate — sirf woh request jeetegi jo 'ongoing' → 'completed' kar paye
     const session = await Session.findOneAndUpdate(
        { _id: sessionId, status: 'ongoing' },
        { $set: { status: 'completed', autoEnded } },
        { returnDocument: 'before' } // purana doc return — startTime/lastHeartbeatAt padhne ke liye
    );

    if (!session) return null; // koi aur call pehle end kar chuka

    const tantrik = await Tantrik.findById(session.tantrikId);
    const user = await User.findById(session.userId);

    if (!tantrik || !user) {
        // Data corrupt — rollback, session wapas 'ongoing' kar do
        await Session.updateOne(
            { _id: sessionId },
            { $set: { status: 'ongoing' }, $unset: { autoEnded: 1 } }
        );
        return null;
    }

    // End time: auto-end mein lastHeartbeatAt (fair billing), manual mein now
    const actualEndTime = autoEnded
        ? (session.lastHeartbeatAt || new Date())
        : new Date();

    let durationMs = actualEndTime - session.startTime;
    let durationMins = Math.ceil(durationMs / 1000 / 60);
    if (durationMins < 1) durationMins = 1;

    let totalCost = durationMins * tantrik.pricePerMinute;
    const adminCommission = totalCost * 0.30;
    let tantrikEarnings = totalCost - adminCommission;

    // Balance cap — user ke paas jitna hai usse zyada cut nahi
    if (user.walletBalance < totalCost) {
        totalCost = user.walletBalance;
        tantrikEarnings = totalCost * 0.70;
        user.walletBalance = 0;
    } else {
        user.walletBalance -= totalCost;
    }
    tantrik.walletBalance += tantrikEarnings;

    // Session billing fields update
    await Session.updateOne(
        { _id: sessionId },
        {
            $set: {
                endTime: actualEndTime,
                durationInMinutes: durationMins,
                totalCost
            }
        }
    );

    await user.save();
    await tantrik.save();

    if (totalCost > 0) {
        await Transaction.create({
            userId: user._id,
            amount: totalCost,
            type: 'deduction',
            status: 'success',
            description: `Chat with ${tantrik.name} for ${durationMins} mins${autoEnded ? ' (auto-ended)' : ''}`
        });
    }

    return {
        duration: durationMins,
        totalDeducted: totalCost,
        remainingBalance: user.walletBalance,
        autoEnded
    };
}

module.exports = { endSessionAndBill };