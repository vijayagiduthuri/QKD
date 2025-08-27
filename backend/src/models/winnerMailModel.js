import mongoose from "mongoose";

const winnerMailSchema = new mongoose.Schema(
  {
    auctionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Ensure unique combination of auctionId + userId

const WinnerMail = mongoose.model("WinnerMail", winnerMailSchema);
export default WinnerMail;