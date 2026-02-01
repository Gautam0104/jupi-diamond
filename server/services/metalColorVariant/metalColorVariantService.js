import prisma from "../../config/prismaClient.js";

const metalColorVariantService = {
  async getMetalColorVariant() {
    const existing = await prisma.metalColorVariant.findMany();
    if (!existing) {
      throw { message: "Metalcolorvariant not exist" };
    }

    return existing;
  },
  async createMetalColorVariant({ metalVariantId, metalColorId }) {
    if (!metalVariantId || !metalColorId) {
      throw { message: "Please provide the required Fields" };
    }
    // Check if MetalVariant exists
    const metalVariant = await prisma.metalVariant.findUnique({
      where: { id: metalVariantId },
    });

    if (!metalVariant) {
      throw { status: 404, message: "Metal Variant not found" };
    }
    // Check if MetalColor exists
    const metalColor = await prisma.metalColor.findUnique({
      where: { id: metalColorId },
    });

    if (!metalColor) {
      throw { status: 404, message: "Metal Color not found" };
    }

    const existing = await prisma.metalColorVariant.findFirst({
      where: {
        metalVariantId,
        metalColorId,
      },
    });

    if (existing) {
      throw { status: 409, message: "This MetalColorVariant already exists" };
    }

    const result = await prisma.metalColorVariant.create({
      data: {
        metalVariantId,
        metalColorId,
      },
    });
    return result;
  },

  async getMetalColorVariantByUd(id) {
    if (!id) {
      throw { message: "MetalVariantColor id not exist" };
    }

    const metalColorVariantById = await prisma.metalColorVariant.findFirst({
      where: { id },
    });

    if (!metalColorVariantById) {
      throw { message: "Metal not found" };
    }
    return metalColorVariantById;
  },
  async deleteMetalColorVariantById(id) {
    if (!id) {
      throw {
        status: 404,
        message: "id not exist of metalType",
      };
    }

    const existing = await prisma.metalColorVariant.findFirst({
      where: { id },
    });

    if (!existing) {
      throw {
        status: 404,
        message: "Metal not exist",
      };
    }

    const deleteColorVariant = await prisma.metalColorVariant.delete({
      where: { id },
    });
    console.log(deleteColorVariant);

    return deleteColorVariant;
  },
};

export default metalColorVariantService;
