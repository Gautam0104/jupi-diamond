import prisma from "../../config/prismaClient.js";
import { generateSlug } from "../../utils/autogenerateSlug.js";

const globalMakingChargesService = {
  async getGlobalMakingCharges(query) {
    const { search } = query;
    let whereFilter = {};

    if (search !== undefined && search !== "") {
      whereFilter = {
        OR: [{ category: { contains: search, mode: "insensitive" } }],
      };
    }
    const result = await prisma.makingChargeCategorySet.findMany({
      where: whereFilter,
      include: {
        makingChargeWeightRange: {
          include: {
            metalVariant: true,
            gemstoneVariant: true,
          },
        },
      },
    });

    if (!result) {
      throw { status: 404, message: "globalMakingCharge not found" };
    }

    return result;
  },

  async getGlobalMakingChargesById(id) {
    if (!id) {
      throw { message: "GlobalMakingCharges id not exist" };
    }

    const result = await prisma.makingChargeCategorySet.findFirst({
      where: { id },
    });

    if (!result) {
      throw { message: "GlobalMakingCharges not found" };
    }
    return result;
  },

  async createGlobalMakingCharges({ category, description }) {
    try {
      if (!category) {
        throw {
          message: "Please enter category name",
        };
      }

      const existing = await prisma.makingChargeCategorySet.findUnique({
        where: { category },
      });

      if (existing) {
        throw new Error("Similar making category already exists.");
      }

      const makingCharge = await prisma.makingChargeCategorySet.create({
        data: {
          category,
          description,
        },
      });

      return makingCharge;
    } catch (error) {
      console.log(error);
      throw new Error(`${error}`);
    }
  },

  async updateGlobalMakingCharges({ id, category, description }) {
    try {
      if (!id || !category) {
        throw {
          message: "Please provide all the required fields",
        };
      }

      const existingCategory = await prisma.makingChargeCategorySet.findUnique({
        where: { id },
      });

      if (!existingCategory) {
        throw new Error("Making charge category not found");
      }

      const updateCategory = await prisma.makingChargeCategorySet.update({
        where: { id },
        data: {
          category,
          description,
        },
      });

      return updateCategory;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  async deleteGlobalMakingCharges(id) {
    if (!id) {
      throw { message: "GlobalMakingCharges id not exist" };
    }

    const existing = await prisma.makingChargeCategorySet.findFirst({
      where: { id },
    });

    if (!existing) {
      throw { message: "GlobalMakingCharges not found" };
    }
    const result = await prisma.makingChargeCategorySet.delete({
      where: { id },
    });
    return result;
  },
};

export default globalMakingChargesService;
