import prisma from "../../config/prismaClient.js";
import { generateSlug } from "../../utils/autogenerateSlug.js";

const gemstoneService = {
  async gemstoneTypeGetService() {
    const gemstoneType = await prisma.gemstoneType.findMany();
    if (!gemstoneType) {
      throw new Error({ status: 404, message: "MetalType not found" });
    }
    return gemstoneType;
  },

  async gemstoneTypeGetByIdService(id) {
    if (!id) {
      throw new Error({ status: 404, message: "gemstoneTypeId not found" });
    }
    const gemstoneTypeFindById = await prisma.gemstoneType.findUnique({
      where: {
        id,
      },
    });

    if (!gemstoneTypeFindById) {
      throw {
        status: 404,
        message: "MetalType not found",
      };
    }

    return gemstoneTypeFindById;
  },

  async gemstoneTypePostService({ name }) {
    console.log(name);

    if (!name) {
      throw new Error("Name field is required");
    }

    const formattedName = name.trim().toUpperCase();
    const slug = generateSlug(name);
    const existingGemstoneType = await prisma.gemstoneType.findFirst({
      where: {
        gemstoneTypeSlug: slug,
      },
    });

    if (existingGemstoneType) {
      throw new Error("GemstoneType already exists");
    }

    const gemstoneTypeCreate = await prisma.gemstoneType.create({
      data: { name: formattedName, gemstoneTypeSlug: slug },
    });
    return gemstoneTypeCreate;
  },

  async gemstoneTypeUpdateService({ id, name }) {
    console.log(name);
    console.log(id);

    if (!name || !id) {
      throw {
        status: 404,
        message: "All the filds are requred",
      };
    }

    const existingGemstone = await prisma.gemstoneType.findFirst({
      where: { id },
    });

    if (!existingGemstone) {
      throw {
        status: 404,
        message: "Metal Not exist",
      };
    }

    const slug = generateSlug(name);
    const formattedName = name.trim().toUpperCase();
    const newGemstoneType = await prisma.gemstoneType.update({
      where: { id },
      data: {
        name: formattedName,
        gemstoneTypeSlug: slug,
      },
    });

    return newGemstoneType;
  },

  async gemstoneTypeDeleteService({ id }) {
    if (!id) {
      throw {
        status: 404,
        message: "id not exist of gemstoneType",
      };
    }

    const existingGemstoneType = await prisma.gemstoneType.findFirst({
      where: { id },
    });

    if (!existingGemstoneType) {
      throw {
        status: 404,
        message: "Metal not exist",
      };
    }

    const deletedGemstoneType = await prisma.gemstoneType.delete({
      where: { id },
    });
    console.log(deletedGemstoneType);

    return deletedGemstoneType;
  },
};

export default gemstoneService;
