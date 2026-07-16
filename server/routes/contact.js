const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify SMTP connection when the server starts
transporter.verify((error) => {
    if (error) {
        console.error("SMTP Error:", error);
    } else {
        console.log("✅ SMTP Ready");
    }
});

router.post("/", async (req, res) => {

    const name = req.body.name?.trim();
    const email = req.body.email?.trim();
    const message = req.body.message?.trim();

    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        });
    }

    try {

        await transporter.sendMail({
            from: `"SDC Shipping Freight" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `New Contact Form Message from ${name}`,
            html: `
                <h2>New Contact Request</h2>

                <p><strong>Name:</strong> ${name}</p>

                <p><strong>Email:</strong> ${email}</p>

                <p><strong>Message:</strong></p>

                <p>${message}</p>
            `
        });

        return res.status(200).json({
            success: true,
            message: "Email sent successfully."
        });

    } catch (err) {

        console.error("Email Error:", err);

        return res.status(500).json({
            success: false,
            message: "Failed to send email."
        });
    }

});

module.exports = router;