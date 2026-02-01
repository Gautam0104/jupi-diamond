import React from "react";
import { Link } from "react-router-dom";

const GiftsByOccasion = React.memo(({ occasions }) => {
  if (!occasions || occasions.length === 0) {
    return null;
  }

  const generateShopAllUrl = (occasionSlug , isGift) => {
    const baseUrl = "/shop-all";
    const queryParams = new URLSearchParams();

    if (occasionSlug) {
      queryParams.set("occasionSlug", occasionSlug);
    }

    if (isGift) {
      queryParams.set("isGift", isGift);
    }

    return queryParams.toString()
      ? `${baseUrl}?${queryParams.toString()}`
      : baseUrl;
  };

  return (
    <section className="py-5 sm:py-10 px-4 sm:px-6 lg:px-12 bg-white ">
      <h2 className="text-xl sm:text-3xl md:text-2xl lg:text-3xl font-normal mb-2 sm:mb-8 md:mb-5 lg:mb-10 text-black text-center">
        Gifts By Occasion
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
        <Link
          to={generateShopAllUrl(occasions[0].occasionSlug,true)}
          className="sm:col-span-2 group block"
        >
          <div className="jewelry-card relative overflow-hidden shadow-md">
            <img
              src={occasions[0].imageUrl}
              alt={occasions[0].name}
              className="w-full h-80 object-fill transform transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute bottom-0 tracking-wide w-full bg-black/50 text-white py-2 text-sm sm:text-base font-medium px-4">
              {occasions[0].name} GIFTS
            </div>
          </div>
        </Link>

        <Link
          to={generateShopAllUrl(occasions[1].occasionSlug,true)}
          className="sm:col-span-2 group"
        >
          <div className="jewelry-card relative overflow-hidden shadow-md">
            <img
              src={occasions[1].imageUrl}
              alt={occasions[1].name}
              className="w-full h-80 object-fill transform transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute bottom-0 tracking-wide w-full bg-black/50 text-white py-2 text-sm sm:text-base font-medium px-4">
              {occasions[1].name} GIFTS
            </div>
          </div>
        </Link>
      </div>
      <div className="flex  overflow-x-auto  scrollbarWidthNone gap-6 mt-6">
        {occasions.slice(2).map((item, index) => (
          <Link
            to={generateShopAllUrl(item.occasionSlug,true)}
            key={index}
            className="min-w-[280px] flex-shrink-0 group"
          >
            <div className="jewelry-card relative overflow-hidden shadow-md">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-80 h-80 object-fill transform transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute  bottom-0 w-full bg-black/50 text-white py-2 text-sm sm:text-base font-medium px-4">
                {item.name} GIFTS
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
});

export default GiftsByOccasion;
