import prisma from "../../config/prismaClient.js";
import { generateSlug } from "../../utils/autogenerateSlug.js";
import { paginate } from "../../utils/pagination.js";

const collectionService = {
  async getCollection(query) {
    try {
      const { search } = query;
      let whereFilter = {};

      if (search !== null && search !== undefined && search !== "") {
        whereFilter = {
          ...whereFilter,
          OR: [{ name: { contains: search, mode: "insensitive" } }],
        };
      }
      const totalCount = await prisma.collection.count({ where: whereFilter });
      
      const { page, limit, skip, totalPages, currentPage } = paginate(
        query,
        totalCount
      );

      const collection = await prisma.collection.findMany({
        where: whereFilter,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      });

      if (!collection) {
        throw { message: "Collection Not found" };
      }
      return {
        collection,
        pagination: { page, limit, totalPages, currentPage, totalCount },
      };
    } catch (error) {
      throw error;
    }
  },

  async getCollectionById(id) {
    if (!id) {
      throw new Error({ status: 404, message: "Collection not found" });
    }

    const colletionById = await prisma.collection.findUnique({
      where: { id },
    });

    if (!colletionById) {
      throw {
        status: 404,
        message: "Collection not found",
      };
    }
    return colletionById;
  },

  async createCollectionService({ name, gender, description, thumbnailImage }) {
    if (!name) {
      throw { statusCode: 400, message: "Please provide a collection name" };
    }

    const formattedName = name.trim();
    const formattedSlug = generateSlug(formattedName);

    const existing = await prisma.collection.findUnique({
      where: { collectionSlug: formattedSlug },
    });

    if (existing) {
      throw {
        statusCode: 409,
        message: "Collection already exists in the database",
      };
    }

    const newCollection = await prisma.collection.create({
      data: {
        name: formattedName,
        collectionSlug: formattedSlug,
        gender: gender || null,
        description: description || null,
        thumbnailImage: thumbnailImage[0]?.url || null,
      },
    });

    return newCollection;
  },

  async updateCollection({ id, name, gender, description, thumbnailImage }) {
    if (!name) {
      throw { message: "Please provide all the required Fields" };
    }

    const formattedName = name.trim().toUpperCase();
    const slug = generateSlug(name);

    const existing = await prisma.collection.findUnique({
      where: { id },
    });

    if (!existing) {
      throw { message: "Collection not exist" };
    }

    const updateCollection = await prisma.collection.update({
      where: { id },
      data: {
        name: formattedName,
        collectionSlug: slug,
        gender: gender || existing.gender,
        description: description || existing.description,
        thumbnailImage: thumbnailImage[0]?.url,
      },
    });

    return updateCollection;
  },

  async collectionDeleteService({ id }) {
    if (!id) {
      throw { message: "Provide all the fields" };
    }

    const existing = await prisma.collection.findFirst({
      where: { id },
    });

    if (!existing) {
      throw {
        status: 404,
        message: "Collection not exist",
      };
    }

    const deletedCollection = await prisma.collection.delete({
      where: { id },
    });
    console.log(deletedCollection);

    return deletedCollection;
  },
  //toggle collection status................................
  async toggleCollectionStatusService(id) {
    if (!id) {
      throw { message: "Provide all the fields" };
    }

    const existing = await prisma.collection.findFirst({
      where: { id },
    });

    if (!existing) {
      throw {
        status: 404,
        message: "Collection not exist",
      };
    }

    const toggleCollectionStatus = await prisma.collection.update({
      where: { id },
      data: {
        status: !existing.status,
      },
    });

    return toggleCollectionStatus;
  },

  async getPublicCollection(query) {
    const { search } = query;
    try {
      let whereFilter = {};

      if (search !== undefined && search !== "") {
        whereFilter = {
          ...whereFilter,
          OR: [{ name: { contains: search, mode: "insensitive" } }],
        };
      }

      const collection = await prisma.collection.findMany({
        where: whereFilter,
        orderBy: { createdAt: "desc" },
      });

      if (!collection) {
        throw { message: "Collection Not found" };
      }
      return collection;
    } catch (error) {
      throw error;
    }
  },
};

export default collectionService;
