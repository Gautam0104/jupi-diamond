import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const RingStyle = React.memo(({ styles }) => {
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

  if (!styles || styles.length === 0) {
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
        Shop by Ring Style
      </h2>
      <p className="text-black max-w-5xl text-[11px] sm:text-sm md:text-sm lg:text-base  font-normal mx-auto mb-4 sm:mb-8 md:mb-4 lg:mb-8">
        Explore our curated for every occasion, crafted to shine forever
      </p>

      <div className="relative">
        <Swiper
          modules={[Navigation]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={handleSlideChange}
          spaceBetween={16}
          slidesPerView={1.2}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 4,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
          className="px-2"
        >
          {styles.map((item, index) => (
            <SwiperSlide key={index}>
              <Link to={generateShopAllUrl({ productStyleSlug: item.productStyleSlug, jewelryTypeSlug:"rings" })}>
                <div className="bg-white shadow-sm overflow-hidden border border-[#ce967e] hover:shadow-md transition-shadow group">
                  <div className="relative pt-[100%]">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      loading="lazy"
                      className="absolute top-0 left-0 w-full h-full object-fill group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute bottom-1 left-4 sm:left-6 md:left-3 lg:left-6 text-black py-2 font-medium text-base sm:text-xl md:text-sm lg:text-xl">
                    {item.name}
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          ref={navigationPrevRef}
          className={`absolute hidden sm:block cursor-pointer left-0 top-1/2 -translate-y-1/2 z-10 brown text-white p-1 rounded-md shadow-md hover:bg-gray-100 transition-all ${
            isBeginning ? "opacity-0 cursor-not-allowed" : ""
          }`}
          aria-label="Previous"
        >
          <FiChevronLeft size={20} />
        </button>

        <button
          ref={navigationNextRef}
          className={`absolute hidden sm:block cursor-pointer right-0 top-1/2 -translate-y-1/2 z-10 brown text-white p-1 rounded-md shadow-md hover:bg-gray-100 transition-all ${
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

export default RingStyle;
