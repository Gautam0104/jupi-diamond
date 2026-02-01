import { Router } from "express";
import {
  loginRetailer,
  registerRetailer,
} from "../../controller/auth/retailerController.js";
import { verifyEmail } from "../../utils/verifyEmail.js";

const router = Router();

router.post("/register", registerRetailer);
router.post("/login", loginRetailer);
router.get("/verifyemail", verifyEmail);

export default router;
