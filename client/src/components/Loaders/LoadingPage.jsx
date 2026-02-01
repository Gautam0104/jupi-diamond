import React from "react";

const DiamondLoader = () => {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center p-4 marcellus z-0">
      <div className="relative w-[200px] h-[150px] md:h-[100px] mx-auto my-auto">
        <ul className="w-full h-full relative">
          <li
            className="absolute w-0 h-0 opacity-0 z-[100] border-x-[20px] border-t-[20px] border-x-transparent border-t-[#ce967e] left-0 right-0 mx-auto 
            animate-[traingle1_200ms_2.2s_ease_forwards,opacity_2s_2.4s_ease_infinite]"
          ></li>

          <li
            className="absolute w-0 h-0 opacity-0 z-[100] border-x-[20px] border-b-[20px] border-x-transparent border-b-[#ce967e] left-[59px]
            animate-[traingle2_200ms_1.8s_ease_forwards,opacity_2s_2.4s_ease_infinite]"
          ></li>

          <li
            className="absolute w-0 h-0 opacity-0 z-[100] border-x-[20px] border-b-[20px] border-x-transparent border-b-[#ce967e] right-[59px]
            animate-[traingle3_200ms_2s_ease_forwards,opacity_2s_2.4s_ease_infinite]"
          ></li>

          <li
            className="absolute w-0 h-0 opacity-0 z-[100] border-x-[20px] border-t-[20px] border-x-transparent border-t-[#ce967e] right-[59px]
            animate-[traingle4_200ms_1.6s_ease_forwards,opacity_2s_2.6s_ease_infinite]"
          ></li>

          <li
            className="absolute w-0 h-0 opacity-0 z-[100] border-x-[20px] border-t-[20px] border-x-transparent border-t-[#ce967e] left-[59px]
            animate-[traingle5_200ms_1.4s_ease_forwards,opacity_2s_2.6s_ease_infinite]"
          ></li>

          <li
            className="absolute w-0 h-0 opacity-0 z-[100] border-x-[20px] border-b-[20px] border-x-transparent border-b-[#ce967e] left-0 right-0 mx-auto
            animate-[traingle6_200ms_1.2s_ease_forwards,opacity_2s_2.6s_ease_infinite]"
          ></li>

          <li
            className="absolute w-0 h-0 opacity-0 z-[100] border-x-[20px] border-t-[20px] border-x-transparent border-t-[#ce967e] left-0 right-0 mx-auto
            animate-[traingle7_200ms_1s_ease_forwards,opacity_2s_2.8s_ease_infinite]"
          ></li>
        </ul>

        <div
          className="w-full h-[50px] absolute bottom-0 text-center text-[30px] text-[#ce967e] opacity-0
          animate-[text_500ms_2.4s_ease_forwards]"
        >
          Jupi Diamonds
        </div>
      </div>
    </div>
  );
};

export default DiamondLoader;