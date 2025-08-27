import express from "express"
import {
    placeBid,
    getBidsByAuction,
    getBidderKey,
    decryptBid,
    getbidderid,
    hasPlacedBid,
    sendWinningMail
} from "../controllers/bidControllers.js"
import { protectRoute } from "../middlewares/jwtToken.js";

const router = express.Router();

router.post("/place-bid", placeBid)
router.get("/get-bids-by-id/:auctionId", getBidsByAuction)
router.post("/get-bidder-key", getBidderKey)
router.post("/decrypt-bid", decryptBid)
router.get("/get-bidder-id",protectRoute, getbidderid)
router.post("/has-placed-bit", hasPlacedBid)
router.post("/winning-mail", sendWinningMail)

export default router;