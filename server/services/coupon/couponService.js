import prisma from "../../config/prismaClient.js";
import { generateSlug } from "../../utils/autogenerateSlug.js";
import { paginate } from "../../utils/pagination.js";

const couponService = {
  async createCoupon(data) {
    try {
      const {
        code,
        discountValue,
        validFrom,
        validTo,
        discountType,
        minCartValue,
        usedCount = 0,
        usageLimit,
      } = data;
      if (!code || !discountValue || !discountType) {
        throw new Error("Missing fildes are required");
      }

      const slug = generateSlug(code);

      const existing = await prisma.coupon.findUnique({
        where: {
          couponSlug: slug,
        },
      });

      if (existing) {
        throw new Error("Coupon already exist");
      }

      const newCoupon = await prisma.coupon.create({
        data: {
          code,
          discountValue,
          validFrom: validFrom ? new Date(validFrom) : null,
          validTo: validTo ? new Date(validTo) : null,
          discountType,
          couponSlug: slug,
          minCartValue: Number.parseFloat(minCartValue),
          usedCount: Number.parseInt(usedCount),
          usageLimit: Number.parseInt(usageLimit),
        },
      });
      console.log(newCoupon);
      return newCoupon;
    } catch (error) {
      throw new Error("Something went wrong: " + error.message);
    }
  },

  async getCoupon(query) {
    const { search, discountType, validFrom, validTo } = query;
    try {
      let whereFilter = {};

      //searching..........................................
      if (search !== "" && search !== undefined && search !== null) {
        whereFilter = {
          ...whereFilter,
          OR: [
            {
              code: {
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

      const totalCount = await prisma.coupon.count({
        where: { ...whereFilter },
      });

      const { page, limit, skip, totalPages, currentPage } = paginate(
        query,
        totalCount
      );

      const coupons = await prisma.coupon.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        where: { ...whereFilter },
      });
      if (!coupons) {
        throw new Error("No coupons found");
      }
      return {
        coupons,
        pagination: {
          page,
          totalPages,
          currentPage,
          totalCount,
          limit,
        },
      };
    } catch (error) {
      throw new Error("Error fetching coupons: " + error.message);
    }
  },

  async getCouponById(id) {
    if (!id) {
      throw new Error("missing coupon id");
    }

    const existing = await prisma.coupon.findUnique({
      where: {
        id,
      },
    });

    if (!existing) {
      throw new Error("Coupon Not found");
    }
    return existing;
  },

  async deleteCoupon(id) {
    if (!id) {
      throw new Error("missing coupon id");
    }

    const existing = await prisma.coupon.findUnique({
      where: {
        id,
      },
    });

    if (!existing) {
      throw new Error("Coupon Not found");
    }
    const result = await prisma.coupon.delete({
      where: { id },
    });
    return result;
  },

  async updateCoupon(data) {
    try {
      const {
        id,
        code,
        discountValue,
        validFrom,
        validTo,
        discountType,
        minCartValue,
        usageLimit,
      } = data;
      if (!id || !code || !discountValue || !discountType) {
        throw new Error("Missing fildes are required");
      }

      const slug = generateSlug(code);

      const existing = await prisma.coupon.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new Error("Coupon Not found");
      }

      const updatedCoupon = await prisma.coupon.update({
        where: { id },
        data: {
          code,
          discountType,
          discountValue,
          validFrom: validFrom ? new Date(validFrom) : null,
          validTo: validTo ? new Date(validTo) : null,
          couponSlug: slug,
          minCartValue: Number.parseFloat(minCartValue),
          usageLimit: Number.parseInt(usageLimit) || 0,
        },
      });

      return updatedCoupon;
    } catch (error) {
      throw new Error("Error updating coupon: " + error.message);
    }
  },

  
  async updateCouponStatus(id) {
    try {
      if (!id) {
        throw new Error("Missing coupon id");
      }

      const existing = await prisma.coupon.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new Error("Coupon Not found");
      }

      const updatedCoupon = await prisma.coupon.update({
        where: { id },
        data: {
          isActive: !existing.isActive,
        },
      });

      return updatedCoupon;
    } catch (error) {
      throw new Error("Error updating coupon status: " + error.message);
    }
  },
};

export default couponService;
