// const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

// const generateCallToken = async (req, res) => {
//     try {
//         const { channelName } = req.body;

//         if (!channelName) {
//             return res.status(400).json({ message: 'Channel name is required' });
//         }

//         // 🎯 Yahan apni Keys Paste Karein
//         const appID = "abf96e32b79a4329b420627c6fb0ce51"; 
//         const appCertificate = "ddaa51c142e844a596901627d8d120aa";

//         const uid = Math.floor(Math.random() * 100000); 
//         const role = RtcRole.PUBLISHER; 
//         const expirationTimeInSeconds = 3600; 
//         const currentTimestamp = Math.floor(Date.now() / 1000);
//         const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

//         const token = RtcTokenBuilder.buildTokenWithUid(
//             appID, appCertificate, channelName, uid, role, privilegeExpiredTs
//         );

//         res.status(200).json({ token, uid, appID });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// module.exports = { generateCallToken };

const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

// 🎯 SECURITY FIX (C3): Agora keys .env se
if (!process.env.AGORA_APP_ID || !process.env.AGORA_APP_CERTIFICATE) {
    console.error('❌ AGORA_APP_ID ya AGORA_APP_CERTIFICATE .env mein set nahi hai!');
}

// @desc    Generate Agora RTC Token for a Call
// @route   POST /api/users/generate-call-token
const generateCallToken = async (req, res) => {
    try {
        const { channelName } = req.body;

        if (!channelName) {
            return res.status(400).json({ message: 'Channel name is required' });
        }

        const appID = process.env.AGORA_APP_ID;
        const appCertificate = process.env.AGORA_APP_CERTIFICATE;

        const uid = Math.floor(Math.random() * 100000);
        const role = RtcRole.PUBLISHER;
        const expirationTimeInSeconds = 3600; // 1 ghanta
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

        const token = RtcTokenBuilder.buildTokenWithUid(
            appID, appCertificate, channelName, uid, role, privilegeExpiredTs
        );

        res.status(200).json({ token, uid, appID });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { generateCallToken };