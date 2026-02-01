import { Router } from "express";
import { upload } from "../../middleware/aws.file.stream.js";
import bannerController from "../../controller/banner/bannerController.js";

const router = Router();

// Admin routes
router.post("/create", upload.any(), bannerController.createBanner);
router.get("/fetch", bannerController.getAllBanners);
router.get("/fetch/:id", bannerController.getAllBannerById);
router.patch("/update/:id", upload.any(), bannerController.updateBanner);
router.patch("/update/toggle/:id", bannerController.toggleBanner);
router.delete("/delete/:id", bannerController.deleteBanner);

// Public
router.get("/public/list", bannerController.getPublicBanners);

export default router;
