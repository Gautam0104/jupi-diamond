import React, { createContext, useContext, useState, useEffect } from "react";
import {
  addItemToCart,
  deleteCartItem,
  fetchCartByCustomer,
  getProductDetails,
  updateCartItem,
} from "../api/Public/publicApi";
import { toast } from "sonner";
import useAuth from "../Hooks/useAuth";
import { useNavigate } from "react-router-dom";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartData, setCartData] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [buyNowLoading, setBuyNowLoading] = useState(false);
  const navigate = useNavigate();
  const [guestCart, setGuestCart] = useState(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("guestCart");
      return savedCart
        ? JSON.parse(savedCart)
        : { items: [], total: 0, count: 0 };
    }
    return { items: [], total: 0, count: 0 };
  });

  useEffect(() => {
    if (user) {
      fetchCart();
      setGuestCart({ items: [], total: 0, count: 0 });
      if (typeof window !== "undefined") {
        localStorage.removeItem("guestCart");
      }
    } else {
      setCartData(null);
      setCartCount(guestCart.count);
    }
  }, [user]);

  useEffect(() => {
    if (!user && typeof window !== "undefined") {
      localStorage.setItem("guestCart", JSON.stringify(guestCart));
    }
  }, [guestCart, user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await fetchCartByCustomer();
      setCartData(response.data.data);
      setCartCount(response.data.data?.cartSummery?.cartItemsCount || 0);
    } catch (error) {
      console.log("Error fetching cart:", error);
      toast.error("Failed to load cart data");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (
    productVariantId,
    optionId,
    quantity = 1,
    optionType
  ) => {
    setAddLoading(true);
    try {
      if (user) {
        const data = {
          productVariantId,
          quantity: quantity.toString(),
          optionId,
          optionType,
        };
        const response = await addItemToCart(data);
        await fetchCart();
        toast.success("Item added to cart");
        return { success: true, data: response.data };
      } else {
        // Guest user logic
        const res = await getProductDetails(productVariantId);
        const product = res.data?.data;

        // Find existing item with matching variant and option
        const existingItemIndex = guestCart.items.findIndex((item) => {
          const sameVariant = item.productVariantId === productVariantId;
          const sameOption = item.optionId === optionId;
          return sameVariant && sameOption;
        });

        let updatedItems;
        if (existingItemIndex >= 0) {
          updatedItems = [...guestCart.items];
          const newQuantity =
            updatedItems[existingItemIndex].quantity + quantity;
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: newQuantity,
            priceAtAddition: product.finalPrice * newQuantity,
          };
        } else {
          // Find the selected option details
          let optionDetails = null;
          if (optionType === "SIZE") {
            optionDetails = product.productVariant?.productSize?.find(
              (size) => size.id === optionId
            );
          } else if (optionType === "SCREW_OPTION") {
            optionDetails = product.productVariant?.ScrewOption?.find(
              (screw) => screw.id === optionId
            );
          }

          const newItem = {
            id: `guest-${Date.now()}`,
            productVariantId,
            optionId,
            optionType,
            optionDetails, // Store the full option details
            quantity,
            priceAtAddition: product.finalPrice * quantity,
            productVariant: product,
          };
          updatedItems = [...guestCart.items, newItem];
        }

        const newCount = updatedItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        const newTotal = updatedItems.reduce(
          (sum, item) => sum + item.priceAtAddition,
          0
        );

        setGuestCart({
          items: updatedItems,
          count: newCount,
          total: newTotal,
        });
        setCartCount(newCount);

        toast.success("Item added to cart");
        return { success: true };
      }
    } catch (error) {
      console.log("Error adding to cart:", error);
      const message =
        error.response?.data?.message ||
        (user
          ? "Failed to add item to cart"
          : "Failed to add item to guest cart");
      toast.error(message);
      return { success: false, message };
    } finally {
      setAddLoading(false);
    }
  };

  const updateItemQuantity = async (cartItemId, action) => {
    if (user) {
      if (!cartData) return { success: false, message: "Cart not loaded" };

      try {
        setCartData((prev) => {
          if (!prev?.cart?.cartItems) return prev;

          const updatedItems = prev.cart.cartItems.map((item) => {
            if (item.id === cartItemId) {
              const newQuantity =
                action === "increment"
                  ? item.quantity + 1
                  : Math.max(1, item.quantity - 1);

              return {
                ...item,
                quantity: newQuantity,
                priceAtAddition: newQuantity * item.productVariant.finalPrice,
              };
            }
            return item;
          });

          const newGrandTotal = updatedItems.reduce(
            (total, item) => total + item.priceAtAddition,
            0
          );

          return {
            ...prev,
            cart: {
              ...prev.cart,
              cartItems: updatedItems,
            },
            cartSummery: {
              ...prev.cartSummery,
              grandTotal: newGrandTotal,
            },
          };
        });

        const data = {
          quantity: 1,
          action,
        };

        const res = await updateCartItem(cartData.cart.id, cartItemId, data);
        fetchCart();
        return { success: true };
      } catch (error) {
        console.error("Error updating cart item:", error);
        const message =
          error.response?.data?.message || "Failed to update item quantity";
        toast.error(message);
        await fetchCart();
        return { success: false, message };
      }
    } else {
      try {
        const updatedItems = guestCart.items.map((item) => {
          if (item.id === cartItemId) {
            const newQuantity =
              action === "increment"
                ? item.quantity + 1
                : Math.max(1, item.quantity - 1);

            return {
              ...item,
              quantity: newQuantity,
              priceAtAddition: item.productVariant.finalPrice * newQuantity,
            };
          }
          return item;
        });

        const newCount = updatedItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        const newTotal = updatedItems.reduce(
          (sum, item) => sum + item.priceAtAddition,
          0
        );

        setGuestCart({
          items: updatedItems,
          count: newCount,
          total: newTotal,
        });
        setCartCount(newCount);

        return { success: true };
      } catch (error) {
        console.error("Error updating guest cart item:", error);
        toast.error("Failed to update item quantity");
        return { success: false, message: error.message };
      }
    }
  };

  const removeFromCart = async (cartItemId) => {
    if (user) {
      try {
        setCartData((prev) => {
          if (!prev?.cart?.cartItems) return prev;

          const updatedItems = prev.cart.cartItems.filter(
            (item) => item.id !== cartItemId
          );

          const newGrandTotal = updatedItems.reduce(
            (total, item) => total + item.priceAtAddition,
            0
          );

          return {
            ...prev,
            cart: {
              ...prev.cart,
              cartItems: updatedItems,
            },
            cartSummery: {
              ...prev.cartSummery,
              cartItemsCount: prev.cartSummery.cartItemsCount - 1,
              grandTotal: newGrandTotal,
            },
          };
        });

        setCartCount((prev) => prev - 1);
        await deleteCartItem(cartItemId);
        fetchCart();
        toast.success("Item removed from cart");
        return { success: true };
      } catch (error) {
        console.log("Error removing from cart:", error);
        toast.error("Failed to remove item from cart");
        await fetchCart();
        return { success: false, message: error.message };
      }
    } else {
      try {
        const updatedItems = guestCart.items.filter(
          (item) => item.id !== cartItemId
        );
        const newCount = updatedItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        const newTotal = updatedItems.reduce(
          (sum, item) => sum + item.priceAtAddition,
          0
        );

        setGuestCart({
          items: updatedItems,
          count: newCount,
          total: newTotal,
        });
        setCartCount(newCount);

        toast.success("Item removed from cart");
        return { success: true };
      } catch (error) {
        console.log("Error removing from guest cart:", error);
        toast.error("Failed to remove item from cart");
        return { success: false, message: error.message };
      }
    }
  };

  const isItemInCart = (productVariantId, optionId = null) => {
    if (user) {
      return (
        cartData?.cart?.cartItems?.some(
          (item) =>
            item.productVariant?.id === productVariantId &&
            (!optionId || item.optionId === optionId)
        ) || false
      );
    } else {
      return guestCart.items.some(
        (item) =>
          item.productVariantId === productVariantId &&
          (!optionId || item.optionId === optionId)
      );
    }
  };

  const getCurrentCart = () => {
    if (user) {
      return cartData;
    } else {
      return {
        cart: {
          cartItems: guestCart.items.map((item) => ({
            ...item,
            productVariant: item.productVariant,
            optionDetails: item.optionDetails,
          })),
          id: "guest-cart",
        },
        cartSummery: {
          cartItemsCount: guestCart.count,
          grandTotal: guestCart.total,
        },
      };
    }
  };

  const buyNow = async (
  productVariantId,
  optionId,
  quantity = 1,
  optionType
) => {
  setBuyNowLoading(true);
  try {
    if (!user) {
      // For guest users, add to guest cart and redirect to login
      const res = await getProductDetails(productVariantId);
      const product = res.data?.data;

      // Create guest cart with just this item
      const newItem = {
        id: `guest-${Date.now()}`,
        productVariantId,
        optionId,
        optionType,
        quantity,
        priceAtAddition: product.finalPrice * quantity,
        productVariant: product,
        isBuyNow: true, // Flag this as a buy now item
      };

      setGuestCart({
        items: [newItem],
        count: quantity,
        total: product.finalPrice * quantity,
      });

      // Redirect to login with state to indicate buy now flow
      navigate("/login", { 
        state: { 
          from: { 
            pathname: "/checkout",
            isBuyNow: true 
          },
          productData: { // Pass the product data along
            productVariantId,
            optionId,
            quantity,
            optionType
          }
        } 
      });
      return { success: true };
    } else {
      // For logged-in users, clear cart and add this single item
      if (cartData?.cart?.cartItems?.length > 0) {
        await Promise.all(
          cartData.cart.cartItems.map((item) => deleteCartItem(item.id))
        );
      }

      const data = {
        productVariantId,
        quantity: quantity.toString(),
        optionId,
        optionType,
      };

      const response = await addItemToCart(data);
      await fetchCart();
      navigate("/checkout");
      return { success: true, data: response.data };
    }
  } catch (error) {
    console.log("Error in buy now:", error);
    const message =
      error.response?.data?.message || "Failed to process your order";
    toast.error(message);
    return { success: false, message };
  } finally {
    setBuyNowLoading(false);
  }
};

  const value = {
    cartData: getCurrentCart(),
    cartCount,
    loading,
    guestCart,
    addLoading,
    buyNowLoading,
    setCartData,
    setCartCount,
    addToCart,
    updateItemQuantity,
    removeFromCart,
    fetchCart,
    isItemInCart,
    buyNow,
    isGuest: !user,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
