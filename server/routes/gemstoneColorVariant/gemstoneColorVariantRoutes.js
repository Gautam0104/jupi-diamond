import { Router } from "express";
import gemstoneColorVariantController from "../../controller/gemstoneColorVariant/gemstoneColorVariantController.js";

const router = Router();

router.post(
  "/create",
  gemstoneColorVariantController.createGemstoneColorVariant
);
router.get("/fetch", gemstoneColorVariantController.getGemstoneColorVariant);
router.get(
  "/fetch/:id",
  gemstoneColorVariantController.getGemstoneColorVariantById
);
router.delete(
  "/delete/:id",
  gemstoneColorVariantController.deleteMetalColorVariant
);

router.patch(
  "/update/:id",
  gemstoneColorVariantController.updateGemstoneColorVariant
);

export default router;
