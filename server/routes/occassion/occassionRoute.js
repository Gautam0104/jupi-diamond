import { Router } from "express";
import occassionController from "../../controller/occassion/occassionController.js";
import { upload } from "../../middleware/aws.file.stream.js";

const router = Router();

router.get("/fetch", occassionController.getOccassion);
router.get("/fetch/:id", occassionController.getOccassionById);
router.post("/create", upload.any(), occassionController.createOccassion);
router.patch("/update/:id", upload.any(), occassionController.updateOccassion);
router.delete("/delete/:id", occassionController.deleteOccassion);
router.patch("/toggle/:id", occassionController.toggleOccassion);

export default router;
