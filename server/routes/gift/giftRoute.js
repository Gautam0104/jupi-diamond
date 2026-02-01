import express from "express";
import { adminGiftCardController } from "../../controller/gift/giftController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", adminGiftCardController.createGiftCard);
router.get("/fetch", adminGiftCardController.getAllGiftCards);
router.get("/fetch/:id", adminGiftCardController.getGiftCardById);
router.patch("/update/:id", adminGiftCardController.updateGiftCard);
router.delete("/delete/:id", adminGiftCardController.deleteGiftCard);

router.get("/my/card", authMiddleware, adminGiftCardController.getMyGiftCards);
router.post("/customer/redeem", adminGiftCardController.redeemGiftCard);

export default router;
