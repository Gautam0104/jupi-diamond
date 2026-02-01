import metalColorVariantService from "../../services/metalColorVariant/metalColorVariantService.js";
import { handlePrismaError } from "../../utils/handlePrismaError.js";

const metalColorVariantController = {
  async getMetalColorVariant(request, response) {
    try {
      const result = await metalColorVariantService.getMetalColorVariant();
      return response.status(200).json({
        success: true,
        message: "MetalColorVariant fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in getting metalColorVariant: ${error}`);
      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async getMetalColorVariantById(request, response) {
    const { id } = request.params;

    try {
      const result = await metalColorVariantService.getMetalColorVariantByUd(
        id
      );
      return response.status(200).json({
        success: true,
        message: "MetalColorVariant fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in getting metalColorVariant: ${error}`);
      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async createMetalColorVariant(request, response) {
    const { metalVariantId, metalColorId } = request.body;

    try {
      const result = await metalColorVariantService.createMetalColorVariant({
        metalVariantId,
        metalColorId,
      });

      return response.status(201).json({
        success: true,
        message: "MetalColorVariant created successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in creating metalColorVariant: ${error}`);
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
      const result = await metalColorVariantService.deleteMetalColorVariantById(
        id
      );
      return response.status(200).json({
        success: true,
        message: "MetalColorVariant deleted successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in deleting metalColorVariant: ${error}`);
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
export default metalColorVariantController;
