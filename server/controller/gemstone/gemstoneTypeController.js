import gemstoneService from "../../services/gemstone/gemstoneTypeService.js";
import { successResponse } from "../../utils/responseHandler.js";
import { handlePrismaError } from "../../utils/handlePrismaError.js";

const gemstoneConroller = {
  //controller for fetching metal type
  async gemstoneTypeGetController(request, response) {
    try {
      const result = await gemstoneService.gemstoneTypeGetService();
      return successResponse(
        response,
        200,
        "MetalType fetched successfully",
        result
      );
    } catch (error) {
      console.error(`Error in getting gemstoneType: ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async gemstoneTypeGetByIdController(request, response) {
    const { id } = request.params;
    try {
      const result = await gemstoneService.gemstoneTypeGetByIdService(id);
      return successResponse(
        response,
        200,
        "MetalType fetched successfully",
        result
      );
    } catch (error) {
      console.error(`Error in getting gemstoneType: ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  //controller for creating metal Type
  async gemstoneTypePostController(request, response) {
    const { name, gemstoneTypeSlug } = request.body;
    try {
      const result = await gemstoneService.gemstoneTypePostService({
        name,
        gemstoneTypeSlug,
      });
      return successResponse(
        response,
        201,
        "MetalType created successfully",
        result
      );
    } catch (error) {
      console.error(`Error in Creating gemstoneType: ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  //controller for updating metal Type
  async gemstoneTypeUpdateController(request, response) {
    const { id } = request.params;
    const { name } = request.body;
    try {
      const result = await gemstoneService.gemstoneTypeUpdateService({
        id,
        name,
      });
      return successResponse(
        response,
        200,
        "MetalType updated successfully",
        result
      );
    } catch (error) {
      console.error(`Error in Updating gemstoneType: ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  //controller for deleting metal type

  async gemstoneTypeDeleteController(request, response) {
    console.log(request);
    console.log(response);
    const { id } = request.params;

    try {
      const result = await gemstoneService.gemstoneTypeDeleteService({ id });

      return successResponse(
        response,
        200,
        "MetalType deleted successully",
        result
      );
    } catch (error) {
      console.error(`Error in Deleting gemstoneType: ${error}`);

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

export default gemstoneConroller;
