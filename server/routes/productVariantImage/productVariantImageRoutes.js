import { Router } from "express";
import productVariantImage from "../../controller/productVariantImage/productVariantImageController.js";
import { upload } from "../../multerConfig.js";

const router = Router();

router.get("/fetch", productVariantImage.getproductVariantImage);
router.get("/fetch/:id", productVariantImage.getProductVariantImageById);
router.post(
  "/create",
  upload.array("images", 10),
  productVariantImage.creteProductVariantImage
);

export default router;
