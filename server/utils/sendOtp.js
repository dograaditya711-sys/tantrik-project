const nodemailer = require('nodemailer');
const axios = require('axios');

// Email Transporter Setup (Gmail ke liye)
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendOtp = async ({ email, phone, otp }) => {
    let emailSent = false;
    let smsSent = false;

    // ==========================================
    // 1. Email Bhejne ka Logic
    // ==========================================
    if (email) {
        try {
            const mailOptions = {
                from: `"TantraTalk Support" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Your OTP for Password Reset - TantraTalk',
                html: `
                    <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
                        <h2 style="color: #FFD700;">TantraTalk</h2>
                        <p>Aapka password reset karne ke liye OTP yeh hai:</p>
                        <h1 style="color: #D32F2F; letter-spacing: 5px;">${otp}</h1>
                        <p>Yeh OTP 10 minute tak valid hai. Kripya kisi ke saath share na karein.</p>
                    </div>
                `,
            };
            await transporter.sendMail(mailOptions);
            console.log(`✅ OTP Email sent to ${email}`);
            emailSent = true;
        } catch (error) {
            console.error('❌ Email sending failed:', error.message);
        }
    }

    // ==========================================
    // 2. SMS Bhejne ka Logic (Fast2SMS - Quick SMS)
    // ==========================================
    if (phone) {
        try {
            // Fast2SMS sirf 10 digit number leta hai (bina +91 ke)
            const cleanPhone = phone.replace('+91', '').trim();

            const response = await axios.get('https://www.fast2sms.com/dev/bulkV2', {
                params: {
                    authorization: process.env.FAST2SMS_API_KEY,
                    message: `Your TantraTalk OTP is ${otp}. Valid for 10 mins. Do not share.`,
                    language: 'english',
                    route: 'q', // 🎯 'q' matlab Quick SMS (Bina DLT ke testing ke liye)
                    numbers: cleanPhone
                }
            });

            if (response.data.return === true) {
                console.log(`✅ OTP SMS sent to ${cleanPhone}`);
                smsSent = true;
            } else {
                console.error('❌ Fast2SMS Error:', response.data.message || response.data);
            }
        } catch (error) {
            console.error('❌ SMS sending failed:', error.response?.data?.message || error.message);
        }
    }

    return { emailSent, smsSent };
};

module.exports = sendOtp;