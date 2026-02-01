import { Router } from "express";
import productController from "../../controller/product/productController.js";
import { uploadExcel } from "../../middleware/uploadExcel.js";
import { upload } from "../../middleware/aws.file.stream.js";

const router = Router();

router.post("/create", upload.any(), productController.createProduct);
router.get("/fetch", productController.getProduct);
router.get("/fetch/:id", productController.getProductById);
router.patch("/update/:id", upload.any(), productController.updateProduct);
router.delete("/delete/:id", productController.deleteProduct);

router.post(
  "/bulk-create/excel",
  uploadExcel.single("file"),
  productController.bulkUploadProductsFromExcel
);

router.post("/add-variant/:productId", productController.addProductVariant);
router.get("/karigar/details", productController.getKarigar);

//public api fetch by product slug name..............................................
router.get("/public/fetch/:productVariantSlug", productController.getProductBySlug);

export default router;
