
const otpStore = {};
const User = require('../models/User');
const Captcha = require('../models/Captcha');
const emailService = require('../services/emailService');
const smsService = require('../services/smsService');

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}


// POST /loginwithotp
exports.loginWithOtp = async (req, res) => {
    const { phone, email } = req.body;
    const identifier = phone || email;
    if (!identifier) {
        return res.status(400).json({ message: 'Phone or email required.' });
    }
    let user;
    try {
        user = await User.findOne({ email, phone });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const otp = generateOTP();
        const { pool } = require('../config/database');
        await pool.execute(
            'UPDATE users SET reset_token = ? WHERE email = ? OR phone_no = ?',
            [otp, email || null, phone || null]
        );
        if (email) {
            await emailService.sendEmail(email, 'Your OTP', `Your OTP is ${otp}`);
        }
        if (phone) {
            // Assuming you have a function to send SMS
            await smsService.sendSms(phone, `Your OTP is ${otp}`);
        }
        res.json({ message: 'OTP sent.' });
    } catch (err) {
        console.error('Error in loginWithOtp:', err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

// POST /verifylogin
exports.verifyLogin = async (req, res) => {
    const { phone, email, otp } = req.body;
    const identifier = phone || email;
    if (!identifier || !otp) {
        return res.status(400).json({ message: 'Phone/email and OTP required.' });
    }
    const { pool } = require('../config/database');
    const [rows] = await pool.execute(
        'SELECT reset_token FROM users WHERE email = ? OR phone_no = ?',
        [email || null, phone || null]
    );
    if (rows.length > 0 && rows[0].reset_token === otp) {
        await pool.execute(
            'UPDATE users SET reset_token = NULL WHERE email = ? OR phone_no = ?',
            [email || null, phone || null]
        );
        res.json({ message: 'Login successful.' });
    } else {
        res.status(401).json({ message: 'Invalid OTP.' });
    }
};