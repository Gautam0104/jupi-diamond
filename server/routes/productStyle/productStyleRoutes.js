import { Router } from "express";
import productStyleController from "../../controller/productStyle/productStyleController.js";
import { upload } from "../../middleware/aws.file.stream.js";

const router = Router();

router.get("/fetch", productStyleController.getProductStyle);
router.get("/fetch/:id", productStyleController.getProductStyleById);
router.post("/create", upload.any(), productStyleController.createProductStyle);
router.patch(
  "/update/:id",
  upload.any(),
  productStyleController.updateProductStyle
);
router.delete("/delete/:id", productStyleController.deleteProductStyle);
router.patch("/toggle/:id", productStyleController.toggleProductStyle);
export default router;
