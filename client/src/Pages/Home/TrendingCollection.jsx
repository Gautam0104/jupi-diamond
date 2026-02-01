import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { FaRegImage } from "react-icons/fa6";

const TrendingCollections = React.memo(({ products }) => {
  if (!products || products.length === 0) {
    return null;
  }

  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef(null);

  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  useEffect(() => {
    if (
      swiperRef.current &&
      navigationPrevRef.current &&
      navigationNextRef.current
    ) {
      swiperRef.current.params.navigation.prevEl = navigationPrevRef.current;
      swiperRef.current.params.navigation.nextEl = navigationNextRef.current;
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, []);

  const renderProductComapreImages = (product) => (
    <div className="relative  aspect-square">
      <Swiper
        loop={true}
        pagination={false}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        modules={[Pagination, Autoplay]}
        className="w-full aspect-square"
      >
        {product.productVariantImage.length === 0 ? (
          <SwiperSlide>
            <div className="group relative flex items-center justify-center h-full w-full aspect-square bg-gray-50  border-2 border-dashed border-gray-300  transition-colors duration-200 cursor-pointer overflow-hidden">
              <span className="text-gray-400 transition-colors duration-200">
                <FaRegImage className="w-8 h-8 sm:w-10 sm:h-10 xl:w-12 xl:h-12" />
              </span>

              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-200" />
            </div>
          </SwiperSlide>
        ) : (
          product.productVariantImage.map((image, index) => (
            <SwiperSlide key={`${image.imageUrl}-${index}`}>
              {image.imageUrl.endsWith(".mp4") ? (
                <video
                  src={image.imageUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover aspect-square"
                  aria-label={`${product.productVariantTitle} video ${
                    index + 1
                  }`}
                />
              ) : (
                <img
                  src={image.imageUrl}
                  alt={`${product.productVariantTitle} - ${index + 1}`}
                  className="w-full h-full object-cover aspect-square"
                  loading="lazy"
                />
              )}
            </SwiperSlide>
          ))
        )}
      </Swiper>
    </div>
  );

  return (
    <section className="py-5 sm:py-10 px-4 sm:px-6 lg:px-12 bg-[#FAF8F8] text-center">
      <h2 className="text-xl sm:text-3xl md:text-2xl lg:text-3xl font-normal mb-2 sm:mb-4 md:mb-2 lg:mb-3">
        Trending Products
      </h2>
      <p className="text-black max-w-5xl text-[11px] sm:text-sm md:text-sm md:max-w-xl lg:max-w-full lg:text-base font-normal mx-auto mb-6 sm:mb-8  md:mb-4 lg:mb-8 px-4 sm:px-0">
        Discover our latest curated pieces from timeless classics to bold
        statements, crafted to elevate every look.
      </p>

      <div className="relative">
        <Swiper
          modules={[Navigation]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={handleSlideChange}
          spaceBetween={16}
          slidesPerView={2}
          breakpoints={{
            640: {
              slidesPerView: 3,
            },
            768: {
              slidesPerView: 5,
            },
            1024: {
              slidesPerView: 6,
            },
          }}
          className="px-2"
        >
          {products.map((item, index) => (
            <SwiperSlide key={index}>
              <Link
                to={`/shop-all/details/${item?.productVariantSlug}`}
                key={index}
                className="min-w-[170px] md:min-w-0 group effect"
              >
                <div className="bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md shine-wrapper">
                  <div className="relative  overflow-hidden">
                    {renderProductComapreImages(item)}
                  </div>
                  <div className="brown text-white py-2 px-3 truncate font-medium text-xs sm:text-base md:text-[8px] lg:text-[12px] xl:text-base transition-colors duration-300 group-hover:bg-brown-dark">
                    {item.productVariantTitle}
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          ref={navigationPrevRef}
          className={`absolute cursor-pointer left-0 top-1/2 -translate-y-1/2 z-10 brown text-white p-1 rounded-md shadow-md hover:bg-gray-100 transition-all ${
            isBeginning ? "opacity-0 cursor-not-allowed" : ""
          }`}
          aria-label="Previous"
        >
          <FiChevronLeft size={20} />
        </button>

        <button
          ref={navigationNextRef}
          className={`absolute cursor-pointer right-0 top-1/2 -translate-y-1/2 z-10 brown text-white p-1 rounded-md shadow-md hover:bg-gray-100 transition-all ${
            isEnd ? "opacity-0 cursor-not-allowed" : ""
          }`}
          aria-label="Next"
        >
          <FiChevronRight size={20} />
        </button>
      </div>
    </section>
  );
});

export default TrendingCollections;
