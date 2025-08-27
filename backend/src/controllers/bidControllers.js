// controllers/bidController.js
import Auction from "../models/auctionModel.js"
import Bid from "../models/bidModel.js";
import AuctionerKey from "../models/auctionerKeyModel.js";

import { DecryptBid } from "../services/encryption.js";
// TO store thr encrypted amount in the mongo db
export const placeBid = async (req, res) => {
  try {
    const { auctionId, userId, amount} = req.body;

    // Validate input
    if (!auctionId || !userId || !amount) {
      return res.status(400).json({
        error: "auctionId, userId, encryptedAmount are required",
      });
    }

    // Find the auction
    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return res.status(404).json({ error: "Auction not found" });
    }

    // Check auction timing
    const now = new Date();
    if (now < auction.startDateTime) {
      return res.status(400).json({ error: "Auction has not started yet" });
    }
    if (now > auction.endDateTime) {
      return res.status(400).json({ error: "Auction has already ended" });
    }

    // Store ciphertext + IV (not plaintext)
    const bid = new Bid({
      auctionId,
      userId,
      amount, // ciphertext from frontend
    });

    await bid.save();

    return res
      .status(201)
      .json({ message: "Sealed bid placed successfully", bid });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Get all bids placed in a auction
export const getBidsByAuction = async (req, res) => {
  try {
    const { auctionId } = req.params;

    if (!auctionId) {
      return res.status(400).json({ error: "auctionId is required" });
    }

    // Step 1: Get all bids (only userId + encrypted amount)
    const bids = await Bid.find({ auctionId }).select("userId amount -_id");

    // Step 2: For each bid, fetch the key & decrypt amount
    const results = await Promise.all(
      bids.map(async (bid) => {
        const { userId, amount: encryptedAmount } = bid;

        // Fetch key from AuctionerKey collection
        const auctionerKey = await AuctionerKey.findOne({ auctionId, userId });

        let decryptedAmount = null;
        if (auctionerKey) {
          try {
            decryptedAmount = DecryptBid(auctionerKey.key, encryptedAmount);
          } catch (err) {
            console.error(`Failed to decrypt for user ${userId}:`, err.message);
          }
        }

        return {
          userId,
          encryptedAmount,
          decryptedAmount,
        };
      })
    );

    return res.status(200).json({
      bids: results,
    });
  } catch (error) {
    console.error("Error in getBidsByAuction:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// Get the bidder key so that the bid msg can be unlocked after auction is complete
export const getBidderKey = async (req, res) => {
  try {
    const { auctionId, userId } = req.body;

    if (!auctionId || !userId) {
      return res.status(400).json({ error: "auctionId and userId are required" });
    }

    // Step 1: Fetch the key from AuctionerKey collection
    const auctionerKey = await AuctionerKey.findOne({ auctionId, userId });
    if (!auctionerKey) {
      return res.status(404).json({ error: "No key found for this user in the auction" });
    }

    return res.status(200).json({
      message: "Key fetched successfully",
      auctionId,
      userId,
      key: auctionerKey.key,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const decryptBid = async (req, res) => {
  try {
    const { key, encryptedText } = req.body;

    if (!key || !encryptedText) {
      return res.status(400).json({
        error: "key and encryptedText are required in request body",
      });
    }

    const decryptedAmount = DecryptBid(key, encryptedText);

    return res.status(200).json({
      success: true,
      decryptedAmount,
    });
  } catch (error) {
    console.error("Decryption error:", error.message);
    return res.status(500).json({
      error: "Failed to decrypt bid",
    });
  }
};

export const getbidderid = async(req, res) => {
  try {
    // req.user is populated by protectRoute middleware
    res.status(200).json({ userId: req.user._id });
  } catch (err) {
    console.error("Error getting bidder ID:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const hasPlacedBid = async (req, res) => {
  try {
    const { auctionId, userId } = req.body;

    if (!auctionId || !userId) {
      return res.status(400).json({ error: "auctionId and userId are required" });
    }

    // Check if bid exists
    const bid = await Bid.findOne({ auctionId, userId }).lean();
    const hasBid = !!bid;

    return res.status(200).json({ placedBid: hasBid });
  } catch (err) {
    console.error("Error checking bid:", err);
    return res.status(500).json({ error: "Server error" });
  }
}