import express from "express";
import shippingChargeController from "../../controller/shipping-charge/shippingChargeController.js";
const router = express.Router();

router.post("/create", shippingChargeController.createShippingCharge);
//Public api...............................................................
router.get("/public/data", shippingChargeController.getShippingPublicCharges);

router.get("/fetch", shippingChargeController.getAllShippingCharges);
router.get("/fetch/by/:id", shippingChargeController.getShippingChargeById);
router.patch("/update/:id", shippingChargeController.updateShippingCharge);
router.delete("/delete/:id", shippingChargeController.deleteShippingCharge);

export default router;
