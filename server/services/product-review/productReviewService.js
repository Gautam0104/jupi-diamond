import { features } from "node:process";
import prisma from "../../config/prismaClient.js";
import { paginate } from "../../utils/pagination.js";

const productReviewService = {
  // Create a new product review (1 per order item)
  async createReview(data) {
    try {
      const {
        orderItemId,
        customerId,
        productVariantId,
        rating,
        reviewTitle,
        reviewBody,
        imageUrl,
      } = data;
      console.log("data==", data);
      // Step 1: Prevent duplicate review per order item
      const existing = await prisma.productReview.findUnique({
        where: { orderItemId },
      });
      if (existing) {
        throw new Error("You have already reviewed this order item.");
      }

      // Step 2: Validate that the order item is owned, paid, and matches productVariant
      const orderItem = await prisma.orderItem.findFirst({
        where: {
          id: orderItemId,
          productVariantId,
          order: {
            isPaid: true,
            customerId,
          },
        },
      });
      if (!orderItem) {
        throw new Error("You are not eligible to review this product.");
      }

      // Step 3: Create review
      return await prisma.productReview.create({
        data: {
          orderItemId,
          customerId,
          productVariantId,
          rating: Number.parseInt(rating),
          reviewTitle,
          reviewBody,
          images: imageUrl,
          isVerifiedBuyer: true,
        },
      });
    } catch (error) {
      throw new Error(
        "Something went wrong while creating review: " + error.message
      );
    }
  },

  // Get all approved reviews for a specific product variant
  async getReviewsByVariant(query) {
    try {
      const { productVariantId } = query;
      let whereFilter = { productVariantId, isApproved: true };
      const totalCount = await prisma.productReview.count({
        where: { ...whereFilter },
      });

      const { page, limit, skip, totalPages, currentPage } = paginate(
        query,
        totalCount
      );
      const reviews = await prisma.productReview.findMany({
        where: { ...whereFilter, isApproved: true },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          customer: { select: { firstName: true, lastName: true } },
        },
      });

      return {
        reviews,
        pagination: {
          totalPages,
          currentPage,
          totalCount,
          limit,
        },
      };
    } catch (error) {
      throw new Error(
        "Something went wrong while fetching reviews: " + error.message
      );
    }
  },
  // Admin: List all reviews (optionally filtered)
  async getAllReviews(query) {
    const { isApproved, search, minRating, maxRating } = query;
    try {
      let whereFilter = {};
      //searching..........................
      if (search !== null && search !== undefined && search !== "") {
        whereFilter = {
          ...whereFilter,
          OR: [
            { reviewTitle: { contains: search, mode: "insensitive" } },
            {
              customer: {
                OR: [
                  { firstName: { contains: search, mode: "insensitive" } },
                  { lastName: { contains: search, mode: "insensitive" } },
                ],
              },
            },
          ],
        };
      }

      //minRating & maxRating filter.................................
      if (
        minRating !== null &&
        minRating !== undefined &&
        minRating !== "" &&
        maxRating !== null &&
        maxRating !== undefined &&
        maxRating !== ""
      ) {
        whereFilter = {
          ...whereFilter,
          rating: {
            gte: Number.parseInt(minRating),
            lte: Number.parseInt(maxRating),
          },
        };
      } else if (
        minRating !== null &&
        minRating !== undefined &&
        minRating !== ""
      ) {
        whereFilter = {
          ...whereFilter,
          rating: { gte: Number.parseInt(minRating) },
        };
      } else if (
        maxRating !== null &&
        maxRating !== undefined &&
        maxRating !== ""
      ) {
        whereFilter = {
          ...whereFilter,
          rating: { lte: Number.parseInt(maxRating) },
        };
      }

      const totalCount = await prisma.productReview.count({
        where: { ...whereFilter },
      });

      const { page, limit, skip, totalPages, currentPage } = paginate(
        query,
        totalCount
      );

      const reviews = await prisma.productReview.findMany({
        where: {
          ...whereFilter,
          ...(typeof isApproved === "boolean" && { isApproved }),
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          productVariant: { select: { productVariantTitle: true } },
          customer: { select: { firstName: true, lastName: true } },
        },
      });

      return {
        reviews,
        pagination: { page, limit, skip, totalPages, currentPage, totalCount },
      };
    } catch (error) {
      throw new Error(
        "Something went wrong while fetching reviews: " + error.message
      );
    }
  },

  // Admin: Approve/reject a review
  async approveRejectReview(data) {
    const { id, status } = data;
    console.log("data=", data);
    try {
      return await prisma.productReview.update({
        where: { id: id },
        data: { isApproved: status === "true" ? true : false },
      });
    } catch (error) {
      throw new Error(
        "Something went wrong while approving review: " + error.message
      );
    }
  },

  async featureReview(data) {
    const { id, status } = data;
    console.log("data=", data);

    try {
      // First check how many reviews are currently featured
      const featuredCount = await prisma.productReview.count({
        where: { isFeatured: true },
      });

      // Determine the new status from the input
      const newStatus = status === "true";

      // If trying to feature a review but already reached the limit
      if (newStatus && featuredCount >= 20) {
        throw new Error("You have reached your limit of 20 featured reviews");
      }

      // If trying to unfeature a review, or feature with available slots
      return await prisma.productReview.update({
        where: { id: id },
        data: { isFeatured: newStatus },
      });
    } catch (error) {
      throw new Error(
        "Something went wrong while featuring review: " + error.message
      );
    }
  },

  // Admin: Delete a review
  async deleteReview(reviewId) {
    try {
      // Validate reviewId exists
      if (!reviewId) {
        throw new Error("Review ID is required");
      }

      // Check if review exists before deleting
      const review = await prisma.productReview.findUnique({
        where: { id: reviewId },
      });

      if (!review) {
        throw new Error("Review not found");
      }

      return await prisma.productReview.delete({
        where: { id: reviewId },
      });
    } catch (error) {
      throw new Error("Error deleting review: " + error.message);
    }
  },
};

export default productReviewService;
