import metalColorService from "../../services/metal/metalColorService.js";
import { handlePrismaError } from "../../utils/handlePrismaError.js";

const metalColorController = {
  async getMetalColorController(request, response) {
    try {
      const result = await metalColorService.getMetalColor(request.query);
      response.status(200).json({
        success: true,
        message: "metal Color fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in getting metalColor: ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async metalColorGetByIdController(request, response) {
    const { id } = request.params;
    try {
      const result = await metalColorService.getByIdMetalColor(id);
      return response.json({
        success: true,
        status: 200,
        message: "MetalColor fetched by Id successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in getting metalColor: ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async createMetalColorController(request, response) {
    const { name, metalColorSlug } = request.body;

    try {
      const result = await metalColorService.createMetalColor(
        name,
        metalColorSlug
      );

      return response.status(201).json({
        success: true,
        message: "MetalColor created successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in Creating metalColor: ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async deleteMetalColorController(request, response) {
    const { id } = request.params;
    try {
      const result = await metalColorService.deleteMetalColor(id);

      return response.json({
        success: true,
        status: 200,
        message: "MetalColor Deleted successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in deleting metalColor: ${error}`);

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
    const { name, metalColorSlug } = request.body;
    try {
      const result = await metalColorService.updateMetalColor({
        id,
        name,
        metalColorSlug,
      });
      return response.status(201).json({
        success: true,
        message: "MetalColor updated successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in updating metalColor: ${error}`);

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

export default metalColorController;
