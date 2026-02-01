import React, { useState } from "react";
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { IoLocationOutline } from "react-icons/io5";

const Slider = () => {
  const images = [
    {
      src: "/admin/Jewellery1.jpg",
      alt: "Elegant Solitaire Diamond Ring",
      description:
        "Timeless solitaire diamond ring featuring a flawless cut stone set in a sleek platinum band — perfect for engagements or anniversaries.",
    },
    {
      src: "/admin/Jewellery2.webp",
      alt: "Vintage-Inspired Diamond Ring",
      description:
        "A vintage-style diamond ring with intricate milgrain detailing and side stones, blending classic charm with modern brilliance.",
    },
    {
      src: "/admin/Jewellery3.jpg",
      alt: "Halo Diamond Engagement Ring",
      description:
        "Dazzling halo diamond ring with a round center stone encircled by a radiant diamond halo, set in white gold for extra sparkle.",
    },
    {
      src: "/admin/Jewellery4.jpg",
      alt: "Three-Stone Diamond Ring",
      description:
        "Symbolizing past, present, and future, this three-stone diamond ring is a meaningful and luxurious gift for special occasions.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const currentImage = images[currentIndex];
  return (
    <aside className=" hidden xl:flex flex-col xl:w-[510px] mx-auto  2xl:w-full ">
      <div className="flex relative flex-col h-[400px] xl:h-[500px] 2xl:h-[500px] overflow-hidden grow aspect-square pt-40 rounded-md  md:w-full">
        <img
          loading="lazy"
          src={currentImage.src}
          alt={currentImage.alt}
          className=" rounded-lg h-full absolute inset-0 size-full transition-opacity duration-500"
        />
        <div className="flex relative flex-col px-4 pt-64 pb-4 w-full rounded-xl max-md:pt- max-md:pr-5 max-md:max-w-full bg-gradient-to-t from-black/50 to-transparent">
          <div className="flex gap-5 justify-between  w-full max-md:max-w-full">
            <p className="mr-7 text-sm leading-6 text-white max-md:mr-2.5 max-md:max-w-full">
              {currentImage.description}
            </p>
            <div className="flex gap-3.5 my-auto">
              <button
                onClick={goToPrevious}
                aria-label="Previous image"
                className="p-2 rounded-full bg-white cp bg-opacity-20 hover:bg-opacity-30 transition-colors"
              >
                <GrFormPrevious className="text-black w-5 h-5" />
              </button>
              <button
                onClick={goToNext}
                aria-label="Next image"
                className="p-2 rounded-full bg-white cp bg-opacity-20 hover:bg-opacity-30 transition-colors"
              >
                <MdNavigateNext className="text-black w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Slider;
