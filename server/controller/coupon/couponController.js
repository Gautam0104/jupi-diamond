import couponService from "../../services/coupon/couponService.js";
import { successResponse } from "../../utils/responseHandler.js";
import { handlePrismaError } from "../../utils/handlePrismaError.js";
import applyCouponUtil from "../../utils/applyCoupon.js";

const couponController = {
  async createCoupon(request, response) {
    try {
      const result = await couponService.createCoupon(request.body);
      return successResponse(
        response,
        201,
        "coupon created Successfully",
        result
      );
    } catch (error) {
      console.error(`Error in Creating Coupon: ${error}`);

      // const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        code: error.code,
      });
    }
  },

  async getCoupon(request, response) {
    try {
      const result = await couponService.getCoupon(request.query);
      return successResponse(
        response,
        200,
        "Coupones fetched successfully",
        result
      );
    } catch (error) {
      console.error(`Error in getting coupon: ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async getCouponById(request, response) {
    const { id } = request.params;
    try {
      const result = await couponService.getCouponById(id);
      return successResponse(
        response,
        200,
        "Coupones fetched successfully",
        result
      );
    } catch (error) {
      console.error(`Error in getting couponById: ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async deleteCoupon(request, response) {
    const { id } = request.params;
    try {
      const result = await couponService.deleteCoupon(id);
      return successResponse(
        response,
        200,
        "Coupones Deleted successfully",
        result
      );
    } catch (error) {
      console.error(`Error in deleting coupon: ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async updateCoupon(request, response) {
    const { id } = request.params;

    try {
      const result = await couponService.updateCoupon({
        ...request.body,
        id,
      });
      return successResponse(
        response,
        201,
        "coupon updated Successfully",
        result
      );
    } catch (error) {
      console.error(`Error in updating coupon: ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },
  //coupone active/inactive.........................
  async updateCouponStatus(request, response) {
    const { id } = request.params;
    try {
      const result = await couponService.updateCouponStatus(id);
      return successResponse(
        response,
        201,
        "coupon status updated Successfully",
        result
      );
    } catch (error) {
      console.error(`Error in updating coupon: ${error}`);

      return response.json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        code: error.code,
      });
    }
  },

  async applyCoupon(req, res) {
    const userId = req.session?.user?.id;
    console.log("userId==>", userId);
    try {
      const result = await applyCouponUtil({ ...req.body, userId });
      return successResponse(res, 200, "Coupon applied successfully", result);
    } catch (error) {
      return res.json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        code: error.code,
      });
    }
  },
};

export default couponController;
