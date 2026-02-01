import gemstonoeColorService from "../../services/gemstone/gemstoneColorService.js";
import { successResponse } from "../../utils/responseHandler.js";
import { handlePrismaError } from "../../utils/handlePrismaError.js";

const gemstoneColorController = {
  async getGemstoneColorController(request, response) {
    try {
      const result = await gemstonoeColorService.getColor();
      return successResponse(
        response,
        200,
        "GemstoneColor fetched successfully",
        result
      );
    } catch (error) {
      console.error(`Error in getting gemstone: ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async gemstoneColorGetByIdController(request, response) {
    const { id } = request.params;
    try {
      const result = await gemstonoeColorService.getGemstoneColorById(id);
      return successResponse(
        response,
        200,
        "GemstoneColor fetched successfully",
        result
      );
    } catch (error) {
      console.error(`Error in getting gemstone: ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async createGemstoneColorController(request, response) {
    const { name, gemstoneColorSlug } = request.body;

    try {
      const result = await gemstonoeColorService.createGemstoneColor(
        name,
        gemstoneColorSlug
      );

      return successResponse(
        response,
        201,
        "GemstoneColor created successfully",
        result
      );
    } catch (error) {
      console.error(`Error in crearing gemstone: ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async deleteGemstoneColorController(request, response) {
    const { id } = request.params;
    try {
      const result = await gemstonoeColorService.deleteGemstoneColor(id);

      return successResponse(
        response,
        200,
        "GemstoneColor deleted successully",
        result
      );
    } catch (error) {
      console.error(`Error in deleteing gemstone: ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async updateMetalColorController(request, response) {
    const { id } = request.params;
    const { name } = request.body;
    try {
      const result = await gemstonoeColorService.updateGemstoneColor({
        id,
        name,
      });
      return successResponse(
        response,
        201,
        "GemstoneColor updated successfully",
        result
      );
    } catch (error) {
      console.error(`Error in updating gemstone: ${error}`);

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

export default gemstoneColorController;
