// utils/email.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USERNAME, 
        pass: process.env.EMAIL_PASSWORD, 
    },
});

async function sendEmail(to, subject, htmlContent) {
    try {
        const info = await transporter.sendMail({
            from: `"Salon App" <${process.env.EMAIL_USERNAME}>`,
            to: to,
            subject: subject,
            html: htmlContent,
        });

        console.log("Email sent:", info.messageId);
        return true;
    } catch (err) {
        console.error("Email error:", err);
        return false;
    }
}

module.exports = { sendEmail };
