import prisma from "../../config/prismaClient.js";
import { generateSlug } from "../../utils/autogenerateSlug.js";

const gemstonoeColorService = {
  async getColor() {
    const getGemstoneColor = await prisma.gemstoneColor.findMany();
    if (!getGemstoneColor) {
      throw new Error({ message: "Gemstone color not fetched" });
    }
    return getGemstoneColor;
  },

  async getGemstoneColorById(id) {
    if (!id) {
      throw { status: 400, message: "GemstoneColor ID is required" };
    }

    const gemstoneColorFindById = await prisma.gemstoneColor.findUnique({
      where: {
        id,
      },
    });

    if (!gemstoneColorFindById) {
      throw {
        status: 404,
        message: "GemstoneColor not found",
      };
    }

    return gemstoneColorFindById;
  },

  async createGemstoneColor(name, gemstoneColorSlug) {
    if (!name) {
      throw { status: 400, message: "Please provide all the required fields" };
    }

    const existing = await prisma.gemstoneColor.findUnique({
      where: {
        name,
        gemstoneColorSlug,
      },
    });

    if (existing) {
      throw { status: 409, message: "Gemstone Color already exists" };
    }

    const slug = generateSlug(name);

    const gemstoneColor = await prisma.gemstoneColor.create({
      data: {
        name,
        gemstoneColorSlug: slug,
      },
    });

    return gemstoneColor;
  },

  async deleteGemstoneColor(id) {
    if (!id) {
      throw { message: "gemstoneColor id Not exist" };
    }

    const getGemstoneColorId = await prisma.gemstoneColor.findFirst({
      where: {
        id,
      },
    });

    if (!getGemstoneColorId) {
      throw { message: "GemstoneColor id not found" };
    }

    const deletedGemstoneColor = await prisma.gemstoneColor.delete({
      where: {
        id,
      },
    });
    return deletedGemstoneColor;
  },

  async updateGemstoneColor({ id, name }) {
    if (!id || !name) {
      throw { status: 400, message: "Please provide all required fields" };
    }

    const existingGemstoneColor = await prisma.gemstoneColor.findUnique({
      where: { id },
    });

    if (!existingGemstoneColor) {
      throw { status: 404, message: "GemstoneColor not found" };
    }

    const slug = generateSlug(name);

    const updatedGemstoneColor = await prisma.gemstoneColor.update({
      where: { id },
      data: {
        gemstoneColorSlug: slug,
        name,
      },
    });

    return updatedGemstoneColor;
  },
};

export default gemstonoeColorService;
