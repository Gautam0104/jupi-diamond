import { Router } from "express";
import paymentController from "../../controller/paymentController/paymentController.js";

const router = Router();

router.post("/verify", paymentController.verifyRazorpayPayment);

export default router;
