import express from "express"
import {
    Checkout
} from "../controllers/paymentController.js"

const router = express.Router();

router.post("/checkout", Checkout);

export default router;