require('dotenv').config();
const nodemailer = require("nodemailer");

const sendEmail = async (req, res) => {
    try {
        //const { to, subject, message } = req.body;
        const to = "letuananh03262@gmail.com"; 
        const subject = "Test Email from Node";
        const message = "Hello, this is a test email without req.body!";

        // Tạo transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.Email_PASSWORD,
            }
        });

        // Nội dung gửi
        const mailOptions = {
            from: process.env.MAIL_USER,
            to: to,
            subject: subject,
            html: `<div>${message}</div>`
        };

        await transporter.sendMail(mailOptions);

        return res.json({
            status: true,
            message: "Email sent successfully!"
        });
    } catch (error) {
        console.log(error);
        return res.json({
            status: false,
            error: error.message
        });
    }
};

module.exports = { sendEmail };
