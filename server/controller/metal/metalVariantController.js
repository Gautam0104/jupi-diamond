import metalVariantService from "../../services/metal/metalVariantService.js";
import { handlePrismaError } from "../../utils/handlePrismaError.js";

const metalVariantController = {
  async getMetalVariant(request, response) {
    try {
      const result = await metalVariantService.getMetalVariant(request.query);
      response.status(200).json({
        success: true,
        message: "All metal Variant fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in getting metalVariant: ${error}`);
      // const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        code: error.code,
      });
    }
  },

  async getMetalVariantById(request, response) {
    const { id } = request.params;

    try {
      const result = await metalVariantService.getMetalVariantById(id);
      response.status(200).json({
        success: true,
        message: "metal variant by id fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in getting metalVariant: ${error}`);
      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async fetchUpdateHistoryByMetal(request, response) {
    const { id } = request.params;

    try {
      const result = await metalVariantService.fetchMetalHistory(
        id,
        request.query
      );
      response.status(200).json({
        success: true,
        message: "metal history fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in getting metalVariant: ${error}`);
      // const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        code: error.code,
      });
    }
  },

  async createMetalVariant(request, response) {
    const { metalTypeId, purityLabel, metalPriceInGram, byBackPrice } =
      request.body;

    try {
      const result = await metalVariantService.createMetalVariant({
        metalTypeId,
        purityLabel,
        metalPriceInGram: Number(metalPriceInGram),
        byBackPrice: Number(byBackPrice || 0), // Convert to number and provide default
      });

      return response.status(201).json({
        success: true,
        message: "Metal Variant Created Successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in Creating metalVariant: ${error}`);
      const prismaError = handlePrismaError(error);
      return response.status(prismaError.statusCode || 500).json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async updateMetalVariant(request, response) {
    const { id } = request.params;
    const staffId = request.session?.admin?.id;
    const {
      metalTypeId,
      purityLabel,
      metalPriceInGram,
      metalVariantSlug,
      byBackPrice,
    } = request.body;

    try {
      const result = await metalVariantService.updateMetalVariant({
        id,
        metalTypeId,
        purityLabel,
        metalPriceInGram,
        metalVariantSlug,
        byBackPrice,
        staffId,
      });

      return response.status(201).json({
        success: true,
        message: "Metal Variant updated Successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in Updating metalVariant: ${error}`);
      return response.status(error.statusCode || 500).json({
        statusCode: error.statusCode || 500,
        message: error.message || "Internal Server Error",
        success: false,
        code: error.code || "UNKNOWN",
      });
    }
  },

  async deleteMetalVariant(request, response) {
    const { id } = request.params;

    try {
      const result = await metalVariantService.deleteMetalVariantById(id);
      return response.status(200).json({
        success: true,
        message: "MetalVariant deleted successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in deleting metalVariant: ${error}`);
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

export default metalVariantController;
