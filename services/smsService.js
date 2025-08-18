const axios = require('axios');
const nodemailer = require('nodemailer');
require('dotenv').config();



class SmsService {
    async sendSms(phone, otp) {
        const baseUrl = 'https://sms.mobi-marketing.biz/api/mt/SendSMS';
        const params = {
            user: 'NIMI',
            password: 'abcd4321D',
            senderid: 'NIMIAP',
            channel: 'Trans',
            DCS: 0,
            flashsms: 0,
            number: phone,
            text: `Your OTP is ${otp} for reference number ${phone} - NIMI`,
            route: 1
        };
        try {
            const response = await axios.get(baseUrl, { params });
            console.log('SMS API response:', response.data);
            return response.data;
        } catch (error) {
            console.error('SMS API error:', error.message);
            throw error;
        }
    }
}

module.exports = new SmsService();
