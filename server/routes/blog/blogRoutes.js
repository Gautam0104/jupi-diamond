import express from "express";
import blogController from "../../controller/blog/blogController.js";
import { upload } from "../../middleware/aws.file.stream.js";

const router = express.Router();

// CREATE
router.post("/create", upload.any(), blogController.createBlogPost);

// Public fetch blog..........................................
router.get("/public/fetch", blogController.getPublicFetchBlogs);
router.get("/public/featured/fetch", blogController.getPublicFetchFeaturedBlogs);
router.get("/public/fetch/:slug", blogController.getBlogBySlug);

// admin access router........................................
router.get("/fetch/all", blogController.getAllBlogs);
router.get("/fetch/:id", blogController.getBlogById);
router.get("/category/:categorySlug", blogController.getBlogsByCategory);

// UPDATE
router.patch("/update/:id", upload.any(), blogController.updateBlogPost);

// DELETE
router.delete("/delete/:id", blogController.deleteBlogPost);
router.patch("/status/blog/:id", blogController.toggleBlogStatus);
router.patch("/featured/blog/:id", blogController.toggleBlogFeaturedStatus);

export default router;
