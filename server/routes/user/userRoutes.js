import { Router } from "express";
import {
  resetPassword,
  sendForgotPassword,
  logoutUser,
} from "../../controller/user/userController.js";

const router = Router();

router.post("/forget", sendForgotPassword);
router.patch("/reset", resetPassword);


export default router;
