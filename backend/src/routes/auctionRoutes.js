import express from "express";
import {
  createAuction,
  getOngoingAuctions,
  getUpcomingAuctions,
  getPastAuctions,
  getAuctionEndTime,
  getAuctionStartingBid,
  getAuctionFile,
  isRegisteredForAuction,
  getOngoingAuctionsById
} from "../controllers/auctionControllers.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/create", upload.single("file"), createAuction);

router.get("/upcoming", getUpcomingAuctions);

router.get("/ongoing", getOngoingAuctions);

router.get("/past", getPastAuctions);

router.post("/get-end-time", getAuctionEndTime);

router.post("/get-auction-starting-bid", getAuctionStartingBid);

router.get("/auction-file/:auctionId", getAuctionFile);

router.post("/check-registration-status", isRegisteredForAuction)

router.post("/ongoing-by-id", getOngoingAuctionsById)

export default router;
