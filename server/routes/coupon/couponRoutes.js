import { Router } from "express";
import couponController from "../../controller/coupon/couponController.js";

const router = Router();

router.post("/create", couponController.createCoupon);
router.get("/fetch", couponController.getCoupon);
router.get("/fetch/:id", couponController.getCouponById);
router.delete("/delete/:id", couponController.deleteCoupon);
router.patch("/update/:id", couponController.updateCoupon);
router.patch("/status/update/:id", couponController.updateCouponStatus);

router.post("/applied", couponController.applyCoupon);

export default router;
