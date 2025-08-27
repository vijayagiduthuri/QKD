import express from "express"
import {
    Checkout
} from "../controllers/paymentController.js"

const router = express.Router();

router.post("/create-checkout-session", Checkout);

export default router;