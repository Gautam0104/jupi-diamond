import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const collections = [
  {
    title: "1 Carat Diamond Rings",
    image: "/home/Caret1.png",
    alt: "Diamond ring with blue stone",
    link: "1",
  },
  {
    title: "2 Carat Diamond Rings",
    image: "/home/Caret2.png",
    alt: "Diamond earrings",
    link: "2",
  },
  {
    title: "3 Carat Diamond Rings",
    image: "/home/Caret3.png",
    alt: "Diamond necklace",
    link: "3",
  },
  {
    title: "4 Carat Diamond Earrings",
    image: "/home/Caret4.png",
    alt: "Silver bracelet",
    link: "4",
  },
  {
    title: "5 Carat Diamond Rings",
    image: "/home/Caret1.png",
    alt: "Diamond ring with blue stone",
    link: "5",
  },
  {
    title: "6 Carat Diamond Rings",
    image: "/home/Caret2.png",
    alt: "Diamond earrings",
    link: "6",
  },
  {
    title: "7 Carat Diamond Rings",
    image: "/home/Caret3.png",
    alt: "Diamond necklace",
    link: "7",
  },
  {
    title: "8 Carat Diamond Earrings",
    image: "/home/Caret4.png",
    alt: "Silver bracelet",
    link: "8",
  },
];

const Carat = React.memo(() => {
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
        Shop by Carat Weight
      </h2>

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
              slidesPerView: 5,
            },
          }}
          className="px-2"
        >
          {collections.map((item, index) => (
            <SwiperSlide key={index}>
              <Link
                to={generateShopAllUrl({ caratWeight: item.link })}
                className="effect"
              >
                <div className="bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow shine-wrapper">
                  <div className="relative pt-[100%]">
                    <img
                      src={item.image}
                      alt={item.alt}
                      loading="lazy"
                      className="absolute top-0 left-0 w-full h-full object-fill  transition-transform duration-300"
                    />
                  </div>
                  <div className="bg-[#C68B73] text-white py-2 font-medium text-[10px] sm:text-base md:text-[9px] xl:text-base">
                    {item.title}
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

export default Carat;
