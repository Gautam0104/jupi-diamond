import prisma from "../../config/prismaClient.js";
import { calculateFinalProductCost } from "../../helper/productPriceCalculation.js";
import { generateSlug } from "../../utils/autogenerateSlug.js";
import { calculateProductPricing } from "../../utils/metalPriceProductRecalculate.js";
import { paginate } from "../../utils/pagination.js";

const metalVariantService = {
  async getMetalVariant(query) {
    try {
      const { search } = query;
      let whereFilter = {};

      if (search !== null && search !== undefined && search !== "") {
        whereFilter = {
          ...whereFilter,
          OR: [{ purityLabel: { contains: search, mode: "insensitive" } }],
        };
      }

      const totalCount = await prisma.metalVariant.count({
        where: whereFilter,
      });

      const { page, limit, skip, totalPages, currentPage } = paginate(
        query,
        totalCount
      );

      const metalVariant = await prisma.metalVariant.findMany({
        where: whereFilter,
        include: {
          MetalColorVariant: {
            select: {
              metalColor: {
                select: {
                  name: true,
                },
              },
            },
          },
          metalType: true,
          productVariants: true,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!metalVariant) {
        throw { statusCode: 404, message: "Metal Variant not found" };
      }
      return {
        metalVariant,
        pagination: { page, limit, totalPages, currentPage, totalCount },
      };
    } catch (error) {
      throw error;
    }
  },

  async getMetalVariantById(id) {
    if (!id) {
      throw { message: "MetalVariant id not exist" };
    }

    const metalVariantById = await prisma.metalVariant.findFirst({
      where: { id },
    });

    if (!metalVariantById) {
      throw { message: "Metal not found" };
    }
    return metalVariantById;
  },

  async fetchMetalHistory(id, query) {
    try {
      const { search } = query;
      let whereFilter = { metalVariantId: id };

      if (search !== "" && search !== undefined) {
        whereFilter = {
          ...whereFilter,
          OR: [
            { purityLabel: { contains: search, mode: "insensitive" } },
            {
              metalPriceInGram: parseFloat(search),
            },
          ],
        };
      }

      if (!id) {
        throw { statusCode: 404, message: "MetalVariant id is required!" };
      }

      const totalCount = await prisma.metalVariantHistory.count({
        where: whereFilter,
      });

      console.log("totalCount=", totalCount);

      const { page, limit, skip, totalPages, currentPage } = paginate(
        query,
        totalCount
      );

      const metalVariantHistory = await prisma.metalVariantHistory.findMany({
        where: whereFilter,

        include: {
          updatedBy: {
            select: {
              name: true,
            },
          },
          metalVariant: {
            select: {
              metalType: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          updatedAt: "desc",
        },
      });

      if (!metalVariantHistory) {
        throw { message: "Metal not found" };
      }
      return {
        metalVariantHistory,
        pagination: { page, limit, totalPages, currentPage, totalCount },
      };
    } catch (error) {
      throw new Error("Something went wrong " + error.message);
    }
  },

  async createMetalVariant({
    metalTypeId,
    purityLabel,
    metalPriceInGram,
    byBackPrice,
  }) {
    if (
      !metalTypeId ||
      !purityLabel?.trim() ||
      typeof metalPriceInGram !== "number" ||
      metalPriceInGram <= 0
    ) {
      throw {
        statusCode: 400,
        message: "Provide all the required fields with valid values",
      };
    }

    const metalTypeExists = await prisma.metalType.findUnique({
      where: { id: metalTypeId },
    });

    if (!metalTypeExists) {
      throw { statusCode: 404, message: "MetalType not found" };
    }

    const normalizedPurityLabel = purityLabel
      .trim()
      .toUpperCase()
      .replace(/\s+/g, "");

    const existingMetalVariant = await prisma.metalVariant.findFirst({
      where: {
        metalTypeId,
        purityLabel: normalizedPurityLabel,
      },
    });

    if (existingMetalVariant) {
      throw { statusCode: 409, message: "Metal variant already exists" };
    }

    const generateMetalVariantSlug = generateSlug(
      `${metalTypeExists.name}-${normalizedPurityLabel}-${metalPriceInGram}`
    );

    const newMetalVariant = await prisma.metalVariant.create({
      data: {
        metalVariantSlug: generateMetalVariantSlug,
        metalTypeId,
        purityLabel: normalizedPurityLabel,
        metalPriceInGram: Number.parseFloat(metalPriceInGram),
        byBackPrice: Number.parseFloat(byBackPrice || 0),
      },
    });

    return newMetalVariant;
  },

  async updateMetalVariant({
    id,
    metalTypeId,
    purityLabel,
    metalPriceInGram,
    metalVariantSlug,
    byBackPrice,
    staffId,
  }) {
    try {
      if (!metalTypeId || !purityLabel || !metalPriceInGram) {
        throw { statusCode: 400, message: "Provide all required fields" };
      }

      const [metalTypeExists, findMetalVariant] = await Promise.all([
        prisma.metalType.findUnique({ where: { id: metalTypeId } }),
        prisma.metalVariant.findUnique({ where: { id } }),
      ]);

      // Save to history before updating
      await prisma.metalVariantHistory.create({
        data: {
          metalVariantId: findMetalVariant.id,
          metalTypeId: findMetalVariant.metalTypeId,
          purityLabel: findMetalVariant.purityLabel,
          metalPriceInGram: Number(findMetalVariant.metalPriceInGram),
          byBackPrice: Number(findMetalVariant.byBackPrice) || 0,
          staffId: staffId,
        },
      });

      if (!metalTypeExists)
        throw { statusCode: 404, message: "MetalType not found" };
      if (!findMetalVariant)
        throw { statusCode: 404, message: "MetalVariant not found" };

      const priceChanged =
        Number(metalPriceInGram) !== Number(findMetalVariant.metalPriceInGram);

      const updatedSlug = generateSlug(
        `${metalTypeExists.name}-${purityLabel}-${metalPriceInGram}`
      );

      const updatedMetalVariant = await prisma.metalVariant.update({
        where: { id },
        data: {
          metalTypeId,
          purityLabel,
          metalPriceInGram,
          metalVariantSlug: updatedSlug,
          byBackPrice: Number.parseFloat(byBackPrice),
        },
      });

      if (!priceChanged) {
        // ✅ Metal price didn't change, skip price recalculations
        return updatedMetalVariant;
      }

      // ✅ Price changed → Update all affected product variants
      const relatedVariants = await prisma.productVariant.findMany({
        where: { metalVariantId: id },
        include: {
          gemstoneVariant: true,
          MakingChargeWeightRange: true,
          GlobalDiscount: true,
        },
      });

      console.log("relatedVariants=", relatedVariants);

      await Promise.all(
        relatedVariants.map((variant) => {
          const metalVariant = { metalPriceInGram };
          const { final, finalWithGst } = calculateFinalProductCost(
            variant,
            metalVariant,
            variant.gemstoneVariant,
            variant.MakingChargeWeightRange
          );

          return prisma.productVariant.update({
            where: { id: variant.id },
            data: {
              sellingPrice: final,
              finalPrice: finalWithGst,
            },
          });
        })
      );

      return updatedMetalVariant;
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong " + error.message);
    }
  },

  async deleteMetalVariantById(id) {
    if (!id) {
      throw {
        statusCode: 404,
        message: "id not exist of MetalVariant",
      };
    }

    const existing = await prisma.metalVariant.findFirst({
      where: { id },
    });

    if (!existing) {
      throw {
        statusCode: 404,
        message: "colorvariant not exist",
      };
    }

    const deleteVariant = await prisma.metalVariant.delete({
      where: { id },
    });
    console.log(deleteVariant);

    return deleteVariant;
  },
};

export default metalVariantService;
