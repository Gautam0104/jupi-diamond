import { successResponse } from "../../utils/responseHandler.js";
import { handlePrismaError } from "../../utils/handlePrismaError.js";
import { uploadFilesToS3 } from "../../middleware/aws.file.stream.js";
import bannerService from "../../services/banner/bannerService.js";

const bannerController = {
  // Get all banners (Admin)
  async getAllBanners(request, response) {
    try {
      const result = await bannerService.getAllBanners(request.query);
      return successResponse(
        response,
        200,
        "Banners fetched successfully",
        result
      );
    } catch (error) {
      console.error(`Error in fetching banners: ${error}`);
      // const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        code: error.code,
      });
    }
  },

  // Get all banners (Admin)
  async getAllBannerById(request, response) {
    const { id } = request.params;
    try {
      const result = await bannerService.getAllBannerById(id);
      return successResponse(
        response,
        200,
        "Banners fetched successfully",
        result
      );
    } catch (error) {
      console.error(`Error in fetching banners: ${error}`);
      // const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        code: error.code,
      });
    }
  },

  // Get public banners (active only)
  async getPublicBanners(request, response) {
    try {
      const result = await bannerService.getPublicBanners();
      return successResponse(
        response,
        200,
        "Public banners fetched successfully",
        result
      );
    } catch (error) {
      console.error(`Error in fetching public banners: ${error}`);
      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  // Create new banner
  async createBanner(request, response) {
    const { title, subtitle, redirectUrl, buttonName } = request.body;

    const fileUrls = request.files && (await uploadFilesToS3(request.files));

    const desktopImg =
      fileUrls.find((file) => file.fieldname === "desktopImg") || "";
    const mobileImg =
      fileUrls.find((file) => file.fieldname === "mobileImg") || "";

    try {
      const result = await bannerService.createBanner({
        title,
        subtitle,
        imageUrl: desktopImg?.url,
        mobileFiles: mobileImg?.url,
        redirectUrl,
        buttonName,
      });

      return successResponse(
        response,
        201,
        "Banner created successfully",
        result
      );
    } catch (error) {
      console.error(`Error in creating banner: ${error}`);
      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  // Update banner by ID
  async updateBanner(request, response) {
    const { id } = request.params;
    const { title, subtitle, redirectUrl, buttonName } = request.body;

    const fileUrls = request.files && (await uploadFilesToS3(request.files));

    const desktopImg =
      fileUrls.find((file) => file.fieldname === "desktopImg") || "";
    const mobileImg =
      fileUrls.find((file) => file.fieldname === "mobileImg") || "";

    try {
      const result = await bannerService.updateBanner({
        id,
        title,
        subtitle,
        imageUrl: desktopImg?.url,
        redirectUrl,
        buttonName,
        mobileFiles: mobileImg?.url,
      });

      return successResponse(
        response,
        200,
        "Banner updated successfully",
        result
      );
    } catch (error) {
      console.error(`Error in updating banner: ${error}`);
      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  // Toggle banner active/inactive
  async toggleBanner(request, response) {
    const { id } = request.params;
    try {
      const result = await bannerService.toggleBannerStatus(id);
      return successResponse(
        response,
        200,
        "Banner status toggled successfully",
        result
      );
    } catch (error) {
      console.error(`Error in toggling banner status: ${error}`);
      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  // Delete banner
  async deleteBanner(request, response) {
    const { id } = request.params;
    try {
      const result = await bannerService.deleteBanner(id);
      return successResponse(
        response,
        200,
        "Banner deleted successfully",
        result
      );
    } catch (error) {
      console.error(`Error in deleting banner: ${error}`);
      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },
};

export default bannerController;
