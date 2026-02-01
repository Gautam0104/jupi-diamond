import cartItemService from "../../services/cart/cartItemService.js";
import cartService from "../../services/cart/cartService.js";
import { getSessionId } from "../../utils/generateSession.js";
import { handlePrismaError } from "../../utils/handlePrismaError.js";

const cartItemController = {
  async addItemToCart(req, res) {
    try {
      const { productVariantId, quantity, optionId, optionType } = req.body;
      const user = req?.session?.user;
      const customerId = user?.id;
      const role = user?.role;

      // Basic validation
      if (!productVariantId || !quantity) {
        return res.status(400).json({
          success: false,
          message: "productVariantId and quantity are required",
        });
      }

      // Validate option if provided
      if (optionId && !optionType) {
        return res.status(400).json({
          success: false,
          message: "optionType is required when optionId is provided",
        });
      }

      // Role-based restriction (optional)
      if (customerId && !["CUSTOMER", "RETAILER"].includes(role)) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized role for cart operations",
        });
      }

      // Get or create cart
      const sessionId = null; // Or get from session if needed
      const cart = await cartService.getOrCreateCart({ customerId, sessionId });

      // Get variant details
      const { finalPrice, stock, gst, GlobalDiscount } =
        await cartService.getProductVariant(productVariantId);

      // Add item to cart
      const item = await cartItemService.addItem(
        cart.id,
        productVariantId,
        optionId,
        quantity,
        finalPrice,
        stock,
        gst,
        GlobalDiscount,
        optionType
      );

      return res.status(200).json({
        success: true,
        message: "Cart updated successfully",
        data: item,
      });
    } catch (error) {
      console.error("Add to cart error:", error);
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  },

  async updateCartItem(request, response) {
    const { cartId, cartItemId } = request.params;
    const { quantity, action } = request.body;

    const parsedQuantity = Number(quantity);
    if (isNaN(parsedQuantity)) {
      return response
        .status(400)
        .json({ message: "Quantity must be a number" });
    }

    try {
      const result = await cartItemService.updateCartItem({
        cartId,
        cartItemId,
        parsedQuantity,
        action,
      });
      return response.status(200).json({
        message: "Cart item updated successfully",
        success: true,
        data: result,
      });
    } catch (error) {
      console.error(`Error in Updating ProductVariant from cart ${error}`);

      const prismaError = handlePrismaError(error);
      return response.json({
        statusCode: prismaError.statusCode,
        message: prismaError.message,
        success: false,
        code: prismaError.code,
      });
    }
  },

  async deleteItemFromCart(request, response) {
    const { cartItemId } = request.params;

    try {
      const result = await cartItemService.deleteItemFromCart(cartItemId);

      return response.status(200).json({
        message: "Item deleted from cart successfully",
        success: true,
        data: result,
      });
    } catch (error) {
      console.error(`Error in Deleteing ProductVariant from cart ${error}`);
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
export default cartItemController;
