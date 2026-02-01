import prisma from "../../config/prismaClient.js";
import { calculateFinalProductCost } from "../../helper/productPriceCalculation.js";
import { generateSlug } from "../../utils/autogenerateSlug.js";
import { handlePrismaError } from "../../utils/handlePrismaError.js";
import { calculateProductPricing } from "../../utils/metalPriceProductRecalculate.js";
import { paginate } from "../../utils/pagination.js";

const gemstoneVariantService = {
  async getGemstoneVariant(query) {
    const { search } = query;
    let whereFilter = {};

    if (search !== null && search !== undefined && search !== "") {
      whereFilter = {
        ...whereFilter,
        OR: [{ clarity: { contains: search, mode: "insensitive" } }],
        OR: [
          { gemstoneVariantSlug: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    const totalCount = await prisma.gemstoneVariant.count({
      where: whereFilter,
    });
    const { page, limit, skip, totalPages, currentPage } = paginate(
      query,
      totalCount
    );

    const gemstoneVariant = await prisma.gemstoneVariant.findMany({
      where: whereFilter,
      skip,
      take: limit,
      include: {
        gemstoneType: {
          select: {
            id: true,
            name: true,
            gemstoneTypeSlug: true,
          },
        },
        // GemstoneColorVariant: {
        //   select: {
        //     id: true,
        //     gemstoneColor: true,
        //   },
        // },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!gemstoneVariant) {
      throw { status: 404, message: "Gemstone Variant not found" };
    }

    return {
      gemstoneVariant,
      pagination: { page, limit, skip, totalPages, currentPage, totalCount },
    };
  },

  async getGemstoneVariantById(id) {
    if (!id) {
      throw { message: "GemstoneVariant id not exist" };
    }

    const gemstoneVariantById = await prisma.gemstoneVariant.findFirst({
      where: { id },
      include: {
        // GemstoneColorVariant: true,
        MakingChargeWeightRange: true,
        gemstoneType: true,
      },
    });

    if (!gemstoneVariantById) {
      throw { message: "Gmestone not found" };
    }
    return gemstoneVariantById;
  },

  async createGemstoneVariant({
    gemstoneTypeId,
    clarity,
    cut,
    color,
    shape,
    gemstonePrice,
    height,
    width,
    depth,
    origin,
    certification,
    certificateNumber,
    image,
    certificateUrl,
  }) {
    try {
      if (!gemstoneTypeId || !clarity || !cut || !gemstonePrice || !origin) {
        throw { status: 400, message: "provide all the required fields" };
      }

      const existing = await prisma.gemstoneType.findUnique({
        where: { id: gemstoneTypeId },
      });
      console.log("origin=", origin);

      if (!existing) {
        throw { status: 404, message: "Gemstone Type not found" };
      }

      const existingGemstoneVariant = await prisma.gemstoneVariant.findFirst({
        where: {
          gemstoneTypeId,
          clarity,
          color,
          origin,
          gemstonePrice,
        },
      });
      console.log("existingGemstoneVariant=", existingGemstoneVariant);
      if (existingGemstoneVariant) {
        throw {
          status: 409,
          message: `Gemstone variant with clarity ${clarity}, origin ${origin}, color ${color} and price ${gemstonePrice} already exists for this gemstone type`,
        };
      }

      const slug = generateSlug(
        `${existing.name}-${clarity}-${cut}-${color}-${gemstonePrice}`
      );

      const newGemstoneVariant = await prisma.gemstoneVariant.create({
        data: {
          gemstoneTypeId,
          clarity,
          cut,
          color,
          shape,
          gemstonePrice: Number.parseFloat(gemstonePrice),
          gemstoneVariantSlug: slug,
          height: Number.parseFloat(height),
          width: Number.parseFloat(width),
          depth: Number.parseFloat(depth),
          origin,
          certification,
          certificateNumber,
          imageUrl: image[0]?.url,
          certificateUrl,
        },
      });
      return newGemstoneVariant;
    } catch (error) {
      throw error;
    }
  },

  async updateGemstoneVariant({
    id,
    gemstoneTypeId,
    clarity,
    cut,
    color,
    shape,
    gemstonePrice,
    height,
    width,
    depth,
    origin,
    certification,
    certificateNumber,
    imageUrl,
    certificateUrl,
    staffId,
  }) {
    try {
      if (!gemstoneTypeId || !clarity || !cut || !gemstonePrice) {
        throw { statusCode: 400, message: "Provide all required fields" };
      }

      const [gemstoneType, existingVariant] = await Promise.all([
        prisma.gemstoneType.findUnique({ where: { id: gemstoneTypeId } }),
        prisma.gemstoneVariant.findUnique({ where: { id } }),
      ]);

      if (!gemstoneType)
        throw { statusCode: 404, message: "GemstoneType not found" };
      if (!existingVariant)
        throw { statusCode: 404, message: "GemstoneVariant not found" };

      const priceChanged =
        Number(gemstonePrice) !== Number(existingVariant.gemstonePrice);

      const slug = generateSlug(
        `${gemstoneType.name}-${clarity}-${cut}-${color}-${gemstonePrice}`
      );

      const updatedGemstoneVariant = await prisma.gemstoneVariant.update({
        where: { id },
        data: {
          gemstoneTypeId,
          clarity,
          cut,
          color,
          shape,
          gemstonePrice: Number.parseFloat(gemstonePrice),
          gemstoneVariantSlug: slug,
          height: Number.parseFloat(height),
          width: Number.parseFloat(width),
          depth: Number.parseFloat(depth),
          origin,
          certification,
          certificateNumber,
          imageUrl: imageUrl || existingVariant.imageUrl, // Use new URL or keep existing
          certificateUrl:
            certificateUrl !== undefined
              ? certificateUrl
              : existingVariant.certificateUrl,
        },
      });

      const result = await prisma.gemstoneHistory.create({
        data: {
          gemstoneVariantId: updatedGemstoneVariant.id,
          gemstoneTypeId: gemstoneTypeId,
          colorLabel: color, // assuming colorLabel = color
          clarityLabel: clarity, // assuming clarityLabel = clarity
          gemstonePriceInCarat: Number.parseFloat(gemstonePrice),
          byBackPrice: 0, // Replace with actual value if available
          staffId: staffId,
          updatedAt: new Date(),
        },
      });

      if (!priceChanged) {
        // ✅ Gemstone price didn't change, skip recalculations
        return updatedGemstoneVariant;
      }

      // ✅ Price changed → Update all related productVariants
      const relatedVariants = await prisma.productVariant.findMany({
        where: { gemstoneVariantId: id },
        include: {
          metalVariant: true,
          gemstoneVariant: true,
          GlobalDiscount: true,
          MakingChargeWeightRange: true,
        },
      });

      await Promise.all(
        relatedVariants.map((variant) => {
          // const pricing = calculateProductPricing({
          //   metalPriceInGram: variant.metalVariant?.metalPriceInGram || 0,
          //   metalWeightInGram: variant.metalWeightInGram,
          //   gemstonePrice,
          //   gemstoneWeightInCarat: variant.gemstoneWeightInCarat,
          //   chargeRange: variant.MakingChargeWeightRange,
          //   gst: variant.gst || 0,
          // });
          const metalVariant = { gemstonePrice };
          const { final, finalWithGst } = calculateFinalProductCost(
            variant,
            variant.metalVariant,
            metalVariant,
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

      return updatedGemstoneVariant;
    } catch (error) {
      console.error("Gemstone update error:", error);
      // throw handlePrismaError(error);
      throw {
        statusCode: error.statusCode || 500,
        message: error.message || "Failed to update gemstone variant",
      };
    }
  },

  async fetchGemstoneHistory(id, query) {
    try {
      const { search } = query;
      let whereFilter = { gemstoneVariantId: id };

      if (!id) {
        throw { statusCode: 404, message: "GemstoneVariant id is required!" };
      }

      // Optional search filtering on clarityLabel, colorLabel, or gemstonePriceInCarat
      if (search !== "" && search !== undefined) {
        const searchFloat = parseFloat(search);
        whereFilter = {
          ...whereFilter,
          OR: [
            { clarityLabel: { contains: search, mode: "insensitive" } },
            { colorLabel: { contains: search, mode: "insensitive" } },
            ...(isNaN(searchFloat)
              ? []
              : [{ gemstonePriceInCarat: searchFloat }]),
          ],
        };
      }

      const totalCount = await prisma.gemstoneHistory.count({
        where: whereFilter,
      });

      const { page, limit, skip, totalPages, currentPage } = paginate(
        query,
        totalCount
      );

      const gemstoneHistory = await prisma.gemstoneHistory.findMany({
        where: whereFilter,
        include: {
          gemstoneVariant: {
            select: {
              gemstoneType: {
                select: {
                  name: true,
                },
              },
            },
          },
          updatedBy: {
            select: {
              name: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          updatedAt: "desc",
        },
      });

      if (!gemstoneHistory) {
        throw { message: "Gemstone history not found" };
      }

      return {
        gemstoneHistory,
        pagination: { page, limit, totalPages, currentPage, totalCount },
      };
    } catch (error) {
      throw new Error("Something went wrong: " + error.message);
    }
  },

  async deleteGemstoneVariantById(id) {
    if (!id) {
      throw {
        status: 404,
        message: "id not exist of GemstoneVariant",
      };
    }

    const existing = await prisma.gemstoneVariant.findFirst({
      where: { id },
    });

    if (!existing) {
      throw {
        status: 404,
        message: "gemstonevariant not exist",
      };
    }

    const deleteVariant = await prisma.gemstoneVariant.delete({
      where: { id },
    });
    console.log(deleteVariant);

    return deleteVariant;
  },
};

export default gemstoneVariantService;
