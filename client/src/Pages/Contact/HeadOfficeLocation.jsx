import React from "react";
import { MapPin, Phone, Globe, Mail } from "lucide-react";

export default function HeadOfficeLocation() {
  return (
    <div className="p-4 sm:p-10 bg-white">
      <h2 className="text-lg sm:text-3xl lg:text-2xl xl:text-3xl text-start font-normal mb-4 sm:mb-4 xl:mb-8">
        Head Office Location
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10 text-center">
        <div className="flex flex-row items-center gap-4">
          <div className="bg-[#b67954] text-white p-3 sm:p-4 rounded-full mb-2">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="flex flex-col items-start gap-1 w-full">
            <h3 className="text-sm sm:text-lg font-medium">Our Location</h3>
            <p className="text-xs sm:text-sm ">
              I-87 , SF , South City-2 , Sector-50
              <br />
              Gurugram , Haryana India - 122018
            </p>
          </div>
        </div>

        <div className="flex flex-row  gap-4 items-center">
          <div className="bg-[#b67954] text-white p-3 sm:p-4 rounded-full mb-2">
            <Phone className="w-6 h-6" />
          </div>
          <div className="flex flex-col items-start -mt-2">
            <h3 className="text-sm sm:text-lg font-medium">Mobile Number</h3>
            <a
              href="tel:+919560658306"
              className="text-xs sm:text-sm mt-1 hover:underline"
              aria-label="Call JupDiamonds Support"
              title="Call JupDiamonds Support at +91 95606 58306"
            >
              (+91) - 95606 58306
            </a>
          </div>
        </div>

        <div className="flex flex-row  gap-4 items-center">
          <div className="bg-[#b67954] text-white p-3 sm:p-4 rounded-full mb-2">
            <Globe className="w-6 h-6" />
          </div>
          <div className="flex flex-col items-start -mt-2">
            <h3 className="text-sm sm:text-lg font-medium">Have Queries ?</h3>
            <p className="text-xs sm:text-sm mt-1 lowercase">
              www.Jupdiamonds.Com
            </p>
          </div>
        </div>

        <div className="flex flex-row  gap-4 items-center">
          <div className="bg-[#b67954] text-white p-3 sm:p-4 rounded-full mb-2">
            <Mail className="w-6 h-6" />
          </div>
          <div className="flex flex-col items-start -mt-1">
            <h3 className="text-sm sm:text-lg font-medium">Contact Support</h3>

            <a
              href="mailto:support@jupidiamonds.com"
              className="text-xs sm:text-sm mt-1 lowercase hover:underline"
              aria-label="Email Jupi Diamonds Support"
              title="Contact Jupi Diamonds Support via Email"
            >
              support@jupidiamonds.com
            </a>
          </div>
        </div>
      </div>

      <div className="w-full h-[400px]">
        <iframe
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3509.055849104497!2d77.04797748091275!3d28.417571613340428!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d2395137410c3%3A0x459c149e03d3c3dc!2sSouth%20City-II%2C%20Sector%2050%2C%20Gurugram!5e0!3m2!1sen!2sin!4v1748077337244!5m2!1sen!2sin"
          className="w-full h-full border-none rounded-md"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}
