import React, { useEffect } from "react";
import AboutBanner from "./AboutBanner";
import SEOProvider from "../../components/common/SEOProvider/SEOProvider";

const About = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
    <SEOProvider
        title="About Jupi Diamonds Jewelry | Crafting Timeless Elegance"
        description="Discover the story behind Jupi Diamonds Jewelry - our commitment to exquisite craftsmanship, sustainable practices, and creating personalized fine jewelry that tells your unique story."
        keywords={[
          "about Jupi Diamonds",
          "jewelry craftsmanship",
          "custom jewelry design",
          "sustainable jewelry",
          "fine jewelry makers",
          "jewelry brand story",
          "handcrafted jewelry"
        ]}
        url={window.location.href}
      />
      <AboutBanner />

      <section className="w-full bg-white py-6 md:py-12 px-4 md:px-16">
        <div className=" mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-8 mb-16">
          <div className="md:w-1/2 text-center md:text-left">
            <p className="text-gray-800 text-sm sm:text-base text-balance sm:text-pretty md:text-lg leading-relaxed">
              At Jupi Diamonds Jewelry, we embrace the essence of beauty and the
              enchantment of personalization. Our collection showcases a
              stunning array of fine jewelry, including radiant engagement
              rings, classic necklaces, modern designs, and custom creations.
              Each item is meticulously designed to embody uniqueness, elegance,
              and refinement. Committed to excellence, sustainability, and
              customer satisfaction, we procure the highest quality materials
              and partner with talented artisans to realize your visions.
            </p>
          </div>

          <div className="md:w-1/2 flex justify-center">
            <div className=" relative">
              <img
                src="/home/Rectangle.png"
                alt="Diamond Ring"
                loading="lazy"
                className="w-full h-full object-cover "
              />
            </div>
          </div>
        </div>

        <div className=" mx-auto flex flex-col-reverse md:flex-row-reverse items-center justify-between gap-4 sm:gap-8">
          <div className="md:w-1/2 text-center md:text-left">
            <p className="text-gray-800 text-sm sm:text-base md:text-lg text-balance sm:text-pretty leading-relaxed">
              Whether you seek a gift, a token of affection, or a personal
              keepsake, we are dedicated to helping you create unforgettable
              experiences. Explore the limitless beauty with Jupi Diamonds
              Jewelry.
            </p>
          </div>

          <div className="md:w-1/2 flex justify-center">
            <div className=" relative">
              <img
                src="/home/Subtract.png"
                alt="Diamond Ring"
                loading="lazy"
                className="w-full h-full object-cover "
              />
            </div>
          </div>
        </div>

        <p className="text-sm text-center mt-8 sm:mt-16 md:text-lg font-medium text-gray-800  leading-relaxed max-w-5xl mx-auto px-4">
          Allow us to accompany you on your journey, crafting timeless pieces
          that endure for generations. Your narrative deserves to shine.
        </p>
      </section>
    </>
  );
};

export default About;
