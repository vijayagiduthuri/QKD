import Auction from "../models/auctionModel.js";
import Aucioner from "../models/auctionerModel.js"
import AuctionRegistration from "../models/auctionRegistrationModel.js";

//create an auction
export const createAuction = async (req, res) => {
  try {
    const {
      auctionerId,
      title,
      description,
      basePrice,
      startDateTime,
      endDateTime,
    } = req.body;

    // ✅ Validate required fields
    if (
      !auctionerId ||
      !title ||
      !description ||
      !basePrice ||
      !startDateTime ||
      !endDateTime
    ) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    // ✅ Convert image buffer to base64
    const fileBase64 = req.file.buffer.toString("base64");

    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: "Invalid date or time format" });
    }

    // ✅ Create auction document
    const auction = new Auction({
      auctionerId, // 🔹 Added auctionerId
      title,
      description,
      basePrice,
      startDateTime: start,
      endDateTime: end,
      file: fileBase64,
    });

    await auction.save();

    return res.status(201).json({
      message: "Auction created successfully",
      auction,
    });
  } catch (error) {
    console.error("Error creating auction:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Get Upcoming Auctions
export const getUpcomingAuctions = async (req, res) => {
  try {
    const upcoming = await Auction.find({ status: "upcoming" });
    return res.status(200).json({ upcoming });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Get Ongoing Auctions
export const getOngoingAuctions = async (req, res) => {
  try {
    const ongoing = await Auction.find({ status: "ongoing" });
    return res.status(200).json({ ongoing });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Get Past Auctions
export const getPastAuctions = async (req, res) => {
  try {
    const past = await Auction.find({ status: "past" });
    return res.status(200).json({ past });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getAuctionEndTime = async (req, res) => {
  try {
    const { auctionId } = req.body;

    if (!auctionId) {
      return res.status(400).json({ message: "auctionId is required" });
    }

    const auction = await Auction.findById(auctionId).select("endDateTime");

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    return res.status(200).json({
      auctionId,
      endDateTime: auction.endDateTime,
    });
  } catch (error) {
    console.error("Error fetching auction end time:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const getAuctionStartingBid = async (req, res) => {
  try {
    const { auctionId } = req.body;

    if (!auctionId) {
      return res.status(400).json({ message: "auctionId is required" });
    }

    const auction = await Auction.findById(auctionId).select("basePrice");

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    return res.status(200).json({
      auctionId,
      startingBid: auction.basePrice,
    });
  } catch (error) {
    console.error("Error fetching auction starting bid:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAuctionFile = async (req, res) => {
  try {
    const { auctionId } = req.params; // GET /auction-file/:auctionId

    if (!auctionId) {
      return res.status(400).json({ message: "auctionId is required" });
    }

    const auction = await Auction.findById(auctionId).select("file");

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    return res.status(200).json({
      auctionId,
      file: auction.file, // return the file path or URL
    });
  } catch (error) {
    console.error("Error fetching auction file:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const isRegisteredForAuction = async (req, res) => {
  try {
    const { auctionId, userId } = req.body;

    if (!auctionId || !userId) {
      return res.status(400).json({ error: "auctionId and userId are required" });
    }

    // Check registration in AuctionRegistration collection
    const registration = await AuctionRegistration.findOne({
      auctionId,
      userId,
    }).lean();

    const isRegistered = !!registration;

    return res.status(200).json({ registered: isRegistered });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

export const getOngoingAuctionsById = async (req, res) => {
  try {
    const { userId } = req.body; // Get userId from request body
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // Fetch auctions and populate auctioner name
    const auctions = await Auction.find({ status: "ongoing"}, "auctionerId title endDateTime")
      .populate("auctionerId", "name");

    // For each auction, check if user is registered
    const formattedAuctions = await Promise.all(
      auctions.map(async (auction) => {
        const registration = await AuctionRegistration.findOne({
          auctionId: auction._id,
          userId,
        });

        return {
          _id: auction._id,
          title: auction.title,
          endDateTime: auction.endDateTime,
          auctionerName: auction.auctionerId.name,
          isRegistered: !!registration, // true if registration exists, else false
        };
      })
    );

    res.status(200).json(formattedAuctions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}