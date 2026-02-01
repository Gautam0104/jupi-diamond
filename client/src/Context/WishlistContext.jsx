import React, { createContext, useContext, useState, useEffect } from "react";
import { axiosPrivate } from "../api/axios";
import {
  addToWish,
  getWishlistItems,
  removeFromWish,
} from "../api/Public/publicApi";
import { toast } from "sonner";
import useAuth from "../Hooks/useAuth";
import { useNavigate } from "react-router-dom";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [addWishLoading, setAddWishLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch wishlist items from API
  const fetchWishlistItems = async () => {
    try {
      setLoading(true);
      const response = await getWishlistItems();

      setWishlistItems(response?.data);
      setWishlistCount(response?.data?.length);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
    if (user) {
      fetchWishlistItems();
    } else {
      setWishlistItems([]);
      setWishlistCount(0);
    }
  }, [user]);

  // Add item to wishlist
  const addToWishlist = async (productVariantId) => {
    if (!user) {
      toast.error("Please login to add items to wishlist");
      navigate("/login");
      return { success: false, message: "User not logged in" };
    }
    try {
      setAddWishLoading(true);
      await addToWish({ productVariantId });
      await fetchWishlistItems();
      toast.success("Item added to wishlist");
    } catch (err) {
      setError(err.message);
    } finally {
      setAddWishLoading(false);
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (itemId) => {
    try {
      setLoading(true);
      await removeFromWish(itemId);
      setWishlistItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemId)
      );
      setWishlistCount((prevCount) => prevCount - 1);
      toast.success("Item removed from wishlist");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productVariantId) => {
    return wishlistItems.some(
      (item) => item.productVariantId === productVariantId
    );
  };

 



  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount,
        loading,
        addWishLoading,
        error,
        fetchWishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
