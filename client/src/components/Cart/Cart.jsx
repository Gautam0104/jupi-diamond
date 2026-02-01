import React, { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { fetchCartByCustomer } from "../../api/Public/publicApi";
import { Skeleton } from "../ui/skeleton";
import { useCart } from "../../Context/CartContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { CurrencyContext } from "../../Context/CurrencyContext";
import { formatSizeUnit } from "../../lib/sizeUtils";

const renderProductImages = (productVariant, isCartItem = false) => (
  <div
    className={`relative ${
      isCartItem
        ? "w-20 h-20 sm:w-20 sm:h-20 md:w-24 md:h-24 "
        : "w-full aspect-square"
    }`}
  >
    <Swiper
      loop={true}
      pagination={
        !isCartItem
          ? {
              clickable: true,
            }
          : false
      }
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      modules={[Pagination, Autoplay]}
      className={`${isCartItem ? "w-full h-full" : "w-full aspect-square"}`}
    >
      {productVariant?.productVariantImage?.length === 0 ? (
        <SwiperSlide>
          <div className="flex items-center bg-gray-200 justify-center h-full w-full">
            <span className="text-gray-400 text-xs sm:text-sm font-semibold">
              No Image
            </span>
          </div>
        </SwiperSlide>
      ) : (
        productVariant?.productVariantImage?.map((image, index) => (
          <SwiperSlide key={`${image?.imageUrl}-${index}`}>
            {image?.imageUrl?.endsWith(".mp4") ? (
              <video
                src={image?.imageUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                aria-label={`${productVariant?.productVariantTitle} video ${
                  index + 1
                }`}
              />
            ) : (
              <img
                src={image?.imageUrl}
                alt={`${productVariant?.productVariantTitle} - ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            )}
          </SwiperSlide>
        ))
      )}
    </Swiper>
  </div>
);

const Cart = ({ onClose }) => {
  const { convertPrice, currency, getCurrencySymbol } =
    useContext(CurrencyContext);
  const {
    cartData,
    loading,
    updateItemQuantity,
    removeFromCart,
    isGuest,
    guestCart,
  } = useCart();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const displayPrice = (price) => {
    return `${getCurrencySymbol(currency)}${convertPrice(price).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  const handleQuantityChange = async (cartItemId, action) => {
    await updateItemQuantity(cartItemId, action);
  };

  const handleRemoveClick = (cartItemId) => {
    setItemToDelete(cartItemId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      setDeleteConfirmOpen(false);
      await removeFromCart(itemToDelete);
      setItemToDelete(null);
    }
  };

  const getCurrentCartItems = () => {
    if (isGuest) {
      return guestCart?.items || [];
    }
    return cartData?.cart?.cartItems || [];
  };

  const getCurrentCartSummary = () => {
    if (isGuest) {
      return {
        cartItemsCount: guestCart?.count || 0,
        grandTotal: guestCart?.total || 0,
      };
    }
    return (
      cartData?.cartSummery || {
        cartItemsCount: 0,
        grandTotal: 0,
      }
    );
  };

  const currentCartItems = getCurrentCartItems();
  const currentCartSummary = getCurrentCartSummary();

  if (loading && !isGuest) {
    return (
      <div className=" p-6 bg-white rounded shadow">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>

        <div className="space-y-4 md:space-y-6 overflow-auto">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex gap-3 md:gap-4 items-start border-b pb-3 md:pb-4"
            >
              <Skeleton className="w-20 h-20 md:w-36 md:h-36" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
        </div>

        <Skeleton className="w-full h-12 mt-4" />
      </div>
    );
  }

  return (
    <>
      <div className="h-full flex flex-col ">
        <div className="flex-shrink-0 flex justify-between items-center border-b pb-2 sm:pb-4 mb-2 sm:mb-4 px-4 md:px-4 xl:px-6 pt-4">
          <h2 className="text-md md:text-sm xl:text-lg font-medium">
            Your Cart{" "}
            {currentCartSummary?.cartItemsCount === 0
              ? ""
              : `(${currentCartSummary?.cartItemsCount})`}
          </h2>
          <button
            onClick={onClose}
            className="text-2xl xl:text-2xl hover:rotate-180 transition-all duration-300 ease-in-out cursor-pointer"
          >
            &times;
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-2 md:px-4">
          {currentCartItems?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center">
              <div className="relative w-full h-40 md:h-48 mb-6">
                <div className="absolute inset-4 flex items-center aspect-auto justify-center">
                  <img
                    src="/empty_cart.png"
                    alt="Empty Cart"
                    className="h-full w-full text-gray-400"
                    loading="lazy"
                  />
                </div>
              </div>

              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Your <span className="text-brown">Shopping Cart</span> is Empty
              </h3>
              <p className="text-gray-500 mb-6 text-[13px] md:text-base max-w-md">
                Looks like you haven't added anything to your cart yet. Let's
                get shopping!
              </p>

              <Link
                onClick={onClose}
                to={"/shop-all"}
                className="px-6 py-3 text-xs sm:text-sm bg-brown text-white rounded-full hover:bg-brown-dark transition-colors duration-300 shadow-sm hover:shadow-md"
              >
                Start Shopping Now
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-4 md:space-y-6 px-2">
                {currentCartItems.map((item) => {
                  const productVariant = isGuest
                    ? item.productVariant
                    : item.productVariant;

                  // For both guest and logged-in users
                  const selectedSize = isGuest
                    ? productVariant?.productSize?.find(
                        (size) => size.id === item.optionId
                      )
                    : item.productSize;

                  const selectedScrew = isGuest
                    ? productVariant?.ScrewOption?.find(
                        (screw) => screw.id === item.optionId
                      )
                    : item.screwOption;

                  // Generate labels for both options
                  const sizeLabel = selectedSize
                    ? `Size: ${selectedSize.label || selectedSize.labelSize} ${
                        productVariant?.products?.jewelryType.name.toLowerCase() ===
                        "bangles"
                          ? ""
                          : formatSizeUnit(selectedSize.unit)
                      } ${
                        selectedSize.circumference
                          ? `- ${selectedSize.circumference}`
                          : ""
                      } ${
                        productVariant?.products?.jewelryType.name.toLowerCase() ===
                        "bangles"
                          ? formatSizeUnit(selectedSize.unit)
                          : ""
                      }`
                    : null;

                  const screwLabel = selectedScrew
                    ? `Screw: ${selectedScrew.screwType} (${selectedScrew.screwMaterial})`
                    : null;

                  return (
                    <div
                      key={item.id}
                      className="flex gap-3 md:gap-4 items-start border-b pb-3 md:pb-4"
                    >
                      {renderProductImages(productVariant, true)}
                      <div className="flex-1 overflow-hidden">
                        <div className="flex flex-row sm:justify-between sm:items-start gap-1 md:gap-3">
                          <div>
                            <Link
                              onClick={onClose}
                              to={`/shop-all/details/${productVariant?.productVariantSlug}`}
                              className="hover:underline hover:text-black"
                            >
                              <p className="text-xs xl:text-sm font-semibold text-gray-800 line-clamp-2">
                                {productVariant?.productVariantTitle}
                              </p>
                            </Link>
                            {/* Display both size and screw options if they exist */}
                            {sizeLabel && (
                              <p className="text-[11px] sm:text-xs font-medium text-gray-500">
                                {sizeLabel}
                              </p>
                            )}
                            {screwLabel && (
                              <p className="text-[11px] sm:text-xs font-medium text-gray-500">
                                {screwLabel}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-col items-end md:items-center">
                            <div className="text-xs sm:text-sm xl:text-md font-bold text-black">
                              {displayPrice(item.priceAtAddition)}
                            </div>
                            <button
                              onClick={() => handleRemoveClick(item.id)}
                              className="text-xs text-red-500 hover:text-red-700 mt-1"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 md:mt-3 flex items-center border-2 w-20 md:w-20 justify-between px-2 md:px-2 py-0.5 md:py-1  border-brown">
                          <button
                            className={`text-sm ${
                              item.quantity <= 1 ? "cursor-not-allowed" : "cp"
                            } xl:text-sm text-gray-600 hover:text-black`}
                            onClick={() =>
                              handleQuantityChange(item.id, "decrement")
                            }
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span className="text-xs xl:text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            className="text-sm xl:text-sm text-gray-600 hover:text-black cp"
                            onClick={() =>
                              handleQuantityChange(item.id, "increment")
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="flex-shrink-0  pt-4 px-4 md:px-4 xl:px-6 py-4">
          {currentCartItems?.length > 0 && (
            <>
              <div className="flex justify-between text-sm md:text-sm xl:text-lg font-semibold">
                <span className="text-brown">Subtotal:</span>
                <span className="text-brown">
                  {displayPrice(currentCartSummary.grandTotal)}
                </span>
              </div>
              <Link
                to={"/shop-all"}
                onClick={onClose}
                className="block text-center w-full mt-4 text-sm md:text-sm xl:text-lg bg-white border-2 border-[#C68B73] text-[#C68B73] hover:bg-[#C68B73] hover:text-white transition-all duration-300 ease-in-out py-2"
              >
                Continue Shopping
              </Link>
              <Link
                to={isGuest ? "/login" : "/checkout"}
                onClick={onClose}
                state={{
                  from: { pathname: isGuest ? "/checkout" : "/checkout" },
                }}
                className="block text-center w-full mt-2 text-sm md:text-sm xl:text-lg bg-brown text-white py-2"
              >
                {isGuest ? "Login to Checkout" : "Checkout"}
              </Link>
            </>
          )}
        </div>

        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Removal</DialogTitle>
              <DialogDescription>
                Are you sure you want to remove this item from your cart?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className={"flex flex-row justify-end gap-3 "}>
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmOpen(false)}
                className="text-xs md:text-sm"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="text-xs md:text-sm"
                onClick={confirmDelete}
              >
                Remove
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Cart;
