import prisma from "../../config/prismaClient.js";

const productVariantImageService = {
  async getproductVariantImage() {
    const result = await prisma.productVariantImage.findMany();

    if (!result) {
      throw {
        status: 404,
        message: "ProductVariant Image not found",
      };
    }
    return result;
  },

  async getproductVariantImageById(id) {
    if (!id) {
      throw {
        status: 404,
        message: "Id not found",
      };
    }
    const existing = await prisma.poductVariantImage.findUnique({
      where: { id },
    });
    if (!existing) {
      throw {
        status: 404,
        message: "ProductVariant Image not found",
      };
    }
    return existing;
  },

  async createProductVariantImage({
    imageUrl,
    productVariantId,
    metalColorVariantId,
    gemstoneColorVariantId,
  }) {
    if (
      !imageUrl ||
      !productVariantId ||
      !metalColorVariantId ||
      !gemstoneColorVariantId
    ) {
      throw {
        message: "Please provide all the required fields",
      };
    }

    const findProductVariantId = await prisma.productVariant.findUnique({
      where: { id: productVariantId },
    });
    if (!findProductVariantId) {
      throw {
        message: "Product variant not found",
      };
    }
    const findMetalColorVariantId = await prisma.metalColorVariant.findUnique({
      where: { id: metalColorVariantId },
    });
    if (!findMetalColorVariantId) {
      throw {
        message: "MetalColorVariantId not found",
      };
    }
    const findGemstoneColorVariantId =
      await prisma.gemstoneColorVariant.findUnique({
        where: { id: gemstoneColorVariantId },
      });
    if (!findGemstoneColorVariantId) {
      throw {
        message: "gemstoneColorVariantId not found",
      };
    }

    const existing = await prisma.productVariantImage.findFirst({
      where: {
        productVariantId,
        metalColorVariantId,
        gemstoneColorVariantId,
      },
    });

    if (existing) {
      throw {
        status: 409,
        message: "ProductVariantImage already exist",
      };
    }
    const result = await prisma.productVariantImage.create({
      data: {
        imageUrl,
        productVariantId,
        metalColorVariantId,
        gemstoneColorVariantId,
      },
    });
    return result;
  },

  async updateProductVariantImage({
    id,
    imageUrl,
    productVariantId,
    metalColorVariantId,
    gemstoneColorVariantId,
  }) {
    if (
      !id ||
      !imageUrl ||
      !productVariantId ||
      !metalColorVariantId ||
      !gemstoneColorVariantId
    ) {
      throw {
        message: "Please provide all the required fields",
      };
    }

    const findProductVariantId = await prisma.productVariant.findUnique({
      where: { id: productVariantId },
    });
    if (!findProductVariantId) {
      throw {
        message: "Product variant not found",
      };
    }
    const findMetalColorVariantId = await prisma.metalColorVariant.findUnique({
      where: { id: metalColorVariantId },
    });
    if (!findMetalColorVariantId) {
      throw {
        message: "MetalColorVariantId not found",
      };
    }
    const findGemstoneColorVariantId =
      await prisma.gemstoneColorVariant.findUnique({
        where: { id: gemstoneColorVariantId },
      });
    if (!findGemstoneColorVariantId) {
      throw {
        message: "gemstoneColorVariantId not found",
      };
    }

    const existing = await prisma.productVariantImage.findUnique({
      where: { id },
    });

    if (!existing) {
      throw {
        status: 404,
        message: "ProductVariant not found",
      };
    }

    const result = await prisma.productVariantImage.update({
      where: { id },
      data: {
        imageUrl,
        productVariantId,
        metalColorVariantId,
        gemstoneColorVariantId,
      },
    });

    return result;
  },

  async deleteProductVariantImage(id) {
    if (!id) {
      throw {
        status: 404,
        message: "Id not found",
      };
    }
    const existing = await prisma.productVariantImage.findUnique({
      where: { id },
    });
    if (!existing) {
      throw {
        status: 404,
        message: "ProductVariantImage not found",
      };
    }

    const result = await prisma.productVariantImage.delete({
      where: { id },
    });

    return result;
  },
};
export default productVariantImageService;
