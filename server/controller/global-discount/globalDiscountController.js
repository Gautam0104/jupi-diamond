import globalDiscountService from "../../services/global-discount/globalDiscountServices.js";

const globalDiscountController = {
  async createGlobalDiscountController(req, res, next) {
    try {
      const result = await globalDiscountService.createGlobalDiscountService(
        req.body
      );
      res.status(201).json({ message: "Created", data: result });
    } catch (err) {
      next(err);
    }
  },

  async getAllGlobalDiscountsController(req, res, next) {
    try {
      const result = await globalDiscountService.getAllGlobalDiscountsService(
        req.query
      );
      res.status(200).json({ message: "All Discounts", data: result });
    } catch (err) {
      next(err);
    }
  },

  async getGlobalDiscountByIdController(req, res, next) {
    try {
      const result = await globalDiscountService.getGlobalDiscountByIdService(
        req.params.id
      );
      res.status(200).json({ message: "Fetched", data: result });
    } catch (err) {
      next(err);
    }
  },

  async updateGlobalDiscountController(req, res, next) {
    try {
      const result = await globalDiscountService.updateGlobalDiscountService(
        req.params.id,
        req.body
      );
      res.status(200).json({ message: "Updated", data: result });
    } catch (err) {
      next(err);
    }
  },

  async deleteGlobalDiscountController(req, res, next) {
    try {
      const result = await globalDiscountService.deleteGlobalDiscountService(
        req.params.id
      );
      res.status(200).json({ message: "Deleted", data: result });
    } catch (err) {
      next(err);
    }
  },

  async applyDiscountToMultiple(req, res) {
    const { discountId } = req.params;
    const { variantIds } = req.body;

    try {
      const result =
        await globalDiscountService.applyDiscountToMultipleVariants(
          discountId,
          variantIds
        );
      return res.status(200).json({
        success: true,
        message: "Discount applied to eligible variants",
        data: result,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  },

  async removeDiscountHandler(req, res) {
    const { variantIds } = req.body;
    try {
      const result =
        await globalDiscountService.removeDiscountFromVariants(variantIds);
      return res.status(200).json({
        success: true,
        message: "Discounts removed from variants",
        data: result,
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Failed to remove discounts",
      });
    }
  },
};

export default globalDiscountController;
