import prisma from "../../config/prismaClient.js";
import { generateSlug } from "../../utils/autogenerateSlug.js";
import { paginate } from "../../utils/pagination.js";

const productStyleService = {
  async getProductStyle(query) {
    const { search, jewelryTypeId } = query;
    let whereFilter = {};
    if (search !== undefined && search !== "") {
      whereFilter = {
        OR: [
          {
            name: {
              contains: query.search,
              mode: "insensitive",
            },
          },
        ],
      };
    }
    if (jewelryTypeId !== undefined && jewelryTypeId !== "") {
      whereFilter = {
        ...whereFilter,
        jewelryType: {
          id: jewelryTypeId,
        },
      };
    }
    const totalCount = await prisma.productStyle.count({
      where: whereFilter,
    });

    const { page, limit, skip, totalPages, currentPage } = paginate(
      query,
      totalCount
    );

    const result = await prisma.productStyle.findMany({
      where: whereFilter,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    if (!result) {
      throw {
        success: false,
        status: 404,
        message: "ProductStyle Size not found",
      };
    }
    return {
      result,
      pagination: { page, limit, skip, totalPages, totalCount, currentPage },
    };
  },

  async getProductStyleById(id) {
    if (!id) {
      throw { message: "Please provide ProductStyle id," };
    }

    const existing = await prisma.productStyle.findUnique({
      where: { id },
    });

    if (!existing) {
      throw {
        status: 404,
        message: "ProductStyle not found",
      };
    }

    return existing;
  },

  async createProductStyle({ name, description, jewelryTypeId, image }) {
    if (!name) {
      throw {
        message: "Please provide all the required field",
      };
    }

    const slug = generateSlug(name);
    const existing = await prisma.productStyle.findFirst({
      where: { productStyleSlug: slug },
    });

    if (existing) {
      throw {
        message: "Product style already exist",
      };
    }
    const result = await prisma.productStyle.create({
      data: {
        name,
        description,
        productStyleSlug: slug,
        jewelryType: {
          connect: {
            id: jewelryTypeId,
          },
        },
        imageUrl: image[0]?.url,
      },
    });

    return result;
  },

  async updateProductStyle({ id, name, description, jewelryTypeId, image }) {
    if (!id || !name) {
      throw {
        message: "Please provide all the required field",
      };
    }

    const slug = generateSlug(name);

    const existing = await prisma.productStyle.findUnique({
      where: { id },
    });

    if (!existing) {
      throw {
        message: "Product style not found",
      };
    }

    const result = await prisma.productStyle.update({
      where: { id },
      data: {
        name,
        description,
        productStyleSlug: slug,
        jewelryType: {
          connect: {
            id: jewelryTypeId,
          },
        },
        imageUrl: image[0]?.url,
      },
    });

    return result;
  },

  async deleteProductStyle(id) {
    if (!id || typeof id !== "string") {
      throw {
        status: 404,
        message: "Please provide the required Fields",
      };
    }

    const existing = await prisma.productStyle.findUnique({
      where: { id },
    });

    if (!existing) {
      throw {
        message: "Product style not Found",
      };
    }

    const result = await prisma.productStyle.delete({
      where: { id },
    });

    return result;
  },

  async toggleProductStyle(id) {
    if (!id) {
      throw {
        status: 404,
        message: "Please provide the required Fields",
      };
    }

    const existing = await prisma.productStyle.findUnique({
      where: { id },
    });

    if (!existing) {
      throw {
        message: "Product style not Found",
      };
    }

    const result = await prisma.productStyle.update({
      where: { id },
      data: {
        isActive: !existing.isActive,
      },
    });

    return result;
  },
};

export default productStyleService;
