import { giftCardService } from "../../services/gift/giftService.js";
import { successResponse, errorResponse } from "../../utils/responseHandler.js";

export const adminGiftCardController = {
  // CREATE
  async createGiftCard(req, res) {
    try {
      if (!req?.session?.admin?.id) {
        throw new Error("Unauthorized please login!");
      }

      const { assignedToId, value, expiresAt } = req.body;
      if (!assignedToId || !value) {
        return errorResponse(res, 400, "assignedToId and value are required");
      }
      const giftCard = await giftCardService.createGiftCard({
        assignedToId,
        value: parseFloat(value),
        expiresAt,
        createdById: req?.session?.admin?.id,
      });
      return successResponse(
        res,
        201,
        "Gift card created successfully",
        giftCard
      );
    } catch (error) {
      return res.json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        code: error.code,
      });
    }
  },

  // READ ALL
  async getAllGiftCards(req, res) {
    try {
      const { search, isRedeemed } = req.query;
      const giftCards = await giftCardService.getAllGiftCards({
        search,
        isRedeemed,
      });
      return successResponse(
        res,
        200,
        "Gift cards fetched successfully",
        giftCards
      );
    } catch (error) {
      return res.json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        code: error.code,
      });
    }
  },

  // READ ONE
  async getGiftCardById(req, res) {
    try {
      const { id } = req.params;
      const giftCard = await giftCardService.getGiftCardById(id);
      if (!giftCard) return errorResponse(res, 404, "Gift card not found");
      return successResponse(
        res,
        200,
        "Gift card fetched successfully",
        giftCard
      );
    } catch (error) {
      return res.json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        code: error.code,
      });
    }
  },

  // UPDATE
  async updateGiftCard(req, res) {
    try {
      const { id } = req.params;
      const { value, expiresAt } = req.body;
      const giftCard = await giftCardService.updateGiftCard(id, {
        value,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      });
      return successResponse(
        res,
        200,
        "Gift card updated successfully",
        giftCard
      );
    } catch (error) {
      return res.json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        code: error.code,
      });
    }
  },

  // DELETE
  async deleteGiftCard(req, res) {
    try {
      const { id } = req.params;
      await giftCardService.deleteGiftCard(id);
      return successResponse(res, 200, "Gift card deleted successfully");
    } catch (error) {
      return res.json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        code: error.code,
      });
    }
  },

  async redeemGiftCard(req, res) {
    try {
      const { code,orderValue } = req.body;

      console.log(req.body);
      
      if (!code) {
        return errorResponse(res, 400, "code is required");
      }
      const result = await giftCardService.redeemGiftCard({
        code,
        customerId: req?.session?.user?.id,
        orderValue
      });

      return successResponse(
        res,
        200,
        "Gift card redeemed successfully",
        result
      );
      
    } catch (error) {
      return res.json({
        statusCode: error.statusCode,
        message: error.message,
        success: false,
        code: error.code,
      });
    }
  },

  // Get my gift cards
  async getMyGiftCards(req, res) {
    try {
      const customerId = req?.session?.user?.id;
      const giftCards =
        await giftCardService.getGiftCardsByCustomer(customerId);
      return successResponse(
        res,
        200,
        "Gift cards fetched successfully",
        giftCards
      );
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
