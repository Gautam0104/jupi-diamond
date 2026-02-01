import metalService from "../../services/metal/metalTypeService.js";
import { handlePrismaError } from "../../utils/handlePrismaError.js";

const metalConroller = {
  //controller for fetching metal type
  async metalTypeGetController(request, response) {
    try {
      const result = await metalService.metalTypeGetService();
      return response.json({
        success: true,
        status: 200,
        message: "MetalType fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in getting metalType: ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async metalTypeGetByIdController(request, response) {
    const { id } = request.params;
    try {
      const result = await metalService.metalTypeGetByIdService(id);
      return response.json({
        success: true,
        status: 200,
        message: "MetalType fetched by Id successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in getting metalType: ${error}`);

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
  async metalTypePostController(request, response) {
    const { name, metalTypeSlug } = request.body;
    try {
      const result = await metalService.metalTypePostService({
        name,
        metalTypeSlug,
      });
      return response.status(201).json({
        message: "MetalType created successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in Creating metalType: ${error}`);

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
  async metalTypeUpdateController(request, response) {
    const { id } = request.params;
    const { name, metalTypeSlug } = request.body;
    try {
      const result = await metalService.metaTypeUpdateService({
        id,
        name,
        metalTypeSlug,
      });
      return response.status(201).json({
        success: true,
        message: "MetalType Updated Successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in Updating metalType: ${error}`);

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
  async metalTypeDeleteController(request, response) {
    console.log(request);
    console.log(response);
    const { id } = request.params;

    try {
      const result = await metalService.metalTypeDeleteService({ id });

      return response.status(200).json({
        success: true,
        status: 200,
        message: "MetalType deleted Successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in Deleting metalType: ${error}`);

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

export default metalConroller;
