import express from "express";
import cors from "cors";
import stripePackage from "stripe";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import axios from "axios";
dotenv.config();
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);
const app = express();
app.use(express.json());
app.use(cors());
app.post("/create-payment-intent", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 5000,
      currency: "usd",
      payment_method_types: ["card"],
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
app.post("/send-email", async (req, res) => {
  const { name, email, phone, contactMethod, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.ESKAN_EMAIL,
      pass: process.env.ESKAN_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.ESKAN_EMAIL,
    to: process.env.ESKAN_EMAIL,
    subject: `New Contact Message from ${name}`,
    text: `You have received a new message from:
      
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Preferred Contact Method: ${contactMethod}
      
      Message:
      ${message}`,
    replyTo: email,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email." });
  }
});
app.post("/verify-turnstile", async (req, res) => {
  const turnstileToken = req.body.turnstileToken;

  if (!turnstileToken) {
    return res.status(400).json({ error: "Turnstile token is required" });
  }

  try {
    const response = await axios.post(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: turnstileToken,
        remoteip: req.ip,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response.data.success) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({
        error: "Turnstile verification failed",
        details: response.data["error-codes"],
      });
    }
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return res.status(500).json({ error: "Failed to verify Turnstile token" });
  }
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
