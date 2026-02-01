import { Router } from "express";
import metalColorController from "../../controller/metal/metalColorController.js";

const router = Router();

router.get("/fetch", metalColorController.getMetalColorController);
router.get("/fetch/:id", metalColorController.metalColorGetByIdController);
router.post("/create", metalColorController.createMetalColorController);
router.delete("/delete/:id", metalColorController.deleteMetalColorController);
router.patch("/update/:id", metalColorController.updateMetalColorController);

export default router;
