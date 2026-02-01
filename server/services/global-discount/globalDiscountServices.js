import prisma from "../../config/prismaClient.js";
import { paginate } from "../../utils/pagination.js";

const globalDiscountService = {
  async createGlobalDiscountService(data) {
    try {
      const {
        title,
        description,
        discountType,
        discountValue,
        validFrom,
        validTo,
      } = data;

      if (discountType !== "PERCENTAGE" && discountType !== "FIXED") {
        throw {
          statusCode: 400,
          message: "Please discount value enter FIXED/PERCENTAGE",
        };
      }

      if (!title || !discountType) {
        throw { statusCode: 400, message: "Missing required fields" };
      }

      if (!discountValue || discountValue <= 0) {
        throw {
          statusCode: 400,
          message: "Discount value must be greater than 0",
        };
      }

      if (discountType === "PERCENTAGE" && discountValue > 100) {
        throw {
          statusCode: 400,
          message: "Percentage discount cannot exceed 100%",
        };
      }

      if (validFrom && validTo && new Date(validFrom) >= new Date(validTo)) {
        throw {
          statusCode: 400,
          message: "Valid from date must be before valid to date",
        };
      }

      //find unique & validate.............................
      const findDiscount = await prisma.globalDiscount.findFirst({
        where: {
          title,
        },
      });

      if (findDiscount) {
        throw new Error("Discount is already created!");
      }

      return await prisma.globalDiscount.create({
        data: {
          title,
          description,
          discountType,
          discountValue,
          validFrom: validFrom ? validFrom : null,
          validTo: validTo ? validTo : null,
        },
      });
    } catch (error) {
      console.log(error);
      throw new Error(
        "Something went wrong while creating discount: " + error.message
      );
    }
  },

  async getAllGlobalDiscountsService(query) {
    const { search, discountType, validFrom, validTo } = query;
    try {
      let whereFilter = {};
      // Validate database connection
      if (!prisma) {
        throw { statusCode: 500, message: "Database connection error" };
      }
      //searching..........................................
      if (search !== "" && search !== undefined && search !== null) {
        whereFilter = {
          ...whereFilter,
          OR: [
            {
              title: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        };
      }

      //filter by discountType..........................................
      if (discountType === "FIXED" || discountType === "PERCENTAGE") {
        whereFilter = {
          ...whereFilter,
          discountType,
        };
      }

      //filter by validFrom & ValidTo......................................
      if (
        validFrom !== "" &&
        validFrom !== undefined &&
        validFrom !== null &&
        validTo !== "" &&
        validTo !== undefined &&
        validTo !== null
      ) {
        whereFilter = {
          ...whereFilter,
          validFrom: {
            gte: validFrom,
          },
          validTo: {
            lte: validTo,
          },
        };
      } else if (
        validFrom !== "" &&
        validFrom !== undefined &&
        validFrom !== null
      ) {
        whereFilter = {
          ...whereFilter,
          validFrom: {
            gte: validFrom,
          },
        };
      } else if (validTo !== "" && validTo !== undefined && validTo !== null) {
        whereFilter = {
          ...whereFilter,
          validTo: {
            lte: validTo,
          },
        };
      }

      const totalCount = await prisma.globalDiscount.count({
        where: { ...whereFilter },
      });

      const { page, limit, skip, totalPages, currentPage } = paginate(
        query,
        totalCount
      );

      const discounts = await prisma.globalDiscount.findMany({
        where: whereFilter,
        skip,
        take: limit,
        include: {
          ProductVariant: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // Validate that discounts were retrieved successfully
      if (!discounts) {
        throw { statusCode: 404, message: "Unable to retrieve discounts" };
      }

      return {
        discounts,
        pagination: {
          page,
          totalPages,
          currentPage,
          totalCount,
          limit,
        },
      };
    } catch (error) {
      throw new Error("Something went wrong fetching " + error.message);
    }
  },

  async getGlobalDiscountByIdService(id) {
    try {
      // Validate id is provided
      if (!id) {
        throw { statusCode: 400, message: "Discount ID is required" };
      }

      // Validate id format
      if (typeof id !== "string" || id.trim() === "") {
        throw { statusCode: 400, message: "Invalid discount ID format" };
      }

      // Validate database connection
      if (!prisma) {
        throw { statusCode: 500, message: "Database connection error" };
      }

      const discount = await prisma.globalDiscount.findUnique({
        where: { id },
        include: {
          ProductVariant: true,
        },
      });

      if (!discount) throw { statusCode: 404, message: "Discount not found" };
      return discount;
    } catch (error) {
      throw error;
    }
  },

  async updateGlobalDiscountService(id, data) {
    try {
      const {
        title,
        description,
        discountType,
        discountValue,
        validFrom,
        validTo,
      } = data;

      // Validate discount type
      if (
        discountType &&
        discountType !== "PERCENTAGE" &&
        discountType !== "FIXED"
      ) {
        throw {
          statusCode: 400,
          message: "Please discount value enter FIXED/PERCENTAGE",
        };
      }

      // Validate required fields if being updated
      if (discountType && !title) {
        throw { statusCode: 400, message: "Missing required fields" };
      }

      // Validate discount value if being updated
      if (discountValue !== undefined) {
        if (discountValue <= 0) {
          throw {
            statusCode: 400,
            message: "Discount value must be greater than 0",
          };
        }

        if (discountType === "PERCENTAGE" && discountValue > 100) {
          throw {
            statusCode: 400,
            message: "Percentage discount cannot exceed 100%",
          };
        }
      }

      // Validate dates if being updated
      if (validFrom && validTo && new Date(validFrom) >= new Date(validTo)) {
        throw {
          statusCode: 400,
          message: "Valid from date must be before valid to date",
        };
      }

      const existing = await prisma.globalDiscount.findUnique({
        where: { id },
      });
      if (!existing) throw { statusCode: 404, message: "Discount not found" };

      return await prisma.globalDiscount.update({
        where: { id },
        data: {
          title,
          description,
          discountType,
          discountValue,
          validFrom: validFrom ? new Date(validFrom) : null,
          validTo: validTo ? new Date(validTo) : null,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  async deleteGlobalDiscountService(id) {
    try {
      // Validate id is provided
      if (!id) {
        throw { statusCode: 400, message: "Discount ID is required" };
      }

      // Validate id format
      if (typeof id !== "string" || id.trim() === "") {
        throw { statusCode: 400, message: "Invalid discount ID format" };
      }

      const existing = await prisma.globalDiscount.findUnique({
        where: { id },
      });
      if (!existing) throw { statusCode: 404, message: "Discount not found" };

      // Disconnect all variants first
      await prisma.productVariant.updateMany({
        where: { globalDiscountId: id },
        data: { globalDiscountId: null },
      });

      return await prisma.globalDiscount.delete({ where: { id } });
    } catch (error) {
      throw error;
    }
  },

  async applyDiscountToMultipleVariants(discountId, variantIds = []) {
    if (!variantIds.length) {
      throw { statusCode: 400, message: "No variant IDs provided." };
    }

    const discount = await prisma.globalDiscount.findUnique({
      where: { id: discountId },
    });

    if (!discount || !discount.isActive) {
      throw { statusCode: 404, message: "Discount not found or inactive." };
    }

    const now = new Date();
    if (
      (discount.validFrom && new Date(discount.validFrom) > now) ||
      (discount.validTo && new Date(discount.validTo) < now)
    ) {
      throw { statusCode: 400, message: "Discount is not currently valid." };
    }

    const variants = await prisma.productVariant.findMany({
      where: {
        id: { in: variantIds },
        isActive: true,
      },
    });

    const results = [];
    for (const variant of variants) {
      if (variant.globalDiscountId === discountId) {
        results.push({ variantId: variant.id, status: "already applied" });
        continue;
      }

      if (variant.globalDiscountId) {
        results.push({
          variantId: variant.id,
          status: "other discount already applied",
        });
        continue;
      }

      let basePrice = variant.sellingPrice || 0;
      let discounted = basePrice;

      if (discount.discountType === "PERCENTAGE") {
        discounted = basePrice - (basePrice * discount.discountValue) / 100;
      } else if (discount.discountType === "FIXED") {
        discounted = basePrice - discount.discountValue;
      }

      if (discounted < 0) discounted = 0;
      const gst = variant.gst || 0;
      const finalWithGst = discounted + (discounted * gst) / 100;
      console.log(
        "basePrice=>",
        basePrice,
        "gst=>",
        gst,
        "finalWithGst=>",
        finalWithGst
      );
      const updated = await prisma.productVariant.update({
        where: { id: variant.id },
        data: {
          globalDiscountId: discountId,
          finalPrice: Math.round(finalWithGst),
        },
      });

      console.log("updated==>", updated);

      results.push({ variantId: variant.id, status: "discount applied" });
    }

    return results;
  },

  // remove product service........................................
  async removeDiscountFromVariants(variantIds = []) {
    if (!variantIds.length) {
      throw { statusCode: 400, message: "No variant IDs provided." };
    }

    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds }, isActive: true },
    });

    const results = [];

    for (const variant of variants) {
      if (!variant.globalDiscountId) {
        results.push({
          variantId: variant.id,
          status: "no discount to remove",
        });
        continue;
      }

      const basePrice = variant.sellingPrice || 0;
      const gst = variant.gst || 0;
      const newFinalPrice = basePrice + (basePrice * gst) / 100;

      await prisma.productVariant.update({
        where: { id: variant.id },
        data: {
          globalDiscountId: null,
          finalPrice: Math.round(newFinalPrice),
        },
      });

      results.push({ variantId: variant.id, status: "discount removed" });
    }

    return results;
  },
};

export default globalDiscountService;
