import React from "react";

const FeaturesSection = () => {
  return (
    <div className="w-full border-t border-blue-400 py-8 bg-white">
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
          <img
            src="/home/international-delivery.png"
            alt="Worldwide Shipping"
            className="w-10 h-10"
            loading="lazy"
          />
          <div className="text-center text-xs sm:text-md sm:text-left space-y-1">
            <h3 className="sm:text-md font-normal">Worldwide Free Shipping</h3>
            <p className="sm:text-xs text-gray-600">
              For all orders over US $500
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
          <img
            src="/home/cashback.png"
            alt="Money Back Guarantee"
            className="w-11 h-11"
            loading="lazy"
          />
          <div className="text-center text-xs sm:text-md sm:text-left space-y-1">
            <h3 className="sm:text-md font-normal">Money Back Guarantee</h3>
            <p className="sm:text-xs text-gray-600">
              Experience worry-free commitment with our 30-day return policy,
              ensuring your complete satisfaction.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
          <img
            src="/home/necklace.png"
            alt="Authentic Diamond Jewelry"
            className="w-10 h-10"
            loading="lazy"
          />
          <div className="text-center text-xs sm:text-md sm:text-left space-y-1">
            <h3 className="sm:text-md font-normal">
              Authentic Diamond Jewelry
            </h3>
            <p className="sm:text-xs text-gray-600">
              IGI/SGL Certified Diamonds And BIS Hallmark Certified Gold
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
          <img
            src="/home/exchange.png"
            alt="Lowest Price Promise"
            className="w-10 h-10"
            loading="lazy"
          />
          <div className="text-center text-xs sm:text-md sm:text-left space-y-1">
            <h3 className="sm:text-md font-normal">
              Lifetime Returns and Exchange Policy
            </h3>
            <p className="sm:text-xs text-gray-600">
              100% on Gold and 80% on Diamond current market value
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
