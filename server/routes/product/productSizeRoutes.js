import { Router } from "express";
import productSizeController from "../../controller/product/productSizeController.js";

const router = Router();

router.get("/fetch", productSizeController.getProductSize);
router.get("/fetch/:id", productSizeController.getProductSizeById);
router.post("/create", productSizeController.createProductSize);
router.patch("/update/:id", productSizeController.updateProductSize);
router.delete("/delete/:id", productSizeController.deleteProductSize);

export default router;
