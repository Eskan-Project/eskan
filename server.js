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
// Add this new endpoint for sending rejection emails
app.post("/send-rejection-email", async (req, res) => {
  const {
    to_name,
    property_title,
    rejection_reason,
    owner_email,
    property_address,
  } = req.body;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "eskan3040@gmail.com",
      pass: "nhbtdpgwsodeipcd",
    },
  });

  const mailOptions = {
    from: "eskan3040@gmail.com",
    to: owner_email,
    subject: `Property Request Rejected: ${property_title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #e53e3e;">Property Request Rejected</h2>
        <p>Hello ${to_name},</p>
        <p>We regret to inform you that your property request for <strong>${property_title}</strong> at <em>${property_address}</em> has been rejected.</p>
        <div style="background-color: #f7fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Reason for rejection:</strong></p>
          <p>${rejection_reason}</p>
        </div>
        <p>If you have any questions or would like to submit a revised request, please contact our support team.</p>
        <p>Best regards,<br>ESKAN Project Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Rejection email sent successfully!" });
  } catch (error) {
    console.error("Error sending rejection email:", error);
    res.status(500).json({ error: "Failed to send rejection email." });
  }
});

// Add this new endpoint for sending welcome emails with credentials
app.post("/send-welcome-email", async (req, res) => {
  const { to_name, user_email, user_password, user_role, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "eskan3040@gmail.com",
      pass: "nhbtdpgwsodeipcd",
    },
  });

  const mailOptions = {
    from: "eskan3040@gmail.com",
    to: user_email,
    subject: `Welcome to ESKAN - Your Account Details`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #4a5568;">Welcome to ESKAN</h2>
        <p>Hello ${to_name},</p>
        <p>Your account has been created successfully as a ${user_role}. Here are your login credentials:</p>
        <div style="background-color: #f7fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Email:</strong> ${user_email}</p>
          <p><strong>Password:</strong> ${user_password}</p>
        </div>
        <p>Please login and change your password as soon as possible for security reasons.</p>
        ${message ? `<p>${message}</p>` : ""}
        <p>Best regards,<br>ESKAN Project Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Welcome email sent successfully!" });
  } catch (error) {
    console.error("Error sending welcome email:", error);
    res.status(500).json({ error: "Failed to send welcome email." });
  }
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
