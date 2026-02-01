import { Router } from "express";
import metalColorVariantController from "../../controller/metalColorVariant/metalColorVariantController.js";

const router = Router();

router.post("/create", metalColorVariantController.createMetalColorVariant);
router.get("/fetch", metalColorVariantController.getMetalColorVariant);
router.get("/fetch/:id", metalColorVariantController.getMetalColorVariantById);
router.delete(
  "/delete/:id",
  metalColorVariantController.deleteMetalColorVariant
);

export default router;
