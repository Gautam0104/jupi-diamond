import { Router } from "express";
import jewelryTypeController from "../../controller/jewelry/jewelryTypeController.js";
import { upload } from "../../middleware/aws.file.stream.js";

const router = Router();

router.get("/fetch", jewelryTypeController.jewelryTypeGetController);
router.get("/fetch/:id", jewelryTypeController.jewelryTypeGetByIdController);
router.post(
  "/create",
  upload.any(),
  jewelryTypeController.jewelryTypePostController
);
router.delete("/delete/:id", jewelryTypeController.JewelryTypeDeleteController);
router.patch("/toggle/:id", jewelryTypeController.jewelryTypeToggleController);
router.patch(
  "/update/:id",
  upload.any(),
  jewelryTypeController.jewelryTypeUpdateController
);

//public api................................................................
router.get(
  "/public/fetch",
  jewelryTypeController.jewelryTypeGetPublicController
);

export default router;
