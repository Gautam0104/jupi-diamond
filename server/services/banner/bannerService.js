import prisma from "../../config/prismaClient.js";
import { generateSlug } from "../../utils/autogenerateSlug.js";
import { paginate } from "../../utils/pagination.js";

const bannerService = {
  async getAllBanners(query) {
    try {
      const { search } = query;
      let whereFilter = {};
      if (search !== undefined && search !== "") {
        whereFilter = {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { subtitle: { contains: search, mode: "insensitive" } },
          ],
        };
      }

      const totalCount = await prisma.banner.count({ where: whereFilter });
      const { page, limit, skip, totalPages, currentPage } = paginate(
        query,
        totalCount
      );

      const banners = await prisma.banner.findMany({
        where: whereFilter,
        orderBy: { position: "desc" },
        skip,
        take: limit,
      });

      return {
        banners,
        pagination: { page, limit, skip, totalPages, currentPage, totalCount },
      };
    } catch (error) {
      throw error;
    }
  },

  async getAllBannerById(id) {
    try {
      if (!id) {
        throw {
          statusCode: 400,
          message: "Banner ID is required",
        };
      }
      const banners = await prisma.banner.findFirst({
        where: { id },
      });

      return banners;
    } catch (error) {
      throw error;
    }
  },

  async getPublicBanners() {
    try {
      const banners = await prisma.banner.findMany({
        where: { isActive: true },
        orderBy: { position: "desc" },
      });

      return banners;
    } catch (error) {
      throw error;
    }
  },

  async createBanner({ title, subtitle, imageUrl, mobileFiles, redirectUrl,buttonName }) {
    try {
      if ( !imageUrl) {
        throw {
          statusCode: 400,
          message: "Title and image URL are required",
        };
      }
      return await prisma.banner.create({
        data: {
          title,
          subtitle,
          imageUrl,
          redirectUrl,
          mobileFiles,
          buttonName
        },
      });
    } catch (error) {
      throw error;
    }
  },

  async updateBanner({
    id,
    title,
    subtitle,
    imageUrl,
    redirectUrl,
    buttonName,
    mobileFiles,
  }) {
    try {
      if (!id) {
        throw {
          statusCode: 400,
          message: "Banner ID is required",
        };
      }

      const existingBanner = await prisma.banner.findUnique({
        where: { id },
      });

      if (!existingBanner) {
        throw {
          statusCode: 404,
          message: "Banner not found",
        };
      }

      return await prisma.banner.update({
        where: { id },
        data: {
          title,
          subtitle,
          imageUrl,
          buttonName,
          mobileFiles,
          redirectUrl,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  async toggleBannerStatus(id) {
    try {
      if (!id) {
        throw {
          statusCode: 400,
          message: "Banner ID is required",
        };
      }

      const banner = await prisma.banner.findUnique({ where: { id } });
      if (!banner) {
        throw {
          statusCode: 404,
          message: "Banner not found",
        };
      }

      return await prisma.banner.update({
        where: { id },
        data: {
          isActive: !banner.isActive,
        },
      });
    } catch (error) {
      throw error;
    }
  },

  async deleteBanner(id) {
    try {
      if (!id) {
        throw {
          statusCode: 400,
          message: "Banner ID is required",
        };
      }

      const banner = await prisma.banner.findUnique({ where: { id } });
      if (!banner) {
        throw {
          statusCode: 404,
          message: "Banner not found",
        };
      }

      return await prisma.banner.delete({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  },
};

export default bannerService;
