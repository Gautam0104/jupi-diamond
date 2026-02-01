import { Router } from "express";
import gemstoneColorController from "../../controller/gemstone/gemstoneColorController.js";

const router = Router();

router.get("/fetch", gemstoneColorController.getGemstoneColorController);
router.get("/fetch/:id", gemstoneColorController.gemstoneColorGetByIdController);
router.post("/create", gemstoneColorController.createGemstoneColorController);
router.delete(
  "/delete/:id",
  gemstoneColorController.deleteGemstoneColorController
);
router.patch("/update/:id", gemstoneColorController.updateMetalColorController);


export default router;
