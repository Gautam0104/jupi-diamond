import prisma from "../../config/prismaClient.js";
import { generateSlug } from "../../utils/autogenerateSlug.js";
import { paginate } from "../../utils/pagination.js";

const jewelryTypeService = {
  async getJewelryTypeService(query) {
    const { search } = query;
    let whereFilter = {};
    //searching................
    if (search !== undefined && search !== "") {
      whereFilter = {
        ...whereFilter,
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      };
    }

    const totalCount = await prisma.jewelryType.count({
      where: whereFilter,
    });

    const { page, limit, skip, totalPages, currentPage } = paginate(
      query,
      totalCount
    );

    const jewelryType = await prisma.jewelryType.findMany({
      where: whereFilter,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!jewelryType) {
      throw new Error({ status: 404, message: "JwelryType not found" });
    }
    return {
      jewelryType,
      pagination: { page, limit, skip, totalPages, currentPage, totalCount },
    };
  },

  //Public api service.....................................
  async getJewelryTypePublicService() {
    const jewelryType = await prisma.jewelryType.findMany();
    if (!jewelryType) {
      throw new Error({ status: 404, message: "Jewelry Type not found" });
    }
    return jewelryType;
  },

  async jewelryTypeGetByIdService(id) {
    if (!id) {
      throw new Error({ status: 404, message: "JwelryType not found" });
    }
    const jewelryTypeFindById = await prisma.jewelryType.findUnique({
      where: {
        id,
      },
    });

    if (!jewelryTypeFindById) {
      throw {
        status: 404,
        message: "JwelryType not found",
      };
    }

    return jewelryTypeFindById;
  },

  async createJewelry({ name, image }) {
    console.log(name);
    if (!name) {
      throw new Error("Name field is required");
    }
    const slug = generateSlug(name);

    const existing = await prisma.jewelryType.findUnique({
      where: { jewelryTypeSlug: slug },
    });

    if (existing) {
      throw new Error("JewelryType already exists");
    }

    const create = await prisma.jewelryType.create({
      data: {
        name,
        jewelryTypeSlug: slug,
        imageUrl: image[0]?.url,
      },
    });
    return create;
  },

  async jewlryTypeUpdateService({ id, name, image }) {
    console.log(name);
    console.log(id);

    if (!name || !id) {
      throw {
        status: 404,
        message: "All the filds are requred",
      };
    }

    const existingJewlry = await prisma.jewelryType.findFirst({
      where: { id },
    });

    if (!existingJewlry) {
      throw {
        status: 404,
        message: "Metal Not exist",
      };
    }

    const slug = generateSlug(name);
    const newJewelryType = await prisma.jewelryType.update({
      where: { id },
      data: {
        name,
        jewelryTypeSlug: slug,
        imageUrl: image[0]?.url,
      },
    });

    return newJewelryType;
  },

  async jewelryTypeDeleteService({ id }) {
    if (!id) {
      throw { message: "Id doesn't match" };
    }

    const existing = await prisma.jewelryType.findFirst({
      where: { id },
    });

    if (!existing) {
      throw {
        status: 404,
        message: "Jewelry type not exist",
      };
    }

    const deletedJewelryType = await prisma.jewelryType.delete({
      where: { id },
    });
    console.log(deletedJewelryType);

    return deletedJewelryType;
  },

  async jewelryTypeToggleService({ id }) {
    const existing = await prisma.jewelryType.findFirst({
      where: { id },
    });

    if (!existing) {
      throw {
        status: 404,
        message: "Jewelry type not exist",
      };
    }

    const toggleStatus = await prisma.jewelryType.update({
      where: { id },
      data: {
        isActive: !existing.isActive,
      },
    });

    return toggleStatus;
  },
};

export default jewelryTypeService;
