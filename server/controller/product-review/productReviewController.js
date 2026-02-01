import { uploadFilesToS3 } from "../../middleware/aws.file.stream.js";
import productReviewService from "../../services/product-review/productReviewService.js";

const productReviewController = {
  // Create Product Review
  async createReview(req, res) {
    try {
      const imageUrl = req.files && (await uploadFilesToS3(req.files));

      //here make url like array of string ["url", "url"....]................ now imageUrl is array of object
      if (imageUrl) {
        req.body.imageUrl = imageUrl.map((image) => image.url);
      }
      console.log("imageUrl=>", imageUrl);
      const review = await productReviewService.createReview(req.body);
      res.status(201).json({ success: true, data: review });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // Get Product Reviews public for a Variant
  async getReviewsByVariant(req, res) {
    try {
      const reviews = await productReviewService.getReviewsByVariant({
        ...req.query,
        productVariantId: req.params.variantId,
      });
      res.status(200).json({ success: true, data: reviews });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // Admin review & rating management........................................
  async getAllReviews(req, res) {
    try {
      const isApproved =
        req.query.isApproved === "true"
          ? true
          : req.query.isApproved === "false"
            ? false
            : undefined;
      const reviews = await productReviewService.getAllReviews({
        ...req.query,
        isApproved,
      });
      res.status(200).json({ success: true, data: reviews });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async approveReview(req, res) {
    try {
      const review = await productReviewService.approveRejectReview(req.params);
      res.status(200).json({ success: true, data: review });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async featureReview(req, res) {
    try {
      const review = await productReviewService.featureReview(req.params);
      res.status(200).json({ success: true, data: review });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async rejectReview(req, res) {
    try {
      const review = await productReviewService.rejectReview(req.params.id);
      res.status(200).json({ success: true, data: review });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async deleteReview(req, res) {
    try {
      const review = await productReviewService.deleteReview(req.params.id);
      res.status(200).json({ success: true, message: "Review deleted." });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
};

export default productReviewController;
