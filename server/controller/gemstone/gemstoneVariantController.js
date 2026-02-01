import gemstoneVariantService from "../../services/gemstone/gemstoneVariantService.js";
import { successResponse } from "../../utils/responseHandler.js";
import { handlePrismaError } from "../../utils/handlePrismaError.js";
import { uploadFilesToS3 } from "../../middleware/aws.file.stream.js";

const gemstoneVariantController = {
  async getMetalVariant(request, response) {
    try {
      const result = await gemstoneVariantService.getGemstoneVariant(
        request.query
      );
      return successResponse(
        response,
        200,
        "GemstoneVariant fetched successfully",
        result
      );
    } catch (error) {
      console.error(`Error in getting gemstoneVariant: ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async getGemstoneVariantById(request, response) {
    const { id } = request.params;

    try {
      const result = await gemstoneVariantService.getGemstoneVariantById(id);

      return successResponse(
        response,
        200,
        "GemstoneVariant fetched successfully",
        result
      );
    } catch (error) {
      console.error(`Error in getting gemstoneVariant: ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async createMetalVariant(request, response) {
    const {
      gemstoneTypeId,
      clarity,
      cut,
      color,
      shape,
      gemstonePrice,
      height,
      width,
      depth,
      origin,
      certification,
      certificateNumber,
    } = request.body;

    try {
      const imageFile = request.files?.find(
        (file) => file.fieldname === "image"
      );
      const certificateFile = request.files?.find(
        (file) => file.fieldname === "certificateFile"
      );

      // Upload files if they exist
      const image = imageFile && (await uploadFilesToS3([imageFile]));
      const certificate =
        certificateFile && (await uploadFilesToS3([certificateFile]));

      console.log("certificateFile=", certificateFile);
      console.log("image=", image);
      console.log(request.files);

      const certificateUrl = certificate?.[0]?.url;
      const result = await gemstoneVariantService.createGemstoneVariant({
        gemstoneTypeId,
        clarity,
        cut,
        color,
        shape,
        gemstonePrice: Number.parseFloat(gemstonePrice),
        height: Number.parseFloat(height),
        width: Number.parseFloat(width),
        depth: Number.parseFloat(depth),
        origin,
        certification,
        certificateNumber,
        image,
        certificateUrl,
      });

      return successResponse(
        response,
        201,
        "GemstoneVariant created successully",
        result
      );
    } catch (error) {
      console.error(`Error in creating gemstoneVariant: ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async updateGemstoneVariant(request, response) {
    const { id } = request.params;
    const {
      gemstoneTypeId,
      clarity,
      cut,
      color,
      shape,
      gemstonePrice,
      height,
      width,
      depth,
      origin,
      certification,
      certificateNumber,
    } = request.body;

    const removeCertificate = request.body.removeCertificate === "true";

    try {
      const imageFile = request.files?.find(
        (file) => file.fieldname === "image"
      );
      const certificateFile = request.files?.find(
        (file) => file.fieldname === "certificateFile"
      );

      // Handle image upload - only if new file was uploaded
      const image = imageFile
        ? (await uploadFilesToS3([imageFile]))[0]?.url
        : undefined;

      // Handle certificate upload - only if new file was uploaded
      let certificateUrl;
      if (certificateFile) {
        certificateUrl = (await uploadFilesToS3([certificateFile]))[0]?.url;
      } else if (removeCertificate) {
        certificateUrl = null; // Explicitly set to null to remove
      }

      const staffId = request.session?.admin?.id;

      const result = await gemstoneVariantService.updateGemstoneVariant({
        id,
        gemstoneTypeId,
        clarity,
        cut,
        color,
        shape,
        gemstonePrice,
        height,
        width,
        depth,
        origin,
        certification,
        certificateNumber,
        imageUrl: image,
        certificateUrl,
        staffId,
      });

      return successResponse(
        response,
        200,
        "GemstoneVariant updated successfully",
        result
      );
    } catch (error) {
      console.error(`Error in Updating gemstoneVariant: ${error}`);
      return response.status(error.statusCode || 500).json({
        statusCode: error.statusCode || 500,
        message: error.message || "Internal Server Error",
        success: false,
        code: error.code || "UNKNOWN",
      });
    }
  },

  async deleteGemstoneVariant(request, response) {
    const { id } = request.params;

    try {
      const result = await gemstoneVariantService.deleteGemstoneVariantById(id);
      return successResponse(
        response,
        200,
        "GemstoneVariant deleted successfully",
        result
      );
    } catch (error) {
      console.error(`Error in Deleting gemstoneVariant: ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async fetchUpdatedHistoryByGemestone(req, res) {
    try {
      const { id } = req.params;

      const result = await gemstoneVariantService.fetchGemstoneHistory(
        id,
        req.query
      );

      return res.status(200).json({
        sucess: true,
        message: "Gamestone History",
        data: result,
      });
    } catch (error) {
      console.log(error);

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

export default gemstoneVariantController;
