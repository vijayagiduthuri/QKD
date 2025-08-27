import express from "express";
import { registerAuction } from "../controllers/auctionRegistrationControllers.js";

const router = express.Router();

router.post("/register", registerAuction);

export default router;