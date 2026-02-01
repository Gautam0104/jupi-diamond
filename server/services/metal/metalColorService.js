import prisma from "../../config/prismaClient.js";
import { generateSlug } from "../../utils/autogenerateSlug.js";

const metalColorService = {
  async getMetalColor(query) {
    const { search } = query;
    let whereFilter = {};

    if (search !== null && search !== undefined && search !== "") {
      whereFilter = {
        ...whereFilter,
        OR: [{ name: { contains: search, mode: "insensitive" } }],
        OR: [{ metalColorSlug: { contains: search, mode: "insensitive" } }],
      };
    }

    const getMetalColor = await prisma.metalColor.findMany({
      where: whereFilter,
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!getMetalColor) {
      throw new Error({ message: "Metal color not find" });
    }
    return getMetalColor;
  },

  async getByIdMetalColor(id) {
    if (!id) {
      throw { status: 400, message: "MetalColor ID is required" };
    }

    const metalColorFindById = await prisma.metalColor.findUnique({
      where: {
        id,
      },
    });

    if (!metalColorFindById) {
      throw {
        status: 404,
        message: "MetalColor not found",
      };
    }

    return metalColorFindById;
  },

  async createMetalColor(name, metalColorSlug) {
    if (!name) {
      throw { status: 400, message: "Please provide all the required fields" };
    }

    const existingMetalColor = await prisma.metalColor.findUnique({
      where: {
        name,
        metalColorSlug,
      },
    });

    if (existingMetalColor) {
      throw { status: 409, message: "Metal Color already exists" };
    }

    const generateMetalColorSlug = generateSlug(name);

    const metalColor = await prisma.metalColor.create({
      data: {
        name,
        metalColorSlug: generateMetalColorSlug,
      },
    });

    return metalColor;
  },

  async deleteMetalColor(id) {
    if (!id) {
      throw { message: "metalColor id Not exist" };
    }

    const getMetalColorId = await prisma.metalColor.findFirst({
      where: {
        id,
      },
    });

    if (!getMetalColorId) {
      throw { message: "MetalColor id not found" };
    }

    const deletedMetalColor = await prisma.metalColor.delete({
      where: {
        id,
      },
    });
    return deletedMetalColor;
  },

  async updateMetalColor({ id, name }) {
    if (!id || !name) {
      throw { status: 400, message: "Please provide all required fields" };
    }

    const existingMetalColor = await prisma.metalColor.findUnique({
      where: {
        id,
      },
    });

    if (!existingMetalColor) {
      throw { status: 404, message: "MetalColor not found" };
    }
    const updatedSlug = generateSlug(name);

    const updatedMetalColor = await prisma.metalColor.update({
      where: { id },
      data: { name, metalColorSlug: updatedSlug },
    });

    return updatedMetalColor;
  },
};

export default metalColorService;
