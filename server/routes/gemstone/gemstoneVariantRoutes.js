import { Router } from "express";
import gemstoneVariantController from "../../controller/gemstone/gemstoneVariantController.js";
import { upload } from "../../middleware/aws.file.stream.js";
import { isAdmin } from "../../middleware/isAdmin.js";

const router = Router();

router.get("/fetch", gemstoneVariantController.getMetalVariant);
router.get("/fetch/:id", gemstoneVariantController.getGemstoneVariantById);
router.post(
  "/create",
  upload.any(),
  gemstoneVariantController.createMetalVariant
);

router.patch(
  "/update/:id",
  upload.any(),
  gemstoneVariantController.updateGemstoneVariant
);

router.get(
  "/fetch/history/:id",
  gemstoneVariantController.fetchUpdatedHistoryByGemestone
);

router.delete("/delete/:id", gemstoneVariantController.deleteGemstoneVariant);

export default router;
