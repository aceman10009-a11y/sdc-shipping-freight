const express = require("express");
const { Resend } = require("resend");

const router = express.Router();

const resend = new Resend(process.env.RESEND_API_KEY);
console.log("RESEND KEY LOADED:", !!process.env.RESEND_API_KEY);


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

        await resend.emails.send({

            from: "SDC Shipping Freight <contact@sdcshippingfreight.com>",

            to: [
                "contact@sdcshippingfreight.com"
            ],

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


    } catch (error) {

        console.error("Resend Error:", error.response?.data || error);


        return res.status(500).json({

            success: false,

            message: "Failed to send email."

        });

    }

});


module.exports = router;