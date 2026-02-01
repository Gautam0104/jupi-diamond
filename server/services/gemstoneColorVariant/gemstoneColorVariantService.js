import prisma from "../../config/prismaClient.js";

const gemstoneColorVariantService = {
  async getGemstoneColorVariant() {
    const existing = await prisma.gemstoneColorVariant.findMany();
    if (!existing) {
      throw { message: "Gemstonecolorvariant not exist" };
    }

    return existing;
  },

  async createGemstoneColorVariant({ gemstoneVariantId, gemstoneColorId }) {
    if (!gemstoneVariantId || !gemstoneColorId) {
      throw { message: "Please provide the required Fields" };
    }

    // Check if MetalVariant exists
    const gemstoneVariant = await prisma.gemstoneVariant.findUnique({
      where: { id: gemstoneVariantId },
    });

    if (!gemstoneVariant) {
      throw { status: 404, message: "Gmestone Variant not found" };
    }

    // Check if MetalColor exists
    const gemstoneColor = await prisma.gemstoneColor.findUnique({
      where: { id: gemstoneColorId },
    });

    if (!gemstoneColor) {
      throw { status: 404, message: "Gemstone Color not found" };
    }

    const existing = await prisma.gemstoneColorVariant.findFirst({
      where: {
        gemstoneVariantId,
        gemstoneColorId,
      },
    });

    if (existing) {
      throw {
        status: 409,
        message: "This GemstoneColorVariant already exists",
      };
    }

    const result = await prisma.gemstoneColorVariant.create({
      data: {
        gemstoneColorId,
        gemstoneVariantId,
      },
    });
    return result;
  },
  async getGemstoneColorVariantByUd(id) {
    if (!id) {
      throw { message: "GemstoneVariantColor id not exist" };
    }

    const gemstoneColorVariantById =
      await prisma.gemstoneColorVariant.findFirst({
        where: { id },
      });

    if (!gemstoneColorVariantById) {
      throw { message: "Gemstone not found" };
    }
    return gemstoneColorVariantById;
  },
  async deleteGemstoneColorVariantById(id) {
    if (!id) {
      throw {
        status: 404,
        message: "id not exist of gemstoneType",
      };
    }

    const existing = await prisma.gemstoneColorVariant.findFirst({
      where: { id },
    });

    if (!existing) {
      throw {
        status: 404,
        message: "Gemstone not exist",
      };
    }

    const deleteColorVariant = await prisma.gemstoneColorVariant.delete({
      where: { id },
    });
    console.log(deleteColorVariant);

    return deleteColorVariant;
  },

  async updateGemstoneColorVariant({ id, gemstoneVariantId, gemstoneColorId }) {
    if (!id || !gemstoneVariantId || !gemstoneColorId) {
      throw { message: "Please provide the required Fields" };
    }
    // Check if MetalVariant exists
    const gemstoneVariant = await prisma.gemstoneVariant.findUnique({
      where: { id: gemstoneVariantId },
    });

    if (!gemstoneVariant) {
      throw { status: 404, message: "Gmestone Variant not found" };
    }

    // Check if MetalColor exists
    const gemstoneColor = await prisma.gemstoneColor.findUnique({
      where: { id: gemstoneColorId },
    });

    if (!gemstoneColor) {
      throw { status: 404, message: "Gemstone Color not found" };
    }

    const existing = await prisma.gemstoneColorVariant.findFirst({
      where: { id, gemstoneVariantId, gemstoneColorId },
    });

    if (!existing) {
      throw {
        status: 409,
        message: "This GemstoneColorVariant not found",
      };
    }
    const result = await prisma.gemstoneColorVariant.update({
      where: { id },
      data: {
        gemstoneColorId,
        gemstoneVariantId,
      },
    });
    return result;
  },
};

export default gemstoneColorVariantService;
