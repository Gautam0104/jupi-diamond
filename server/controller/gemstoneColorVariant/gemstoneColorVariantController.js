import gemstoneColorVariantService from "../../services/gemstoneColorVariant/gemstoneColorVariantService.js";
import { handlePrismaError } from "../../utils/handlePrismaError.js";

const gemstoneColorVariantController = {
  async getGemstoneColorVariant(request, response) {
    try {
      const result =
        await gemstoneColorVariantService.getGemstoneColorVariant();
      return response.status(200).json({
        success: true,
        message: "GemstoneColorVariant fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in getting gemstoneColorVariant: ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async getGemstoneColorVariantById(request, response) {
    const { id } = request.params;

    try {
      const result =
        await gemstoneColorVariantService.getGemstoneColorVariantByUd(id);
      return response.status(200).json({
        success: true,
        message: "GemstoneColorVariant fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in getting gemstoneColorVariant: ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async createGemstoneColorVariant(request, response) {
    const { gemstoneVariantId, gemstoneColorId } = request.body;

    try {
      const result =
        await gemstoneColorVariantService.createGemstoneColorVariant({
          gemstoneVariantId,
          gemstoneColorId,
        });

      return response.status(201).json({
        success: true,
        message: "GemstoneColorVariant created successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in creating gemstoneColorVariant: ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async deleteMetalColorVariant(request, response) {
    const { id } = request.params;

    try {
      const result =
        await gemstoneColorVariantService.deleteGemstoneColorVariantById(id);
      return response.status(200).json({
        success: true,
        message: "GemstoneColorVariant deleted successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in deleting gemstoneColorVariant: ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async updateGemstoneColorVariant(request, response) {
    const { id } = request.params;
    const { gemstoneVariantId, gemstoneColorId } = request.body;

    try {
      const result =
        await gemstoneColorVariantService.updateGemstoneColorVariant({
          id,
          gemstoneVariantId,
          gemstoneColorId,
        });

      return response.status(200).json({
        success: true,
        message: "GemstoneColorVariant updated successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in updating gemstoneColorVariant: ${error}`);

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
export default gemstoneColorVariantController;
