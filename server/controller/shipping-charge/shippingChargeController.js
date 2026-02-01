import { successResponse } from "../../utils/responseHandler.js";
import { handlePrismaError } from "../../utils/handlePrismaError.js";
import shippingChargeService from "../../services/shipping-charge/shippingCharge.js";

const shippingChargeController = {
  // Create Shipping Charge
  async createShippingCharge(req, res) {
    const { name, price, content } = req.body;

    try {
      if (!name || !price || !content) {
        return res.status(400).json({
          success: false,
          message: "Name, price and content are required",
        });
      }

      const result = await shippingChargeService.createShippingCharge({
        name,
        price,
        content,
      });

      return successResponse(
        res,
        201,
        "Shipping charge created successfully",
        result
      );
    } catch (error) {
      // const prismaError = handlePrismaError(error);
      return res.json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        code: error.code,
      });
    }
  },

  // Get All Shipping Charges
  async getAllShippingCharges(req, res) {
    try {
      const result = await shippingChargeService.getAllShippingCharges();
      return successResponse(
        res,
        200,
        "Shipping charges fetched successfully",
        result
      );
    } catch (error) {
      // const prismaError = handlePrismaError(error);
      return res.json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        code: error.code,
      });
    }
  },
  async getShippingPublicCharges(req, res) {
    try {
      const result = await shippingChargeService.getAllShippingCharges();
      return successResponse(
        res,
        200,
        "Shipping charges fetched successfully",
        result
      );
    } catch (error) {
      // const prismaError = handlePrismaError(error);
      return res.json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        code: error.code,
      });
    }
  },

  // Get Shipping Charge by ID
  async getShippingChargeById(req, res) {
    const { id } = req.params;

    try {
      const result = await shippingChargeService.getShippingChargeById(id);
      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Shipping charge not found",
        });
      }

      return successResponse(
        res,
        200,
        "Shipping charge fetched successfully",
        result
      );
    } catch (error) {
      // const prismaError = handlePrismaError(error);
      return res.json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        code: error.code,
      });
    }
  },

  // Update Shipping Charge
  async updateShippingCharge(req, res) {
    const { id } = req.params;
    const { name, price, content } = req.body;

    try {
      const result = await shippingChargeService.updateShippingCharge(id, {
        name,
        price,
        content,
      });

      return successResponse(
        res,
        200,
        "Shipping charge updated successfully",
        result
      );
    } catch (error) {
      // const prismaError = handlePrismaError(error);
      return res.json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        code: error.code,
      });
    }
  },

  // Delete Shipping Charge
  async deleteShippingCharge(req, res) {
    const { id } = req.params;

    try {
      await shippingChargeService.deleteShippingCharge(id);
      return successResponse(res, 200, "Shipping charge deleted successfully");
    } catch (error) {
      // const prismaError = handlePrismaError(error);
      return res.json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        code: error.code,
      });
    }
  },
};

export default shippingChargeController;
