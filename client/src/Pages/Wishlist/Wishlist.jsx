import React, { useContext } from "react";
import { useWishlist } from "../../Context/WishlistContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { Skeleton } from "../../components/ui/skeleton";
import { CurrencyContext } from "../../Context/CurrencyContext";
import { FiShoppingBag, FiTrash2 } from "react-icons/fi";
import { FaRegImage } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FaHeartBroken } from "react-icons/fa";

export function WishlistTableSkeleton() {
  return (
    <div className="hidden lg:block overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-[#F1CEC0] text-center text-sm uppercase">
            <th className="p-4 font-medium">Remove</th>
            <th className="p-4 font-medium">Image</th>
            <th className="p-4 font-medium">Title</th>
            <th className="p-4 font-medium">Price</th>
            <th className="p-4 font-medium">Quantity</th>
            <th className="p-4 font-medium">Add to Cart</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
            >
              <td className="p-4 text-center">
                <Skeleton className="h-6 w-6 mx-auto" />
              </td>
              <td className="p-4">
                <div className="flex justify-center items-center">
                  <Skeleton className="h-16 w-16 rounded" />
                </div>
              </td>
              <td className="p-4">
                <Skeleton className="h-4 w-32 mx-auto" />
              </td>
              <td className="p-4">
                <Skeleton className="h-4 w-20 mx-auto" />
              </td>
              <td className="p-4">
                <Skeleton className="h-4 w-8 mx-auto" />
              </td>
              <td className="p-4">
                <div className="flex justify-center items-center">
                  <Skeleton className="h-10 w-32" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MobileWishlistSkeleton() {
  return (
    <div className="lg:hidden border-t-2">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="border-b py-4">
          <div className="flex justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
          <div className="mt-4 flex justify-between items-center">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-24 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

const Wishlist = ({ onClose }) => {
  const { convertPrice, currency, getCurrencySymbol } =
    useContext(CurrencyContext);
  const { wishlistItems, wishlistCount, removeFromWishlist, loading, error } =
    useWishlist();


  if (error) return null;

  const renderProductImages = (productVariant) => (
    <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-16 md:h-16 aspect-square">
      <Swiper
        loop={true}
        pagination={false}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        modules={[Pagination, Autoplay]}
        className="w-full h-full"
      >
        {productVariant.productVariantImage.length === 0 ? (
          <SwiperSlide>
            <div className="flex items-center bg-gray-200 justify-center h-full w-full border-2 border-dashed border-gray-300 ">
              <span className="text-gray-400 font-semibold text-lg sm:text-xl">
                <FaRegImage />
              </span>
            </div>
          </SwiperSlide>
        ) : (
          productVariant.productVariantImage.map((image, index) => (
            <SwiperSlide key={`${image.imageUrl}-${index}`}>
              <div className="w-full h-full flex items-center justify-center aspect-square">
                {image.imageUrl.endsWith(".mp4") ? (
                  <video
                    src={image.imageUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-fill aspect-square"
                    aria-label={`${productVariant.productVariantTitle} video ${
                      index + 1
                    }`}
                  >
                    <source src={image.imageUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={image.imageUrl}
                    alt={`${productVariant.productVariantTitle} - ${index + 1}`}
                    className="w-full h-full object-fill aspect-square"
                    loading="lazy"
                  />
                )}
              </div>
            </SwiperSlide>
          ))
        )}
      </Swiper>
    </div>
  );

  const displayPrice = (price) => {
    return `${getCurrencySymbol(currency)}${convertPrice(price).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  return (
    <div className="container mx-auto px-4 md:px-6   h-full">
      <div className="top-0 sticky md:relative z-50 md:z-0 bg-white py-2 flex justify-between items-center ">
        <h2 className="text-[16px] md:text-sm xl:text-lg  font-medium">
          My Wishlist {wishlistCount === 0 ? "" : `(${wishlistCount})`}
        </h2>
        <button
          onClick={onClose}
          className="text-2xl xl:text-2xl cp cursor-pointer lg:hidden"
        >
          &times;
        </button>
      </div>

      {/* Mobile View */}
      {loading ? (
        <MobileWishlistSkeleton />
      ) : (
        <div className="lg:hidden border-t-2 overflow-y-auto h-[88vh] scrollbarWidthNone">
          {wishlistItems.length === 0 ? (
            <>
              <div
                className="flex flex-col items-center justify-center h-96 bg-white rounded-lg"
                aria-live="polite"
                role="status"
              >
                <img
                  src="/wishlistImg.webp"
                  loading="lazy"
                  alt="Wishlist Empty"
                  className="w-40 h-32 opacity-90"
                  aria-hidden="true"
                />
                <div className="text-center py-4 space-y-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    Your wishlist is empty
                  </h3>
                  <p className="text-sm text-gray-500">
                    Start saving your favorite items here
                  </p>
                </div>
              </div>
            </>
          ) : (
            wishlistItems.map((item) => (
              <div key={item?.id} className="border-b py-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-4">
                    {renderProductImages(item?.productVariant)}
                    <div>
                      <h3 className="text-[13px] sm:text-sm font-medium pb-2 w-[200px] text-pretty">
                        {item?.productVariant?.productVariantTitle}
                      </h3>
                      <p className="text-xs sm:text-sm">
                        From {displayPrice(item?.productVariant?.finalPrice)}
                      </p>
                    </div>
                  </div>
                  <button
                    className="  text-gray-700  hover:text-red-500 transform transition-all duration-300 ease-in-out"
                    onClick={() => removeFromWishlist(item?.id)}
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-2 flex text-xs sm:text-sm justify-end items-center">
                  <Link
                    to={`/shop-all/details/${item.productVariant?.productVariantSlug}`}
                    onClick={onClose}
                    className="cursor-pointer"
                  >
                    <button className="w-full flex items-center justify-center gap-2 bg-brown hover:bg-brown-dark text-white py-2 px-4 rounded text-xs font-medium transition-colors">
                      <FiShoppingBag className="w-4 h-4" />
                      View Product
                    </button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Desktop View */}
      {loading ? (
        <WishlistTableSkeleton />
      ) : (
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-[#F1CEC0] text-center text-sm lg:text-xs xl:text-sm uppercase">
                <th className="p-4 font-medium">Remove</th>
                <th className="p-4 font-medium">Image</th>
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {wishlistItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-4 bg-gray-100 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <h3 className="text-md font-medium text-gray-900">
                        Your wishlist is empty
                      </h3>
                    </div>
                  </td>
                </tr>
              ) : (
                wishlistItems?.map((item, index) => (
                  <tr
                    key={item?.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                  >
                    <td className="p-4 text-center  cursor-pointer ">
                      <button
                        onClick={() => removeFromWishlist(item?.id)}
                        className="text-gray-500 hover:text-red-500 text-md cp transition-colors duration-300 "
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                    <td className="p-4 text-sm lg:text-xs xl:text-sm ">
                      <div className="flex justify-center item?s-center">
                        {renderProductImages(item?.productVariant)}
                      </div>
                    </td>
                    <td className="p-4 text-sm lg:text-xs xl:text-sm  text-center">
                      {item?.productVariant?.productVariantTitle}
                    </td>
                    <td className="p-4 text-sm lg:text-xs xl:text-sm  text-center">
                      {displayPrice(item?.productVariant?.finalPrice)}
                    </td>
                    <td className="p-4   ">
                      <div className="flex justify-center items-center">
                        <Link
                          to={`/shop-all/details/${item.productVariant?.productVariantSlug}`}
                          className="cursor-pointer"
                        >
                          <button className="flex items-center gap-2 cp bg-[#F1CEC0] hover:shadow-sm text-black py-2 px-5 rounded text-sm  lg:text-xs xl:text-sm font-medium transition-colors">
                            <FiShoppingBag className="w-4 h-4" />
                            View
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
