import { Router } from "express";
import delhiveryController from "../../controller/one-delhivery/delhiveryController.js";

const router = Router();

// Admin routes
router.post("/pickup-location", delhiveryController.createPickupLocation);
router.post("/order", delhiveryController.createOrder);
router.get("/track/:awb", delhiveryController.trackOrder);
router.post("/cancel", delhiveryController.cancelOrder);
router.get("/manifest", delhiveryController.getManifest);
router.get("/waybill", delhiveryController.generateWaybill);

export default router;
