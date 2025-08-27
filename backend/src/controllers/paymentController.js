import Stripe from "stripe";
import dotenv from "dotenv";
import Auction from "../models/auctionModel.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const Checkout = async (req, res) => {
  try {
    const { auction_id, user_id, auctioner_id } = req.body;

    // const auction = await Auction.findById(auction_id);
    // if (!auction) return res.status(404).json({ error: "Auction not found" });
    const auction = {
      "name":"phone",
      "cost":50000

    }

    const lineItems = [
      {
        price_data: {
          currency: "inr",
          product_data: { name: auction.name },
          unit_amount: auction.cost * 0.1,
        },
        quantity: 1,
      },
    ];

    // Single callback URL
    const baseUrl = "http://localhost:5173/payment-callback";
    const successUrl = `${baseUrl}?auction_id=${auction_id}&auctioner_id=${auctioner_id}&user_id=${user_id}&status=success`;
    const cancelUrl = `${baseUrl}?auction_id=${auction_id}&auctioner_id=${auctioner_id}&user_id=${user_id}&status=canceled`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: [
    "card",       // Credit/Debit cards
    "paynow",     // Alipay (QR code in some regions)

  ],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { user_id, auction_id, auctioner_id },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
