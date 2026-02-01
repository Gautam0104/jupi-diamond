import prisma from "../../config/prismaClient.js";
import cartService from "./cartService.js";
const MAX_QUANTITY = 10;
const cartItemService = {
  async addItem(
    cartId,
    productVariantId,
    optionId,
    quantity,
    finalPrice,
    stock,
    gst,
    GlobalDiscount,
    optionType // "SIZE" or "SCREW_OPTION"
  ) {
    // Validate option type
    if (optionId && !["SIZE", "SCREW_OPTION"].includes(optionType)) {
      throw {
        statusCode: 400,
        message: "Invalid option type. Must be 'SIZE' or 'SCREW_OPTION'",
      };
    }

    // Find existing item with same variant and option
    const whereClause = {
      cartId,
      productVariantId,
      ...(optionType === "SIZE" && { productSizeId: optionId }),
      ...(optionType === "SCREW_OPTION" && { screwOptionId: optionId }),
    };

    const existing = await prisma.cartItem.findFirst({
      where: whereClause,
    });

    const itemGst = gst * Number.parseInt(quantity);
    const itemDiscount = GlobalDiscount
      ? GlobalDiscount.discountValue * Number.parseInt(quantity)
      : 0;
    const grandTotal =
      finalPrice * Number.parseInt(quantity) + itemGst - itemDiscount;

    const newQuantity = existing
      ? existing.quantity + Number.parseInt(quantity)
      : Number.parseInt(quantity);

    if (newQuantity > MAX_QUANTITY) {
      throw {
        statusCode: 400,
        message: `Cannot exceed ${MAX_QUANTITY} units per item.`,
      };
    }

    if (stock < newQuantity) {
      throw {
        statusCode: 400,
        message: `Only ${stock} units available in stock.`,
      };
    }

    if (newQuantity <= 0 && existing) {
      await prisma.cartItem.delete({ where: { id: existing.id } });
      return { message: "Item removed from cart" };
    }

    const data = {
      cartId,
      productVariantId,
      quantity: Number.parseInt(quantity),
      priceAtAddition: finalPrice * Number.parseInt(quantity),
      optionType,
      ...(optionType === "SIZE" && { productSizeId: optionId }),
      ...(optionType === "SCREW_OPTION" && { screwOptionId: optionId }),
    };

    let result;
    if (existing) {
      result = await prisma.cartItem.update({
        where: { id: existing.id },
        data: {
          quantity: newQuantity,
          priceAtAddition: finalPrice * newQuantity,
        },
      });
    } else {
      result = await prisma.cartItem.create({
        data: {
          ...data,
          cartItemSlug: `item-${Date.now()}`,
        },
      });
    }

    await cartService.updateCartTotals(cartId);
    return result;
  },

  // This function checks if a cart exists for the user, and creates one if not
  async createCart(customerId = null, sessionId = null) {
    try {
      if (!customerId && !sessionId) {
        throw new Error(
          "Either customerId or retailerId or sessionId is required"
        );
      }

      // If cart exists for customer or retailer, return it
      if (customerId) {
        const existingCart = await prisma.cart.findUnique({
          where: { customerId },
        });
        if (existingCart) {
          return existingCart;
        }

        // If no cart exists, create a new one for the customer
        return await prisma.cart.create({
          data: { customerId },
        });
      }

      // if (retailerId) {
      //   const existingCart = await prisma.cart.findUnique({
      //     where: { retailerId },
      //   });
      //   if (existingCart) {
      //     return existingCart;
      //   }

      //   // If no cart exists, create a new one for the retailer
      //   return await prisma.cart.create({
      //     data: { retailerId },
      //   });
      // }

      // If sessionId exists, create a cart for guest user
      if (sessionId) {
        const existingCart = await prisma.cart.findUnique({
          where: { sessionId },
        });
        if (existingCart) {
          return existingCart;
        }

        return await prisma.cart.create({
          data: { sessionId },
        });
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  async updateCartItem({ cartId, cartItemId, quantity, action }) {
    console.log("updateCartItem");

    // Ensure all required fields are provided and quantity is valid
    if (!cartId || !cartItemId || quantity <= 0) {
      throw new Error("Missing fields or invalid quantity");
    }

    // Ensure action is valid
    if (action !== "increment" && action !== "decrement") {
      throw new Error("Invalid action. Use 'increment' or 'decrement'");
    }

    try {
      // Fetch the cart item to be updated
      const existingCartItem = await prisma.cartItem.findUnique({
        where: { id: cartItemId },
      });

      console.log("existingCartItem:", existingCartItem); // Log the existing cart item

      if (!existingCartItem) {
        throw new Error("Cart Item not found");
      }

      // Ensure the cart item belongs to the provided cartId
      if (existingCartItem.cartId !== cartId) {
        throw new Error("Cart Item does not belong to this cart");
      }

      const productVariant = await prisma.productVariant.findUnique({
        where: { id: existingCartItem.productVariantId },
        select: { finalPrice: true }, // Get the price of the product variant
      });

      if (!productVariant) {
        throw new Error(
          `Product variant with ID ${existingCartItem.productVariantId} not found`
        );
      }

      // Increment or decrement the quantity based on the action
      let newQuantity = existingCartItem.quantity;
      if (action === "increment") {
        newQuantity += 1; // Increase by 1
      } else if (action === "decrement") {
        newQuantity -= 1; // Decrease by 1
      }

      if (newQuantity < 1) {
        newQuantity = 1; // Prevent quantity from going below 1
      }

      if (productVariant.stock < newQuantity) {
        throw new Error("Out of stock");
      }

      const priceAtAddition = productVariant.finalPrice * newQuantity;

      // Update the cart item with the new quantity and price
      const updatedCartItem = await prisma.cartItem.update({
        where: { id: cartItemId },
        data: {
          quantity: newQuantity,
          priceAtAddition,
        },
      });
      await cartService.updateCartTotals(cartId);
      return updatedCartItem;
    } catch (error) {
      console.error("Error updating cart item:", error.message);
      throw error; // Propagate the error to the caller
    }
  },

  async deleteItemFromCart(cartItemId) {
    if (!cartItemId) {
      throw new Error("Missing fields");
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });
    if (!cartItem) {
      throw new Error("Cart Item not found");
    }

    const deletedItem = await prisma.cartItem.delete({
      where: { id: cartItemId },
    });
    const res = await cartService.updateCartTotals(cartItem.cartId);
    console.log("res=>", res);
    return deletedItem;
  },
};

export default cartItemService;
