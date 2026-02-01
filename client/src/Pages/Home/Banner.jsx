import React, { useEffect } from "react";
import { getPublicBanners } from "../../api/Public/publicApi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Banner = React.memo(({ banners }) => {
  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full group">
      <div className="absolute inset-y-0 left-0 z-20 flex items-center pl-2 md:pl-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button className="swiper-button-prev-custom cp bg-white bg-opacity-80 hover:bg-opacity-100 p-1 md:p-2 rounded-full shadow-lg transition-all duration-300 transform ">
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
      </div>

      <div className="absolute inset-y-0 right-0 z-20 flex items-center pr-2 md:pr-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button className="swiper-button-next-custom cp bg-white bg-opacity-80 hover:bg-opacity-100 p-1 md:p-2 rounded-full shadow-lg transition-all duration-300 transform ">
          <ChevronRight className="w-6 h-6 text-gray-800" />
        </button>
      </div>

      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        pagination={{
          clickable: true,
          el: ".swiper-pagination-custom",
          bulletClass: "swiper-pagination-bullet-custom",
          bulletActiveClass: "swiper-pagination-bullet-active-custom",
        }}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        className="w-full h-full"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-[450px] md:h-[500px] lg:h-[600px]">
              <div className="absolute top-24 sm:left-5 md:top-20 md:left-10 z-10 flex items-center justify-center px-4 md:px-8">
                {banner.title && (
                  <div className="bg-black/50 md:bg-transparent p-4 md:p-6 rounded-lg max-w-2xl transition-all duration-500 hover:scale-[1.03]">
                    <h2 className="text-xl md:text-3xl lg:text-5xl tracking-wide leading-[1.2] font-bold text-white mb-2 md:mb-3">
                      {banner.title || ""}
                    </h2>
                    <p className="text-xs md:text-base max-w-md text-gray-200 mb-5 md:mb-6">
                      {banner.subtitle || ""}
                    </p>
                    {banner.redirectUrl && (
                      <a
                        href={banner.redirectUrl}
                        className="inline-block px-5 py-1.5 md:px-6 md:py-2 bg-white text-black font-medium rounded-full hover:bg-opacity-90 transition duration-300 text-xs md:text-sm"
                      >
                        {banner.buttonName || "Shop Now"}
                      </a>
                    )}
                  </div>
                )}
              </div>

              <div className="md:hidden w-full h-full">
                {banner.mobileFiles.endsWith(".mp4") ? (
                  <video
                    src={banner.mobileFiles}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    aria-label={banner.title}
                  />
                ) : (
                  <img
                    src={banner.mobileFiles}
                    alt={banner.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="hidden md:block w-full h-full">
                {banner.imageUrl.endsWith(".mp4") ? (
                  <video
                    src={banner.imageUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    aria-label={banner.title}
                  />
                ) : (
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex swiper-pagination-custom absolute !bottom-3 md:!bottom-6 left-0 right-0 z-10  justify-center gap-2"></div>
    </div>
  );
});

export default Banner;
