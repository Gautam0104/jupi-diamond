import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const collections = [
  {
    title: "Work Wear",
    image: "/home/Work-Wea.png",
    alt: "Diamond ring with blue stone",
    link: "/Work-Wear",
    dailyWear: "WORK_WEAR",
  },
  {
    title: "Everyday Wear",
    image: "/home/Everyday-Wear.png",
    alt: "Diamond Everyday Wear",
    link: "/Everyday-Wear",
    dailyWear: "EVERYDAY_WEAR",
  },
  {
    title: "The Party Edit",
    image: "/home/The-Party-Edit.png",
    alt: "Diamond necklace",
    link: "/The-Party-Edit",
    dailyWear: "PARTY_WEAR",
  },
  {
    title: "Statement Wear",
    image: "/home/Statement-Wear.png",
    alt: "Silver bracelet",
    link: "/Statement-Wear",
    dailyWear: "STATEMENT_WEAR",
  },
];

const generateShopAllUrl = (dailyWear) => {
  const baseUrl = "/shop-all";
  const queryParams = new URLSearchParams();

  queryParams.set("dailyWear", dailyWear);

  return queryParams.toString()
    ? `${baseUrl}?${queryParams.toString()}`
    : baseUrl;
};

const DailyWear = React.memo(() => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const carouselRef = useRef(null);

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].clientX;
    const diff = startX - x;

    if (diff > 5) {
      goToNext();
      setIsDragging(false);
    } else if (diff < -5) {
      goToPrev();
      setIsDragging(false);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === collections.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? collections.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-5 sm:py-10 px-4 sm:px-6 lg:px-12 bg-white text-center">
      <h2 className="text-xl sm:text-3xl md:text-2xl lg:text-3xl font-normal mb-2 sm:mb-10 md:mb-5 lg:mb-10">
        Daily Wear
      </h2>
      <div
        className="sm:hidden relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        ref={carouselRef}
      >
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {collections.map((item, index) => (
            <div key={index} className="w-full flex-shrink-0 px-2">
              <Link to={generateShopAllUrl(item.dailyWear)}>
                <div className="carousel-item-container">
                  <img
                    src={item.image}
                    alt={item.alt}
                    loading="lazy"
                    className="w-full h-68 object-fill"
                  />
                  <div className="carousel-item-title brown text-white py-2 font-medium text-sm sm:text-base">
                    {item.title}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className="hidden sm:grid grid-cols-1 overflow-y-auto sm:grid-cols-3 md:grid-cols-4 gap-4">
        {collections.map((item, index) => (
          <Link to={generateShopAllUrl(item.dailyWear)} key={index}>
            <div className="carousel-item-container">
              <img
                src={item.image}
                alt={item.alt}
                loading="lazy"
                className="w-full h-68 object-fill"
              />
              <div className="carousel-item-title brown text-white py-2 font-medium text-xs sm:text-base">
                {item.title}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
});

export default DailyWear;
