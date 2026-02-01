import { Router } from "express";
import metalVariantController from "../../controller/metal/metalVariantController.js";

const router = Router();

router.get("/fetch", metalVariantController.getMetalVariant);
router.get("/fetch/:id", metalVariantController.getMetalVariantById);
router.post("/create", metalVariantController.createMetalVariant);
router.patch("/update/:id", metalVariantController.updateMetalVariant);
router.delete("/delete/:id", metalVariantController.deleteMetalVariant);

router.get(
  "/fetch/history/:id",
  metalVariantController.fetchUpdateHistoryByMetal
);

export default router;
