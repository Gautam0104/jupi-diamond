import globalMakingChargesService from "../../services/globalMakingCharges/globalMakingChargesService.js";
import { handlePrismaError } from "../../utils/handlePrismaError.js";

const globalMakingChargesController = {
  async getGlobalMakingCharges(request, response) {
    try {
      const result = await globalMakingChargesService.getGlobalMakingCharges(
        request.query
      );
      response.status(200).json({
        success: true,
        message: "All metal Variant fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in getting GlobalMakingCharge: ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async getGlobalMakingChargesById(request, response) {
    const { id } = request.params;

    try {
      const result =
        await globalMakingChargesService.getGlobalMakingChargesById(id);
      response.status(200).json({
        success: true,
        message: "id fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in getting GlobalMakingCharge: ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async createGlobalMakingCharges(request, response) {
    const {
      category,
      description,

      // minWeight,
      // maxWeight,
      // chargeValue,
      // discountType,
      // discountValue,
      // isActive,
    } = request.body;
    console.log("body=", request.body);
    try {
      const result = await globalMakingChargesService.createGlobalMakingCharges(
        {
          category,
          description,
        }
      );
      response.status(201).json({
        success: true,
        message: "Global Making Charge created successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in Creating GlobalMakingCharge: ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async updateGlobalMakingCharges(request, response) {
    const { id } = request.params;
    const { category, description } = request.body;

    try {
      const result = await globalMakingChargesService.updateGlobalMakingCharges(
        {
          id,
          category,
          description,
        }
      );
      response.status(201).json({
        success: true,
        message: "Global Making Charge updated successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in updating GlobalMakingCharge: ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async deleteGlobalMakingCharges(request, response) {
    const { id } = request.params;

    try {
      const result =
        await globalMakingChargesService.deleteGlobalMakingCharges(id);
      response.status(200).json({
        success: true,
        message: "Global Making charges deleted successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in deleting GlobalMakingCharge: ${error}`);

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

export default globalMakingChargesController;
