import { useRef } from "react";
import { IoStarSharp } from "react-icons/io5";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const testimonials = [
  {
    name: "Pranika",
    title: "Fashion Designer, India",
    image: "/home/Test1.png",
    quote:
      "There are many websites which sells same things as they do but where these people have the upper hand is the quality of product and service they provide.",
  },
  {
    name: "Pranika",
    title: "Fashion Designer, India",
    image: "/home/Test2.png",
    quote:
      "There are many websites which sells same things as they do but where these people have the upper hand is the quality of product and service they provide.",
  },
  {
    name: "Pranika",
    title: "Fashion Designer, India",
    image: "/home/Test3.png",
    quote:
      "There are many websites which sells same things as they do but where these people have the upper hand is the quality of product and service they provide.",
  },
  {
    name: "Pranika",
    title: "Fashion Designer, India",
    image: "/home/Test1.png",
    quote:
      "There are many websites which sells same things as they do but where these people have the upper hand is the quality of product and service they provide.",
  },
  {
    name: "Pranika",
    title: "Fashion Designer, India",
    image: "/home/Test2.png",
    quote:
      "There are many websites which sells same things as they do but where these people have the upper hand is the quality of product and service they provide.",
  },
  {
    name: "Pranika",
    title: "Fashion Designer, India",
    image: "/home/Test3.png",
    quote:
      "There are many websites which sells same things as they do but where these people have the upper hand is the quality of product and service they provide.",
  },
];

export default function TestimonialCarousel({ reviews }) {
  const progressCircle = useRef(null);
  const progressContent = useRef(null);

  const onAutoplayTimeLeft = (s, time, progress) => {
    if (progressCircle.current && progressContent.current) {
      progressCircle.current.style.setProperty("--progress", 1 - progress);
      progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    }
  };

  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#FAF8F8] 2xl:container mx-auto py-6 sm:py-12">
      <h2 className="text-xl sm:text-3xl md:text-2xl lg:text-3xl font-normal text-black text-center mb-2 sm:mb-10 md:mb-5 lg:mb-10">
        What Our Client Says
      </h2>

      <div className="px-4 sm:px-6 lg:px-16">
        <Swiper
          spaceBetween={24}
          slidesPerView={1}
          loop={true}
          // centeredSlides={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 24,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
          }}
          modules={[Autoplay, Pagination, Navigation]}
          onAutoplayTimeLeft={onAutoplayTimeLeft}
          className="mySwiper"
        >
          {reviews.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white shadow-md rounded p-6 h-full relative mx-auto max-w-[440px]">
                <div className="flex text-[#c27b61] mb-6 sm:mb-4">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <IoStarSharp
                        key={i}
                        className={`w-5 h-5 fill-current ${
                          i < testimonial.rating ? "opacity-100" : "opacity-30"
                        }`}
                      />
                    ))}
                </div>

                <p className="text-md sm:text-lg lg:text-sm  xl:text-lg font-normal mb-3 sm:mb-4 line-clamp-2">
                  {testimonial.reviewTitle}
                </p>
                <div className="max-w-xs">
                  <p className="text-[#868686] text-xs sm:text-sm md:text-xs xl:text-sm mb-4 sm:mb-6 h-20 overflow-y-auto scrollbarWidthNone">
                    {testimonial.reviewBody}
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-14 h-14 md:w-10 md:h-10 xl:w-14 xl:h-14 rounded-full bg-gray-200 uppercase flex items-center justify-center">
                    <span className="text-lg md:text-sm xl:text-lg">
                      {testimonial.customer?.firstName?.charAt(0)}
                      {testimonial.customer?.lastName?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-normal text-md sm:text-lg md:text-sm xl:text-lg capitalize text-black">
                      {testimonial.customer?.firstName}{" "}
                      {testimonial.customer?.lastName}
                    </p>
                  </div>
                </div>

                <div className="absolute top-4 right-4">
                  <img
                    src="/home/Quote.png"
                    alt="Quote Icon"
                    loading="lazy"
                    className="size-12"
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
