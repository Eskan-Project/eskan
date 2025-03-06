import express from "express";
import cors from "cors";
import stripePackage from "stripe";
import dotenv from "dotenv";
dotenv.config();
console.log("Stripe Key:", process.env.STRIPE_SECRET_KEY);
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
const PORT = 3001;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
