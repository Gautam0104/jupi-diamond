import productSizeService from "../../services/product/productSizeService.js";
import { handlePrismaError } from "../../utils/handlePrismaError.js";

const productSizeController = {
  async getProductSize(request, response) {
    try {
      const result = await productSizeService.getProductSize(request.query);
      return response.status(200).json({
        success: true,
        message: "Product size fetched successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in getting ProductSize: ${error}`);
      response.status(400).json({ success: false, message: error.message });
    }
  },
  async getProductSizeById(request, response) {
    const { id } = request.params;
    try {
      const result = await productSizeService.getProductSizeById(id);
      return response.status(200).json({
        success: true,
        message: "Product size fetched successfully by id",
        data: result,
      });
    } catch (error) {
      console.error(`Error in getting ProductSize: ${error}`);
      response.status(400).json({ success: false, message: error.message });
    }
  },

  async createProductSize(request, response) {
    const { label, labelSize , unit, jewelryTypeId, circumference } = request.body;

    try {
      const result = await productSizeService.createProductSize({
        label,
        labelSize,
        unit,
        circumference,
        jewelryTypeId,
      });
      return response.status(200).json({
        success: true,
        message: "Product size created successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in creating ProductSize: ${error}`);
      response.status(400).json({ success: false, message: error.message });
    }
  },

  async updateProductSize(request, response) {
    const { id } = request.params;
    const { label,labelSize, unit, jewelryTypeId, circumference } = request.body;

    try {
      const result = await productSizeService.updateProductSize({
        id,
        label,
        labelSize,
        unit,
        circumference,
        jewelryTypeId,
      });
      return response.status(200).json({
        success: true,
        message: "Product size updated successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in Updating ProductSize: ${error}`);
      const prismaError = handlePrismaError(error);
      response.status(400).json({ success: false, message: error.message });
    }
  },

  async deleteProductSize(request, response) {
    const { id } = request.params;

    try {
      const result = await productSizeService.deleteProductSize(id);
      return response.status(200).json({
        success: true,
        message: "Product size deleted successfully",
        data: result,
      });
    } catch (error) {
      console.error(`Error in deleting ProductSize: ${error}`);
      response.status(400).json({ success: false, message: error.message });
    }
  },
};

export default productSizeController;
