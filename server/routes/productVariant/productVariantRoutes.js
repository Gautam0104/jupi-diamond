import { Router } from "express";
import productVariantController from "../../controller/productVariant/productVariantController.js";
import { upload } from "../../middleware/aws.file.stream.js";

const router = Router();
router.get("/fetch", productVariantController.getProductVariant);
router.get("/fetch/:id", productVariantController.getProductVariantById);
router.post(
  "/create",
  upload.any(),
  productVariantController.createProductVariant
);
router.patch("/update/:id", productVariantController.updateProductVariant);
router.delete("/delete/:id", productVariantController.deleteProductVariant);

//add crew on variant..................................................
router.post("/add/crew", productVariantController.addScrew);
router.delete(
  "/remove/crew/:variantId/:screwId",
  productVariantController.removeScrew
);

router.post(
  "/add/image/:id",
  upload.any(),
  productVariantController.addProductVariantImage
);
router.delete(
  "/remove/image/:id",
  productVariantController.removeProductVariantImage
);
router.patch(
  "/update-image-order/:id",
  upload.any(),
  productVariantController.updateProductVariantImageOrder
);
router.patch(
  "/update/status/:status/:id",
  productVariantController.toggleProductVariant
);
router.patch("/update-stock/:id", productVariantController.updateProductVariantStock);

router.patch("/update/:id/status", productVariantController.updateDailyWear);

router.get("/trending/fetch", productVariantController.getTrendingProducts);

//product comparison...................................................
router.post("/comparison/fetch", productVariantController.productComparison);

// public fetch all product variants........................................................
router.get(
  "/public/fetch/all",
  productVariantController.getPublicProductVariant
);

// public new arrival fetch variants........................................................
router.get(
  "/public/new/arrival",
  productVariantController.getPublicNewArrivalProductVariant
);

export default router;
