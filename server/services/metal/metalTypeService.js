import prisma from "../../config/prismaClient.js";
import { generateSlug } from "../../utils/autogenerateSlug.js";

const metalService = {
  async metalTypeGetService() {
    const metalType = await prisma.metalType.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });
    if (!metalType) {
      throw new Error({ status: 404, message: "MetalType not found" });
    }
    return metalType;
  },

  async metalTypeGetByIdService(id) {
    if (!id) {
      throw new Error({ status: 404, message: "MetalTypeId not found" });
    }
    const metalTypeFindById = await prisma.metalType.findUnique({
      where: {
        id,
      },
    });

    if (!metalTypeFindById) {
      throw {
        status: 404,
        message: "MetalType not found",
      };
    }

    return metalTypeFindById;
  },

  async metalTypePostService({ name, metalTypeSlug }) {
    console.log(name);
    if (!name) {
      throw new Error("Name field is required");
    }
    const formattedName = name.trim().toUpperCase();

    const existingMetalType = await prisma.metalType.findUnique({
      where: {
        name: formattedName,
        metalTypeSlug,
      },
    });

    if (existingMetalType) {
      throw "MetalType already exists";
    }

    const generatMetalTypeSlug = generateSlug(name);

    const metalTypeCreate = await prisma.metalType.create({
      data: {
        metalTypeSlug: generatMetalTypeSlug,
        name: formattedName,
      },
    });
    return metalTypeCreate;
  },

  async metaTypeUpdateService({ id, name }) {
    console.log(name);
    console.log(id);

    if (!name || !id) {
      throw {
        status: 404,
        message: "All the filds are requred",
      };
    }

    const formattedName = name.trim().toUpperCase();

    const existingMetal = await prisma.metalType.findUnique({
      where: {
        id,
      },
    });

    if (!existingMetal) {
      throw {
        status: 404,
        message: "Metal Not exist",
      };
    }

    const updatedSlug = generateSlug(name);

    const newMetalType = await prisma.metalType.update({
      where: { id },
      data: { name: formattedName, metalTypeSlug: updatedSlug },
    });

    return newMetalType;
  },

  async metalTypeDeleteService({ id }) {
    if (!id) {
      throw {
        status: 404,
        message: "id not exist of metalType",
      };
    }

    const existingMetalType = await prisma.metalType.findFirst({
      where: { id },
    });

    if (!existingMetalType) {
      throw {
        status: 404,
        message: "Metal not exist",
      };
    }

    const deletedMetalType = await prisma.metalType.delete({
      where: { id },
    });
    console.log(deletedMetalType);

    return deletedMetalType;
  },
};

export default metalService;
