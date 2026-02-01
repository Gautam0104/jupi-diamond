import prisma from "../../config/prismaClient.js";
import { generateSlug } from "../../utils/autogenerateSlug.js";
import { paginate } from "../../utils/pagination.js";

const makingWeightServices = {
  async createMakingChargeWeightRange(data) {
    try {
      const {
        makingChargeCategorySetId,
        metalVariantId,
        gemstoneVariantId,
        minWeight,
        maxWeight,
        chargeValue,
        chargeCategory,
        chargeType,
        discountType = null,
        discountValue = null,
      } = data;
      if (
        !makingChargeCategorySetId ||
        !chargeType ||
        !metalVariantId ||
        !chargeValue
      ) {
        throw {
          message: "Please provide all the fields",
        };
      }

      const metalVariant = await prisma.metalVariant.findUnique({
        where: { id: metalVariantId },
      });
      if (!metalVariant) {
        throw new Error("Invalid metalVariantId");
      }

      if (gemstoneVariantId) {
        const gemstoneVariant = await prisma.gemstoneVariant.findUnique({
          where: { id: gemstoneVariantId },
        });
        if (!gemstoneVariant) {
          throw new Error("Invalid gemstoneVariantId");
        }
      }

      const slug = generateSlug(
        `${metalVariant.metalVariantSlug}-${chargeCategory}-${chargeType}`
      );

      // const existing = await prisma.makingChargeWeightRange.findFirst({
      //   where: {
      //     globalMakingChargeSlug: slug,
      //     chargeCategory,
      //     chargeType,
      //     metalVariantId,
      //     gemstoneVariantId,
      //     minWeight: Number.parseFloat(minWeight),
      //     maxWeight: Number.parseFloat(maxWeight),
      //   },
      // });

      const existing = await prisma.makingChargeWeightRange.findFirst({
        where: {
          AND: [
            { makingChargeCategorySetId },
            { chargeCategory },
            { chargeType },
            { metalVariantId },
            { gemstoneVariantId: gemstoneVariantId || null },
            { minWeight: Number.parseFloat(minWeight) },
            { maxWeight: Number.parseFloat(maxWeight) },
          ],
        },
      });

      // console.log("Existing Making Charge:", existing);

      if (existing) {
        throw new Error("Similar making charge already exists.");
      }

      const makingCharge = await prisma.makingChargeWeightRange.create({
        data: {
          makingChargeCategorySetId,
          globalMakingChargeSlug: slug,
          chargeCategory,
          chargeType,
          metalVariantId,
          gemstoneVariantId,
          minWeight: Number.parseFloat(minWeight),
          maxWeight: Number.parseFloat(maxWeight),
          chargeValue: Number.parseFloat(chargeValue),
          discountType,
          discountValue: Number.parseFloat(discountValue),
        },
      });

      return makingCharge;
    } catch (error) {
      console.log(error);
      throw new Error(
        error.message || "Error creating making charge weight range"
      );
    }
  },

  async getAllMakingChargeWeightRanges(query) {
    try {
      const {
        search,
        weight,
        minWeight,
        maxWeight,
        chargeType,
        chargeCategory,
        metalVariantId,
        gemstoneVariantId,
        makingChargeCategorySetId,
      } = query;
      let whereFilter = {};

      //search.............................................
      // if (search !== null && search !== undefined && search !== "") {
      //   whereFilter = {
      //     ...whereFilter,
      //     OR: [{ chargeCategory: { contains: search, mode: "insensitive" } }],
      //   };
      // }

      if (weight !== null && weight !== undefined && weight !== "") {
        const weightValue = Number.parseFloat(weight);
        whereFilter = {
          ...whereFilter,
          minWeight: { lte: weightValue },
          maxWeight: { gte: weightValue },
        };
      }

      //weight range filter......................................
      if (
        minWeight !== null &&
        minWeight !== "" &&
        minWeight !== undefined &&
        maxWeight !== null &&
        maxWeight !== undefined &&
        maxWeight !== ""
      ) {
        whereFilter = {
          ...whereFilter,
          minWeight: { gte: Number.parseFloat(minWeight) },
          maxWeight: { lte: Number.parseFloat(maxWeight) },
        };
      } else if (
        minWeight !== undefined &&
        minWeight !== null &&
        minWeight !== ""
      ) {
        whereFilter = {
          ...whereFilter,
          minWeight: { gte: Number.parseFloat(minWeight) },
        };
      } else if (
        maxWeight !== null &&
        maxWeight !== undefined &&
        maxWeight !== ""
      ) {
        whereFilter = {
          ...whereFilter,
          maxWeight: { lte: Number.parseFloat(maxWeight) },
        };
      }

      //chargeType wise filter.......................
      if (
        (chargeType === "FIXED" ||
          chargeType === "PERCENTAGE" ||
          chargeType === "PER_GRAM_WEIGHT") &&
        chargeType !== undefined &&
        chargeType !== ""
      ) {
        whereFilter = {
          ...whereFilter,
          chargeType: chargeType,
        };
      }
      //chargeCategory wise filter.......................
      if (
        chargeCategory !== null &&
        chargeCategory !== undefined &&
        chargeCategory !== ""
      ) {
        whereFilter = {
          ...whereFilter,
          chargeCategory: chargeCategory,
        };
      }

      //metalVariantId wise filter.......................
      if (
        metalVariantId !== null &&
        metalVariantId !== undefined &&
        metalVariantId !== ""
      ) {
        whereFilter = {
          ...whereFilter,
          metalVariantId: metalVariantId,
        };
      }

      //gemstoneVariantId wise filter.......................
      if (
        gemstoneVariantId !== null &&
        gemstoneVariantId !== undefined &&
        gemstoneVariantId !== ""
      ) {
        whereFilter = {
          ...whereFilter,
          gemstoneVariantId: gemstoneVariantId,
        };
      }

      //makingChargeCategorySetId wise filter.......................
      if (
        makingChargeCategorySetId !== null &&
        makingChargeCategorySetId !== undefined &&
        makingChargeCategorySetId !== ""
      ) {
        whereFilter = {
          ...whereFilter,
          makingChargeCategorySetId: makingChargeCategorySetId,
        };
      }

      const totalCount = await prisma.makingChargeWeightRange.count({
        where: whereFilter,
      });

      const { page, limit, skip, totalPages, currentPage } = paginate(
        query,
        totalCount
      );

      const makingCharges = await prisma.makingChargeWeightRange.findMany({
        where: whereFilter,
        skip,
        take: limit,
        include: {
          metalVariant: {
            include: {
              metalType: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          gemstoneVariant: {
            include: {
              gemstoneType: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          MakingChargeCategorySet: true,
        },
      });

      if (!makingCharges || makingCharges.length === 0) {
        throw new Error("No making charge weight ranges found");
      }

      return {
        makingCharges,
        pagination: { page, limit, skip, totalPages, currentPage },
      };
    } catch (error) {
      console.log(error);
      throw new Error(
        error.message || "Error fetching making charge weight ranges"
      );
    }
  },

  async getSingleMakingChargeWeightRange(id) {
    if (!id) {
      throw new Error("Please provide a valid ID");
    }

    const makingCharge = await prisma.makingChargeWeightRange.findUnique({
      where: { id },
      include: {
        metalVariant: true,
        gemstoneVariant: true,
        MakingChargeCategorySet: true,
      },
    });

    if (!makingCharge) {
      throw new Error("Making charge weight range not found");
    }

    return makingCharge;
  },

  async updateMakingChargeWeightRange(id, data) {
    const {
      makingChargeCategorySetId,
      metalVariantId,
      globalMakingChargeSlug,
      gemstoneVariantId,
      minWeight,
      maxWeight,
      chargeValue,
      chargeCategory,
      chargeType,
      discountType = null,
      discountValue = null,
    } = data;

    if (
      !id ||
      !chargeCategory ||
      !chargeType ||
      !metalVariantId ||
      !chargeValue
    ) {
      throw {
        message: "Please provide all the fields",
      };
    }

    const metalVariant = await prisma.metalVariant.findUnique({
      where: { id: metalVariantId },
    });
    if (!metalVariant) {
      throw new Error("Invalid metalVariantId");
    }

    if (gemstoneVariantId) {
      const gemstoneVariant = await prisma.gemstoneVariant.findUnique({
        where: { id: gemstoneVariantId },
      });
      if (!gemstoneVariant) {
        throw new Error("Invalid gemstoneVariantId");
      }
    }

    const existingCharge = await prisma.makingChargeWeightRange.findFirst({
      where: { id },
    });

    if (!existingCharge) {
      throw new Error("Making charge not exists");
    }

    const updateCharge = await prisma.makingChargeWeightRange.update({
      where: { id },
      data: {
        makingChargeCategorySetId,
        metalVariantId,
        globalMakingChargeSlug,
        gemstoneVariantId,
        chargeCategory,
        chargeType,
        minWeight: Number.parseFloat(minWeight),
        maxWeight: Number.parseFloat(maxWeight),
        chargeValue: Number.parseFloat(chargeValue),
        discountType,
        discountValue: Number.parseFloat(discountValue),
      },
    });

    return updateCharge;
  },

  async deleteMakingChargeWeightRange(id) {
    if (!id) {
      throw new Error("Please provide a valid ID");
    }

    const existingCharge = await prisma.makingChargeWeightRange.findUnique({
      where: { id },
    });

    if (!existingCharge) {
      throw new Error("Making charge weight range not found");
    }

    return await prisma.makingChargeWeightRange.delete({
      where: { id },
    });
  },

  //fetch making weight by category set id.................
  async fetchMakingWeightByCategoryId(categoryId) {
    try {
      const result = await prisma.makingChargeWeightRange.findMany({
        where: {
          makingChargeCategorySetId: categoryId,
        },
        include: {
          metalVariant: true,
          gemstoneVariant: true,
        },
      });
      return result;
    } catch (err) {
      throw new Error("Error fetching making charge weight ranges");
    }
  },

  async updateMakingChargeWeightRangeStatus(id) {
    if (!id) {
      throw {
        message: "Please provide a valid ID",
      };
    }

    const existingCharge = await prisma.makingChargeWeightRange.findFirst({
      where: { id },
    });

    if (!existingCharge) {
      throw new Error("Making charge not exists");
    }

    const updateCharge = await prisma.makingChargeWeightRange.update({
      where: { id },
      data: {
        isActive: !existingCharge.isActive,
      },
    });

    return updateCharge;
  },
};

export default makingWeightServices;
