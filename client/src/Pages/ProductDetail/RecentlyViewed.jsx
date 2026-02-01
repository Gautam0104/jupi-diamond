import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CurrencyContext } from "../../Context/CurrencyContext";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { FiImage } from "react-icons/fi";
import { AuthContext } from "../../Context/Auth";

const RecentlyViewed = React.memo(() => {
  const { convertPrice, currency, getCurrencySymbol } = useContext(CurrencyContext);
  const { recentlyViewed, addToRecentlyViewed } = useContext(AuthContext);
  const [localRecentlyViewed, setLocalRecentlyViewed] = useState([]);

  useEffect(() => {
    // Check localStorage for recently viewed items
    const storedItems = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    setLocalRecentlyViewed(storedItems);
  }, []);

  // Combine server-side and local storage recently viewed items
  const allRecentlyViewed = [...recentlyViewed, ...localRecentlyViewed]
    .filter((product, index, self) => 
      index === self.findIndex((p) => p.id === product.id)
    )
    .slice(0, 8); // Limit to 8 items

  if (allRecentlyViewed.length === 0) {
    return null;
  }
  

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
    <div className="px-0 pt-8 relative w-full">
      <h2 className="text-xl sm:text-2xl font-medium mb-3 sm:mb-6 text-black">
        Recently Viewed
      </h2>

      <div className="relative overflow-hidden">
        <div className="flex overflow-x-auto scrollbarWidthNone scrollbar-hide space-x-4 py-2 w-full">
          {allRecentlyViewed.map((product, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-[45vw] sm:w-[30vw] md:w-[22vw] lg:w-[15vw] hover:shadow-lg transition-shadow duration-300 ease-in-out"
            >
              <Link to={`/shop-all/details/${product?.productVariantSlug}`}>
                <div className="bg-white flex flex-col">
                  <div className="relative w-full aspect-square overflow-hidden">
                    {product.productVariantImage?.length > 0 ? (
                      <Swiper
                        loop={true}
                        autoplay={{
                          delay: 3000,
                          disableOnInteraction: false,
                        }}
                        pagination={{
                          clickable: true,
                        }}
                        modules={[Pagination, Autoplay]}
                        className="absolute inset-0 w-full h-full"
                      >
                        {product.productVariantImage.map((media, index) => (
                          <SwiperSlide key={index}>
                            {media.imageUrl.endsWith(".mp4") ? (
                              <video
                                src={media.imageUrl}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                                alt={`${product.products?.name} - Video ${index + 1}`}
                              />
                            ) : (
                              <img
                                src={media.imageUrl}
                                alt={`${product.products?.name} - ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    ) : (
                      <div className="absolute inset-0 w-full h-full bg-gray-100 flex flex-col items-center justify-center">
                        <FiImage className="h-6 w-6 text-gray-400" />
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="mt-2 py-1 px-3 line-clamp-2 text-[10px] md:text-sm xl:text-sm font-normal-snug text-gray-700 text-wrap">
                    {product.productVariantTitle?.slice(0, 50) + "..."}
                  </h3>
                  <div className="mt-0 sm:mt-2 p-1 font-normal">
                    <span className="ml-2 text-[11px] md:text-md xl:text-lg text-black font-semibold">
                      {displayPrice(product.finalPrice)}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default RecentlyViewed;