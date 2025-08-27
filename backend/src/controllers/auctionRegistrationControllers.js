import AuctionRegistration from "../models/auctionRegistrationModel.js";
import auctionerKey from "../models/auctionerKeyModel.js";

// Controller for registering in an auction
export const registerAuction = async (req, res) => {
  try {
    const { auctionId, userId, name, email, phone, address, key, auctionerId } =
      req.body;
    console.log("Incoming registration body:", req.body);
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

// controllers/auctionRegistrationController.js
export const getRegisteredAuctions = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: "Missing userId" });

    const registrations = await AuctionRegistration.find({ userId }).populate(
      "auctionId"
    ); // auctionId must ref "Auction"

    const ongoing = [];
    const upcoming = [];

    registrations.forEach((reg) => {
      const a = reg.auctionId;
      if (!a) return;

      if (a.status === "active") {
        ongoing.push({
          id: a._id,
          title: a.title,
          startingBid: a.basePrice,
          startDateTime: a.startDateTime,
          endDateTime: a.endDateTime,
        });
      } else if (a.status === "scheduled" || a.status === "upcoming") {
        upcoming.push({
          id: a._id,
          title: a.title,
          startingBid: a.basePrice,
          startTime: a.startDateTime,
        });
      }
    });

    res.status(200).json({ ongoing, upcoming });
  } catch (err) {
    console.error("Error fetching registered auctions:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Get if user is registered for an auction
export const isUserRegistered = async (req, res) => {
  try {
    const { auctionId, userId } = req.params;
    if (!auctionId || !userId)
      return res.status(400).json({ message: "Missing auctionId or userId" });

    const registration = await AuctionRegistration.findOne({
      auctionId,
      userId,
    });
    res.status(200).json({ registered: !!registration }); // true if found
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
