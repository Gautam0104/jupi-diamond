import { uploadFilesToS3 } from "../../middleware/aws.file.stream.js";
import productStyleService from "../../services/productStyle/productStyleService.js";
import { handlePrismaError } from "../../utils/handlePrismaError.js";

const productStyleController = {
  async getProductStyle(request, response) {
    try {
      const result = await productStyleService.getProductStyle(request.query);
      return response.status(200).json({
        success: true,
        message: "Product style fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in getting ProductStyle: ${error}`);
      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },
  async getProductStyleById(request, response) {
    const { id } = request.params;
    try {
      const result = await productStyleService.getProductStyleById(id);
      return response.status(200).json({
        success: true,
        message: "Product style fetched successfully by id",
        data: result,
      });
    } catch (error) {
      console.error(`Error in getting ProductStyle: ${error}`);
      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },
  async createProductStyle(request, response) {
    const { name, description, jewelryTypeId } = request.body;
    const image = request.files && (await uploadFilesToS3(request.files));
    try {
      const result = await productStyleService.createProductStyle({
        name,
        description,
        jewelryTypeId,
        image,
      });
      return response.status(200).json({
        success: true,
        message: "Product style created successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in creating ProductStyle: ${error}`);
      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },
  async updateProductStyle(request, response) {
    const { id } = request.params;
    const { name, description, jewelryTypeId } = request.body;
    const image = request.files && (await uploadFilesToS3(request.files));
    try {
      const result = await productStyleService.updateProductStyle({
        id,
        name,
        description,
        jewelryTypeId,
        image,
      });
      return response.status(200).json({
        success: true,
        message: "Product style updated successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in updating ProductStyle: ${error}`);
      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },
  async deleteProductStyle(request, response) {
    const { id } = request.params;
    try {
      const result = await productStyleService.deleteProductStyle(id);
      return response.status(200).json({
        success: true,
        message: "Product style deleted successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in deleting ProductStyle: ${error}`);
      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  //active/inactive............................
  async toggleProductStyle(request, response) {
    const { id } = request.params;
    try {
      const result = await productStyleService.toggleProductStyle(id);
      return response.status(200).json({
        success: true,
        message: "Product style toggled successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in toggling ProductStyle: ${error}`);
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

export default productStyleController;
