import cmsController from "../../controller/footer-important-cms/footerImportantController.js";
import express from "express";
const router = express.Router();

// Public access............................................
router.get("/fetch/:slug", cmsController.getPageBySlug);

// Admin....................................................
router.get("/fetch/all/pages", cmsController.getAllPages);
router.post("/create", cmsController.createPage);
router.get("/fetch/id/:id", cmsController.getPageById);
router.patch("/update/:id", cmsController.updatePage);
router.delete("/delete/:id", cmsController.deletePage);

export default router;
