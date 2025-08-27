import express from "express";
import { registerAuction ,getRegisteredAuctions,isUserRegistered} from "../controllers/auctionRegistrationControllers.js";

const router = express.Router();

router.post("/register", registerAuction);

router.get("/registered/:userId", getRegisteredAuctions);

router.get("/:auctionId/:userId", isUserRegistered);

export default router;