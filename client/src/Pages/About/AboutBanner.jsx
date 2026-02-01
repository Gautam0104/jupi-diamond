import React from "react";

const AboutBanner = () => {
  return (
    <div>
      <section className="text-center py-6 md:py-10">
        <h2 className="text-2xl md:text-3xl font-medium mb-2 md:mb-3">About Us</h2>
        <p className="text-sm md:text-base font-medium text-black mb-4 px-4 md:px-0 md:mb-2 leading-snug">
          Unveiling Love's Brilliance: Elevating Unforgettable Moments With Our
          Finest Diamonds
        </p>
        <div className="py-4 md:py-6">
          <img
            src="/home/AbBanner.jpg"
            alt="Diamonds"
            loading="lazy"
            className="mx-auto h-[200px] sm:h-[350px] md:h-[500px] object-cover w-full max-w-full shadow-md"
          />
        </div>
        <p className="text-sm md:text-lg font-medium text-black px-4 md:px-6 leading-relaxed  max-w-5xl mx-auto">
          Welcome To Jupi Diamonds Jewelry, Where Timeless Sophistication
          Intertwines With Exceptional Craftsmanship. We Transcend The Role Of A
          Mere Jewelry Company; We Are Artisans Of Memories, Crafting Pieces
          That Honor Life's Most Cherished Moments.
        </p>
      </section>
    </div>
  );
};

export default AboutBanner;