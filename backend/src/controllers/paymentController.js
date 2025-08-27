import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const Checkout = async (req, res) => {
  try {
    const { auction_id, user_id, auctioner_id, cost, title } = req.body;
    console.log("Received cost for Stripe:", cost);
    console.log("Incoming checkout request:", req.body);

    const registrationFee = Number(cost); // this is already 10% fee sent from frontend
    if (isNaN(registrationFee)) {
      return res.status(400).json({ error: "Invalid cost provided" });
    }

    const lineItems = [
      {
        price_data: {
          currency: "inr",
          product_data: { name: title || "Auction Registration" },
          unit_amount: registrationFee * 100, // convert ₹ → paise
        },
        quantity: 1,
      },
    ];

    const baseUrl = "http://localhost:5173/payment-callback";
    const successUrl = `${baseUrl}?auction_id=${auction_id}&auctioner_id=${auctioner_id}&user_id=${user_id}&status=success`;
    const cancelUrl = `${baseUrl}?auction_id=${auction_id}&auctioner_id=${auctioner_id}&user_id=${user_id}&status=failed`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { user_id, auction_id, auctioner_id },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Checkout Error:", err);
    res.status(500).json({ error: err.message });
  }
};

