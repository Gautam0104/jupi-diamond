import React, { useState } from "react";
import { FaInstagram, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { RiInstagramFill, RiYoutubeFill } from "react-icons/ri";
import { MdCopyright } from "react-icons/md";
import { BiLogoFacebook } from "react-icons/bi";
import { Link } from "react-router-dom";
import { SiWhatsapp } from "react-icons/si";

const FooterDropdown = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-1 border-[#4e4d4d] px-4">
      <button
        className="w-full flex justify-between items-center py-4 text-left font-medium text-md sm:text-lg focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {title}
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`overflow-hidden  transition-all duration-200 ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="pb-4">{children}</div>
      </div>
    </div>
  );
};

const MobileFooter = () => {
  const generateShopAllUrl = (params) => {
    const baseUrl = "/shop-all";
    const queryParams = new URLSearchParams();

    // Convert all params to strings and handle arrays
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          queryParams.set(key, value.join(","));
        }
      } else if (value) {
        queryParams.set(key, value.toString());
      }
    });

    return queryParams.toString()
      ? `${baseUrl}?${queryParams.toString()}`
      : baseUrl;
  };
  return (
    <div className="block md:hidden text-black space-y-0">
      <FooterDropdown title="Support Center">
        <ul className="space-y-4  text-xs">
          <li>
            <Link to="/about-us">About Us</Link>
          </li>
          <li>
            <Link to="/blogs">Blogs</Link>
          </li>
          <li>
            <Link to="/contact-us">Contact Us</Link>
          </li>
          <li>
            <Link to="/payment-options">Payment Options</Link>
          </li>
          <li>
            <Link to="/diamonds-4cs">4C's of Diamond</Link>
          </li>
          <li>
            <Link to="/lab-grown-vs-natural-diamonds">
              Lab Grown Diamond Vs Natural Diamond
            </Link>
          </li>
          <li>
            <Link to="/rings-size-chart">Ring Size Chart</Link>
          </li>
          <li>
            <Link to="/faqs">FAQs</Link>
          </li>

          <li>
            <Link to="/lab-grown-diamond-grading-report">
              IGI Lab Grown Diamond Grading Report
            </Link>
          </li>
          <li>
            <Link to="/bracelets-size-chart">Bracelet Size Chart</Link>
          </li>
          <li>
            <Link to="/necklaces-size-chart">Necklace Size Chart</Link>
          </li>
          <li>
            <Link to="/bangles-size-chart">Bangles Size Chart</Link>
          </li>
        </ul>
      </FooterDropdown>

      <FooterDropdown title="Important Links">
        <ul className="space-y-4 text-xs">
          <li>
            <Link to="/privacy-policy">Privacy Policy</Link>
          </li>
          <li>
            <Link to="/terms-and-conditions">Terms And Conditions</Link>
          </li>
          <li>
            <Link to="/exchange-return-and-refund-policy">
              Exchange Return And Refund Policy
            </Link>
          </li>
          <li>
            <Link to="/shipping-policy">Shipping Policy</Link>
          </li>
          <li>
            <Link to="/lifetime-returns-and-exchange-policy">
              Lifetime Returns and Exchange Policy
            </Link>
          </li>
          <li>
            <Link to="/diamond-color-customization-policy">
              Diamond Color Customization Policy
            </Link>
          </li>
        </ul>
      </FooterDropdown>

      <FooterDropdown title="Shopping">
        <ul className="space-y-4 text-xs">
          <li>
            <Link to="/shop-all">Diamond Jewellery</Link>
          </li>
          <li>
            <Link to={generateShopAllUrl({ jewelryTypeSlug: "rings" })}>
              Diamond Rings
            </Link>
          </li>
          <li>
            <Link to={generateShopAllUrl({ jewelryTypeSlug: "earrings" })}>
              Diamond Earrings
            </Link>
          </li>
          <li>
            <Link to={generateShopAllUrl({ jewelryTypeSlug: "necklaces" })}>
              Diamond Necklaces
            </Link>
          </li>
          <li>
            <Link to={generateShopAllUrl({ jewelryTypeSlug: "bracelets" })}>
              Bangles And Bracelets
            </Link>
          </li>
          <li>
            <Link to={generateShopAllUrl({ productStyleSlug: "solitaire" })}>
              Solitaire
            </Link>
          </li>
          <li>
            <Link
              to={generateShopAllUrl({ jewelryTypeSlug: "mens-collection" })}
            >
              Men's Collections
            </Link>
          </li>
          <li>
            <Link to={generateShopAllUrl({ isGift: "true" })}>Gifts</Link>
          </li>
        </ul>
      </FooterDropdown>

      <FooterDropdown title="Company Information">
        <div>
          <p className="font-bold text-sm mb-4">Jupi Diamonds</p>
          <p className="font-medium mb-2 text-sm">Registered Office:</p>
          <ul
            role="list"
            className="list-disc list-outside text-xs   ml-4 sm:text-sm mb-4 "
          >
            <li>
              I-87 , SF , South City-2 , Sector-50
              <br />
              Gurugram , Haryana - 122018 India
            </li>
          </ul>
          <p className="font-medium mb-2 text-sm">Support Office:</p>
          <ul
            role="list"
            className="list-disc list-outside   ml-4 text-xs mb-4 "
          >
            <li>
              18432 7 Avenue W, Bothell WA 98012,
              <br />
              United States
            </li>
          </ul>
          <p className="font-medium mb-2 text-sm">Contact Details:</p>

          <p className="text-xs">
            <a
              href="tel:+919560658306"
              title="Call Jupi Diamonds"
              aria-label="Call Jupi Diamonds at +91 95606 58306"
            >
              (+91) 95606 58306
            </a>
          </p>
          <p className="text-xs mb-4">
            {" "}
            <a
              href="mailto:support@jupidiamonds.com"
              title="Email Jupi Diamonds Support"
              aria-label="Email Jupi Diamonds Support at support@jupidiamonds.com"
            >
              support@jupidiamonds.com
            </a>
          </p>
        </div>
      </FooterDropdown>
    </div>
  );
};

const Footer = () => {
  const generateShopAllUrl = (params) => {
    const baseUrl = "/shop-all";
    const queryParams = new URLSearchParams();

    // Convert all params to strings and handle arrays
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          queryParams.set(key, value.join(","));
        }
      } else if (value) {
        queryParams.set(key, value.toString());
      }
    });

    return queryParams.toString()
      ? `${baseUrl}?${queryParams.toString()}`
      : baseUrl;
  };
  return (
    <>
      <footer className="bg-gray-50 ">
        <div className="max-w-6xl md:max-w-5xl lg:max-w-7xl mx-auto px-6 sm:px-12  pt-10 pb-5 sm:pb-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
          <div className="hidden md:block">
            <h3 className="font-semibold text-lg mb-4">Support Center</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  className="text-gray-800 hover:text-[#C68B73] hover:underline hover:underline-offset-2"
                  to="/about-us"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-800 hover:text-[#C68B73] hover:underline hover:underline-offset-2"
                  to="/blogs"
                >
                  Blogs
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-800 hover:text-[#C68B73] hover:underline hover:underline-offset-2"
                  to="/contact-us"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-800 hover:text-[#C68B73] hover:underline hover:underline-offset-2"
                  to="/payment-options"
                >
                  Payment Options
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-800 hover:text-[#C68B73] hover:underline hover:underline-offset-2"
                  to="/diamonds-4cs"
                >
                  4C's of Diamond
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-800 hover:text-[#C68B73] hover:underline hover:underline-offset-2"
                  to="/lab-grown-vs-natural-diamonds"
                >
                  Lab Grown Diamond Vs Natural Diamond
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-800 hover:text-[#C68B73] hover:underline hover:underline-offset-2"
                  to="/rings-size-chart"
                >
                  Ring Size Chart
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-800 hover:text-[#C68B73] hover:underline hover:underline-offset-2"
                  to="/faqs"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-800 hover:text-[#C68B73] hover:underline hover:underline-offset-2"
                  to="/lab-grown-diamond-grading-report"
                >
                  IGI Lab Grown Diamond Grading Report
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-800 hover:text-[#C68B73] hover:underline hover:underline-offset-2"
                  to="/bracelets-size-chart"
                >
                  Bracelet Size Chart
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-800 hover:text-[#C68B73] hover:underline hover:underline-offset-2"
                  to="/necklaces-size-chart"
                >
                  Necklace Size Chart
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-800 hover:text-[#C68B73] hover:underline hover:underline-offset-2"
                  to="/bangles-size-chart"
                >
                  Bangles Size Chart
                </Link>
              </li>
            </ul>
          </div>
          <div className="hidden md:block">
            <h3 className="font-semibold text-lg mb-4">Important Links</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  className="text-gray-800 hover:text-[#C68B73] hover:underline hover:underline-offset-2"
                  to={`/privacy-policy`}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-800 hover:text-[#C68B73] hover:underline hover:underline-offset-2"
                  to={`/terms-and-conditions`}
                >
                  Terms And Conditions
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-800 hover:text-[#C68B73] hover:underline hover:underline-offset-2"
                  to={`/exchange-return-and-refund-policy`}
                >
                  Exchange Return And Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-800 hover:text-[#C68B73] hover:underline hover:underline-offset-2"
                  to={`/shipping-policy`}
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-800 hover:text-[#C68B73] hover:underline hover:underline-offset-2"
                  to={`/lifetime-returns-and-exchange-policy`}
                >
                  Lifetime Returns and Exchange Policy
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-800 hover:text-[#C68B73] hover:underline hover:underline-offset-2"
                  to={`/diamond-color-customization-policy`}
                >
                  Diamond Color Customization Policy
                </Link>
              </li>
            </ul>
          </div>
          <div className="hidden md:block">
            <h3 className="font-semibold text-lg mb-4">Shopping</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  className="text-gray-800 hover:text-[#C68B73] hover:underline hover:underline-offset-2"
                  to={"/shop-all"}
                >
                  Diamond Jewellery
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-800 hover:text-[#C68B73] hover:underline hover:underline-offset-2"
                  to={generateShopAllUrl({ jewelryTypeSlug: "rings" })}
                >
                  Diamond Rings
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-800 hover:text-[#C68B73] hover:underline hover:underline-offset-2"
                  to={generateShopAllUrl({ jewelryTypeSlug: "earrings" })}
                >
                  Diamond Earrings
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-800 hover:text-[#C68B73] hover:underline hover:underline-offset-2"
                  to={generateShopAllUrl({ jewelryTypeSlug: "necklaces" })}
                >
                  Diamond Necklaces
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-800 hover:text-[#C68B73] hover:underline hover:underline-offset-2"
                  to={generateShopAllUrl({
                    jewelryTypeSlug: "bracelet,bangles",
                  })}
                >
                  Bangles And Bracelets
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-800 hover:text-[#C68B73] hover:underline hover:underline-offset-2"
                  to={generateShopAllUrl({ productStyleSlug: "solitaire" })}
                >
                  Solitaire
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-800 hover:text-[#C68B73] hover:underline hover:underline-offset-2"
                  to={generateShopAllUrl({
                    jewelryTypeSlug: "mens-collection",
                  })}
                >
                  Men’s Collections
                </Link>
              </li>
              <li>
                <Link
                  className="text-gray-800 hover:text-[#C68B73] hover:underline hover:underline-offset-2"
                  to={generateShopAllUrl({ isGift: "true" })}
                >
                  Gifts
                </Link>
              </li>
            </ul>
          </div>
          <div className="hidden md:block">
            <h3 className="font-semibold text-lg mb-4">Company Information</h3>
            <p className="font-medium text-lg mb-4">Jupi Diamonds</p>
            <p className="font-medium mb-2 text-sm">Registered Office:</p>
            <ul
              role="list"
              className="list-disc list-outside   ml-4 text-sm mb-4 "
            >
              <li>
                I-87 , SF , South City-2 , Sector-50
                <br />
                Gurugram , Haryana - 122018 India
              </li>
            </ul>
            <p className="font-medium mb-2 text-sm">Support Office:</p>
            <ul
              role="list"
              className="list-disc list-outside   ml-4 text-sm mb-4 "
            >
              <li>
                18432 7 Avenue W, Bothell WA 98012,
                <br />
                United States
              </li>
            </ul>
            <p className="font-medium mb-2 text-sm">Contact Details:</p>

            <p className="text-sm">
              <a
                href="tel:+919560658306"
                title="Call Jupi Diamonds"
                aria-label="Call Jupi Diamonds at +91 9560658306"
                className="font-semibold hover:underline hover:underline-offset-2 hover:text-[#C68B73]"
              >
                (+91) 95606 58306
              </a>
            </p>
            <p className="text-sm mb-4">
              {" "}
              <a
                href="mailto:support@jupidiamonds.com"
                title="Email Jupi Diamonds Support"
                aria-label="Email Jupi Diamonds Support at support@jupidiamonds.com"
                className="font-semibold hover:underline hover:underline-offset-2 hover:text-[#C68B73]"
              >
                support@jupidiamonds.com
              </a>
            </p>
          </div>

          <MobileFooter />
        </div>
        <div className="bg-white sm:bg-[#ce967e]  py-4">
          <div className="max-w-6xl md:max-w-5xl lg:max-w-7xl px-6 sm:px-12 mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
            <h4 className="text-center text-black font-medium text-lg block sm:hidden mb-2">
              Follow Us On
            </h4>
            <div className="flex space-x-4 mb-2">
              <Link
                to="https://www.facebook.com/profile.php?id=61577839056658"
                aria-label="Visit our Facebook page"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 ease-in-out hover:-translate-y-1"
                rel="noopener noreferrer"
                target="_blank"
              >
                <BiLogoFacebook className="text-2xl" />
              </Link>

              <Link
                to="https://www.linkedin.com/in/jupidiamonds/"
                aria-label="Visit our LinkedIn page"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 ease-in-out hover:-translate-y-1"
                rel="noopener noreferrer"
                target="_blank"
              >
                <FaLinkedin className="text-lg" />
              </Link>

              <Link
                to="https://www.youtube.com/@JupiDiamonds"
                aria-label="Visit our YouTube channel"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-800 text-white hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 ease-in-out hover:-translate-y-1"
                rel="noopener noreferrer"
                target="_blank"
              >
                <RiYoutubeFill className="text-xl" />
              </Link>

              <Link
                to="https://www.instagram.com/jupi_diamond/"
                aria-label="Visit our Instagram profile"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-b from-purple-600 via-pink-600 to-yellow-500 text-white hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300 ease-in-out hover:-translate-y-1"
                rel="noopener noreferrer"
                target="_blank"
              >
                <FaInstagram className="text-xl" />
              </Link>

              <Link
                to="https://wa.me/9560658306"
                aria-label="Contact us on WhatsApp"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-700 text-white hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 ease-in-out hover:-translate-y-1"
                rel="noopener noreferrer"
                target="_blank"
              >
                <SiWhatsapp className="text-lg" />
              </Link>
            </div>
            <div className="text-xs sm:text-sm text-black sm:text-white text-center lg:text-right flex flex-col sm:flex-row items-center gap-1">
              <div className="flex flex-col sm:flex-row items-center gap-1">
                <span className="flex items-center gap-1">
                  <MdCopyright className="-mt-0.5 sm:mt-0" /> 2025, Jupi
                  Diamonds.
                </span>
                <span className="">All Rights Reserved.</span>
              </div>

              <span className="">
                Developed By{" "}
                <a
                  href="https://wirewings.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:underline-offset-2"
                >
                  Wire Wings Pvt Ltd.
                </a>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
