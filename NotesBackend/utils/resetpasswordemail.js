require('dotenv').config();
const nodemailer = require('nodemailer');
const { OtpContent } = require('../utils/EmailTemplates')

const resetPasswordEmail = async (receipentEmail, otpcode) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        }
    });

    const emailcontent = OtpContent(otpcode);
    await transporter.sendMail({
        from: process.env.EMAIL,
        to: receipentEmail,
        subject: 'Reset Password',
        html: emailcontent
    });
}

module.exports = {
    resetPasswordEmail
}