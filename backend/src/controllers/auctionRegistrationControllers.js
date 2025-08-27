import AuctionRegistration from "../models/auctionRegistrationModel.js";
import auctionerKey from "../models/auctionerKeyModel.js";

// Controller for registering in an auction
export const registerAuction = async (req, res) => {
  try {
    const { auctionId, userId, name, email, phone, address, key, auctionerId } =
      req.body;

    // Validate required fields
    if (
      !auctionerId ||
      !auctionId ||
      !userId ||
      !name ||
      !email ||
      !phone ||
      !address ||
      !key
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Save registration details in AuctionRegistration collection
    const registration = new AuctionRegistration({
      auctionerId,
      auctionId,
      userId,
      name,
      email,
      phone,
      address,
      key,
    });
    await registration.save();

    // Save the key details in auctionerKey collection
    const auctionerKeyDoc = new auctionerKey({
      auctionerId,
      auctionId,
      userId,
      key,
    });
    await auctionerKeyDoc.save();

    res.status(201).json({
      message: "User registered successfully with auction",
      registration,
      auctionerKey: auctionerKeyDoc,
    });
  } catch (error) {
    console.error("Error in registerAuction:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
