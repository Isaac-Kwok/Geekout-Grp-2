//import emailjs
const email = require('nodemailer');
require('dotenv').config();

const emailSender = email.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PWD,
    },
});

exports.emailSender = emailSender;