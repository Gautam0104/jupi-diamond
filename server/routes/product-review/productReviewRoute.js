import { Router } from "express";
import { upload } from "../../middleware/aws.file.stream.js";
import productReviewController from "../../controller/product-review/productReviewController.js";

const router = Router();

// public api routes........................................................
router.post("/create", upload.any(), productReviewController.createReview);
router.get("/fetch/:variantId", productReviewController.getReviewsByVariant);

// Admin api routes.........................................................
router.get("/admin/reviews", productReviewController.getAllReviews);
router.patch(
  "/admin/reviews/isApproved/:id/:status",
  productReviewController.approveReview
);

router.patch(
  "/admin/reviews/isFeatured/:id/:status",
  productReviewController.featureReview
);
router.delete("/admin/reviews/:id", productReviewController.deleteReview);
export default router;
