import React from "react";
import { Skeleton } from "../../components/ui/skeleton";
import { motion } from "framer-motion";
import Success from "../../components/common/Succes/Success";
import Failed from "../../components/common/Failed/Failed";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

const Test = () => {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center  bg-[#F8F8F8] px-4">
        <div className="max-w-2xl w-full  p-8 shadow-sm shadow-amber-700  transition-all duration-300 hover:shadow-md">
          <img
            src="/error.png"
            alt="Error Img"
            loading="lazy"
            className="w-full h-auto max-w-xs mx-auto mb-6"
          />

          <div className="flex flex-col montserrat sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-brown text-xs sm:text-xs lg:text-xs xl:text-xs cp text-white font-medium rounded-lg transition-colors duration-300 focus:outline-none hover:bg-opacity-90"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Test;
