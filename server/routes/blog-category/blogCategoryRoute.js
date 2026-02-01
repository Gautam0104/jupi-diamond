import express from "express";
import categoryController from "../../controller/blog-category/blogCategoryController.js";
import { upload } from "../../middleware/aws.file.stream.js";
const router = express.Router();

router.post("/create", upload.any(), categoryController.createCategory);
router.get("/fetch/all", categoryController.getAllCategories);
router.get("/fetch/:id", categoryController.getCategoryById);
router.patch("/update/:id", upload.any(), categoryController.updateCategory);
router.delete("/delete/:id", categoryController.deleteCategory);
router.patch("/status/:id", categoryController.toggleCategoryStatus);

export default router;
