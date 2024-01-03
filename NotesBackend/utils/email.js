const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
require('dotenv').config();
const { gmailContent } = require('./EmailTemplates')
const secret_key = process.env.ACCESS_TOKEN_SECRET;



const generateverificationToken = (email) => {
    console.log(secret_key)
    return jwt.sign({ email: email }, secret_key, { expiresIn: '1d' })
}


const sendVerificationEmail = async (recipientEmail, verificationToken) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            }

        })

        const emailcontent = gmailContent(verificationToken);
        console.log(process.env.EMAIL + "email this is")

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: recipientEmail,
            subject: 'Email Verification',
            html: emailcontent
        })

        console.log("Verification email has been sent");

    } catch (error) {
        console.error('Error sending verification email:', error);
    }
}

const generateOTP = () => {
    const otpLength = 6;
    const characters = '0123456789';
    let otpcode = '';
    for (let i = 0; i < otpLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        otpcode += characters[randomIndex];
    }
    return otpcode;
}

module.exports = {
    generateverificationToken,
    sendVerificationEmail,
    generateOTP
}