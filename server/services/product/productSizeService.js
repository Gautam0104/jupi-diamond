import prisma from "../../config/prismaClient.js";
import { generateSlug } from "../../utils/autogenerateSlug.js";
import { paginate } from "../../utils/pagination.js";

const productSizeService = {
  async getProductSize(query) {
    try {
      const { search, jewelryTypeId } = query;
      let whereFilter = {};
      if (search !== undefined && search !== "") {
        whereFilter = {
          OR: [{ label: { contains: search, mode: "insensitive" } }],
          OR: [{ productSizeSlug: { contains: search, mode: "insensitive" } }],
        };
      }
      if (jewelryTypeId !== undefined && jewelryTypeId !== "") {
        whereFilter = {
          ...whereFilter,
          JewelryType: {
            id: jewelryTypeId,
          },
        };
      }

      const totalCount = await prisma.productVariantSize.count({
        where: whereFilter,
      });
      

      const { page, limit, skip, totalPages, currentPage } = paginate(
        query,
        totalCount
      );

      const result = await prisma.productVariantSize.findMany({
        where: whereFilter,
        skip,
        take: limit,
        include: {
          JewelryType: {
            select: {
              id: true,
              name: true,
              jewelryTypeSlug: true,
            },
          },
        },
        orderBy: { label: "asc" },
      });
      if (!result) {
        throw {
          success: false,
          status: 404,
          message: "Product Size not found",
        };
      }
      return {
        result,
        pagination: { page, limit, skip, totalPages, currentPage, totalCount },
      };
    } catch (error) {
      throw new Error("Something went wrong ", error.message);
    }
  },

  async getProductSizeById(id) {
    try {
      if (!id) {
        throw { message: "Please provide ProductSize id," };
      }

      const existing = await prisma.productVariantSize.findUnique({
        where: { id },
        include: {
          JewelryType: true,
        },
      });

      if (!existing) {
        throw {
          status: 404,
          message: "ProductSize not found",
        };
      }

      return existing;
    } catch (error) {
      throw new Error("Something went wrong " + error.message);
    }
  },

  async createProductSize({ label,labelSize, jewelryTypeId, unit, circumference }) {
    try {
      if ( !jewelryTypeId) {
        throw {
          message: "Please provide all the required field",
        };
      }

      const jewelryType = await prisma.jewelryType.findFirst({
        where: {
          id: jewelryTypeId,
        },
      });
      const jewelryTypeFormat = jewelryType.name.trim().replace(/\s+/g, "");
      if (!jewelryType) {
        throw {
          message: "Jewelry Type not found",
        };
      }

      const formattedUnit = unit.trim().toUpperCase();

      const slug = generateSlug(
        `${label || labelSize}-${formattedUnit}-${jewelryTypeFormat}`
      );

      const existing = await prisma.productVariantSize.findFirst({
        where: { productSizeSlug: slug },
      });

      if (existing) {
        throw {
          message: "Product Size already exist",
        };
      }

      const result = await prisma.productVariantSize.create({
        data: {
          label: Number.parseFloat(label),
          labelSize,
          unit: formattedUnit,
          productSizeSlug: slug,
          circumference,
          JewelryType: {
            connect: {
              id: jewelryTypeId,
            },
          },
        },
      });

      return result;
    } catch (error) {
      throw new Error("Something went wrong " + error.message);
    }
  },

  async updateProductSize({ id, label,labelSize, jewelryTypeId, unit, circumference }) {
    try {
      if (!id ||  !unit || !jewelryTypeId) {
        throw new Error("Please provide the required Fields id, label, unit");
      }

      const jewelryType = await prisma.jewelryType.findFirst({
        where: {
          id: jewelryTypeId,
        },
      });
      if (!jewelryType) {
        throw new Error("Jewelry Type not found");
      }
      const jewelryTypeFormat = jewelryType.name.trim().replace(/\s+/g, "");
      const formattedUnit = unit.trim().toUpperCase();
      const slug = generateSlug(
        `${label || labelSize}-${formattedUnit}-${jewelryTypeFormat}`
      );

      const existing = await prisma.productVariantSize.findUnique({
        where: { id },
      });
      if (!existing) {
        throw new Error("Product Size not found");
      }

      const duplicate = await prisma.productVariantSize.findFirst({
        where: {
          productSizeSlug: slug,
          id: { not: id },
        },
      });

      if (duplicate) {
        throw new Error("Product Size already exists");
      }

      const result = await prisma.productVariantSize.update({
        where: { id },
        data: {
          label: Number.parseFloat(label),
          labelSize,
          unit: formattedUnit,
          productSizeSlug: slug,
          circumference,
          JewelryType: {
            connect: {
              id: jewelryTypeId,
            },
          },
        },
      });

      return result;
    } catch (error) {
      console.log("Error=", error);
      throw new Error("Something went wrong " + error.message);
    }
  },

  async deleteProductSize(id) {
    try {
      if (!id) {
        throw {
          message: "Please provide the required Fields",
        };
      }

      const existing = await prisma.productVariantSize.findUnique({
        where: { id },
      });

      if (!existing) {
        throw {
          message: "Product Size not Found",
        };
      }

      const result = await prisma.productVariantSize.delete({
        where: { id },
      });

      return result;
    } catch (error) {
      throw new Error("Something went wrong " + error.message);
    }
  },
};

export default productSizeService;
