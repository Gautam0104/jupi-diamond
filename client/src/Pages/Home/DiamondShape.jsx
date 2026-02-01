import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";



const DiamondShape = React.memo(({ shapes }) => {
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

  if (!shapes || shapes.length === 0) {
    return null;
  }

  const generateShopAllUrl = (params) => {
    const baseUrl = "/shop-all";
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        queryParams.set(key, value);
      }
    });

    return queryParams.toString()
      ? `${baseUrl}?${queryParams.toString()}`
      : baseUrl;
  };

  return (
    <section className="py-5 sm:py-10 px-4 sm:px-6 lg:px-12 bg-white text-center relative">
      <h2 className="text-xl sm:text-3xl md:text-2xl lg:text-3xl font-normal mb-2 sm:mb-3 md:mb-2 lg:mb-3">
        Shop by Diamond Shape
      </h2>
      <p className="text-black max-w-5xl text-[11px] sm:text-sm md:text-sm md:max-w-xl lg:max-w-full lg:text-base font-normal mx-auto mb-8  md:mb-4 lg:mb-8">
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
              slidesPerView: 4,
            },
            1024: {
              slidesPerView: 6,
            },
          }}
          className="px-2"
        >
          {shapes.map((item, index) => (
            <SwiperSlide key={index}>
              <Link
                to={generateShopAllUrl({ gemstoneVariantSlug: item.gemstoneVariantSlug })}
                aria-label={`View details for ${item.shape} diamond with ${item.clarity} clarity`}
                className="effect"
              >
                <div className="bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow shine-wrapper">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={`${item.shape} diamond`}
                      loading="lazy"
                      className="w-full h-full object-cover aspect-square transition-transform duration-300 "
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center aspect-square">
                      <span className="text-gray-500"> No Image</span>
                    </div>
                  )}
                  <div className="bg-[#C68B73] text-white py-2 font-medium text-xs md:text-sm lg:text-[10px] xl:text-base text-center">
                    {item.shape}
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

export default DiamondShape;
