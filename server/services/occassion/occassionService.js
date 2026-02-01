import prisma from "../../config/prismaClient.js";
import { generateSlug } from "../../utils/autogenerateSlug.js";
import { paginate } from "../../utils/pagination.js";

const occassionService = {
  async getOccassion(query) {
    const { search } = query;
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
    const totalCount = await prisma.occasion.count({
      where: whereFilter,
    });

    const { page, limit, skip, totalPages, currentPage } = paginate(
      query,
      totalCount
    );
    const result = await prisma.occasion.findMany({
      where: whereFilter,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!result) {
      return {
        success: false,
        status: 404,
        message: "Occassion not found",
      };
    }
    return {
      result,
      pagination: { page, limit, skip, totalPages, currentPage },
    };
  },

  async getOccassionById(id) {
    if (!id) {
      throw {
        status: 400,
        message: "Id is required",
      };
    }
    const occasion = await prisma.occasion.findUnique({
      where: { id },
    });
    if (!occasion) {
      throw {
        status: 404,
        message: "Occasion not found",
      };
    }
    return {
      success: true,
      status: 200,
      data: occasion,
    };
  },

  async createOccassion({ name, description, image }) {
    if (!name) {
      throw {
        message: "Please provide all the required fields",
      };
    }

    const formattedName = name.trim().toUpperCase();

    const slug = generateSlug(name);

    const existing = await prisma.occasion.findUnique({
      where: { occasionSlug: slug },
    });
    if (existing) {
      throw {
        status: 409,
        message: "Occassion already exist",
      };
    }
    const result = await prisma.occasion.create({
      data: {
        name: formattedName,
        description,
        occasionSlug: slug,
        imageUrl: image[0]?.url,
      },
    });
    return result;
  },

  async updateOccassion({ id, name, description, image }) {
    if (!id || !name) {
      throw {
        message: "Please provide all the required fields",
      };
    }

    const formattedName = name.trim().toUpperCase();

    const slug = generateSlug(name);

    const existing = await prisma.occasion.findUnique({
      where: { id },
    });
    if (!existing) {
      throw {
        message: "Occassion not exist",
      };
    }
    const result = await prisma.occasion.update({
      where: { id },
      data: {
        name: formattedName,
        description,
        occasionSlug: slug,
        imageUrl: image[0]?.url,
      },
    });

    return result;
  },

  async deleteOccassion(id) {
    if (!id) {
      throw {
        message: "Please provide all the required fields",
      };
    }
    const existing = await prisma.occasion.findUnique({
      where: { id },
    });
    if (!existing) {
      throw {
        message: "Occassion not exist",
      };
    }
    const result = await prisma.occasion.delete({
      where: { id },
    });

    return result;
  },

  //active/inactive..................

  async toggleOccassion(id) {
    if (!id) {
      throw {
        message: "Please provide all the required fields",
      };
    }
    const existing = await prisma.occasion.findUnique({
      where: { id },
    });
    if (!existing) {
      throw {
        message: "Occassion not exist",
      };
    }
    const result = await prisma.occasion.update({
      where: { id },
      data: { isActive: !existing.isActive },
    });

    return result;
  },
};
export default occassionService;
