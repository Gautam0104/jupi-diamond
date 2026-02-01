import React, { useEffect } from "react";
import SEOProvider from "../../components/common/SEOProvider/SEOProvider";

const NecklaceSizeGuide = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <SEOProvider
        title="Necklace Size Guide & Length Chart | Jupi Diamonds"
        description="Find your perfect necklace length with our comprehensive sizing guide. Includes measurement tips and style recommendations."
        keywords={[
          "necklace size chart",
          "how to measure necklace length",
          "necklace sizing guide",
          "chain length guide",
          "jewelry size chart",
        ]}
        url={window.location.href}
      />
      <div className="max-w-6xl mx-auto px-6 sm:px-4 md:px-8 lg:px-10 xl:px-6 py-6 sm:py-12 text-[#27282C] bg-white">
        <h1 className="text-center text-lg font-semibold mb-5 sm:mb-10">
          Necklace Size Guide
        </h1>

        <div className="flex flex-col sm:border-2 lg:flex-row gap-0 sm:gap-8 items-center">
          <div className="lg:w-1/2 flex justify-center p-0 sm:p-4 ">
            <img
              src="/home/Necklace-size.png"
              alt="Necklace Length Guide Visual"
              loading="lazy"
              className="max-w-full h-72 sm:h-96 rounded "
            />
          </div>

          <div className="lg:w-1/2 lg:border-l-2 pt-4 sm:p-4">
            <section className="mb-6">
              <p className="text-xs sm:text-sm">
                The right necklace lengths vary from person to person. Standard women's necklace lengths are 16 to 20 inches, but different chain lengths are appropriate for different styles and outfits.
              </p>
            </section>

            <section className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-sm sm:text-md font-medium">16"</h3>
                <p className="text-xs sm:text-sm mt-1">
                  A 16" necklace hits just above the collarbone and fits like a choker. This is the ideal length for petite frames and is one of the most common women's necklace lengths.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-sm sm:text-md font-medium">18"</h3>
                <p className="text-xs sm:text-sm mt-1">
                  An 18" necklace falls right about at the collarbone and is the most popular chain length among women.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-sm sm:text-md font-medium">20"</h3>
                <p className="text-xs sm:text-sm mt-1">
                  A 20" necklace falls a few inches below the collarbone, perfect for women who want some breathing room with their chain. This length chain works best with a higher neckline.
                </p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-sm sm:text-md font-medium">24"</h3>
                <p className="text-xs sm:text-sm mt-1">
                  A 24" chain falls below the neckline.
                </p>
              </div>

              <div className="pb-4">
                <h3 className="text-sm sm:text-md font-medium">36"</h3>
                <p className="text-xs sm:text-sm mt-1">
                  A 36" necklace hangs below the bust and is typically reserved for long, beaded necklaces such as pearl necklaces. They are often wrapped around twice to form double strand necklaces.
                </p>
              </div>
            </section>
          </div>
        </div>

        
      </div>
    </>
  );
};

export default NecklaceSizeGuide;