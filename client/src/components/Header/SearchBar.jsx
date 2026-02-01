import { useState, useEffect, useRef } from "react";
import { MdSearch, MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  // Available search suggestions with their paths
  const availableSuggestions = [
    { title: "About Us", path: "/about-us" },
    { title: "Blogs", path: "/blogs" },
    { title: "Contact Us", path: "/contact-us" },
    { title: "Payment Options", path: "/payment-options" },
    { title: "4C's of Diamond", path: "/diamonds-4cs" },
    {
      title: "Lab Grown Diamond Vs Natural Diamond",
      path: "/lab-grown-vs-natural-diamonds",
    },
    { title: "Ring Size Chart", path: "/ring-size-chart" },
    { title: "FAQs", path: "/faqs" },
    {
      title: "IGI Lab Grown Diamond Grading Report",
      path: "/lab-grown-diamond-grading-report",
    },
    { title: "Bracelet Size Chart", path: "/bracelet-size-chart" },
    { title: "Necklace Size Chart", path: "/necklace-size-chart" },
    { title: "Bangles Size Chart", path: "/bangles-size-chart" },
    { title: "Privacy Policy", path: "/privacy-policy" },
    { title: "Terms And Conditions", path: "/terms-and-conditions" },
    {
      title: "Exchange Return And Refund Policy",
      path: "/exchange-return-and-refund",
    },
    { title: "Shipping Policy", path: "/shipping-policy" },
    {
      title: "Lifetime Returns and Exchange Policy",
      path: "/lifetime-return-and-refund",
    },
    {
      title: "Diamond Color Customization Policy",
      path: "/diamond-color-customization-policy",
    },
  ];

  const jewelryTypeMappings = {
    "earrings": "earrings",
    "rings": "rings",
    "men's collection": "mens-collection",
    "necklaces": "necklaces",
    "bracelets": "bracelets"
  };

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = availableSuggestions.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();

      const jewelryTypeSlug = jewelryTypeMappings[query];
      
      let bestMatch = availableSuggestions.find(
        (item) => item.title.toLowerCase() === query
      );

      if (!bestMatch) {
        bestMatch = availableSuggestions.find(
          (item) =>
            item.title.toLowerCase().startsWith(query) ||
            item.title.toLowerCase().includes(query)
        );
      }

      if (bestMatch && query.length >= 3) {
        navigate(bestMatch.path);
      } else if (jewelryTypeSlug) {
        navigate(
          `/shop-all?jewelryTypeSlug=${jewelryTypeSlug}&limit=12&page=1`
        );
      } else {
        navigate(
          `/shop-all?search=${encodeURIComponent(searchQuery)}&limit=12&page=1`
        );
      }

      setIsOpen(false);
      setSearchQuery("");
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (path) => {
    navigate(path);
    setIsOpen(false);
    setSearchQuery("");
    setSuggestions([]);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="focus:outline-none"
        aria-label="Open search"
      >
        <MdSearch className="cursor-pointer size-5 sm:size-5  xl:size-6 md:mt-2" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 "
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 px-6 right-0 z-50 bg-transparent  transition-all duration-300 ease-out ${
          isOpen ? "translate-y-40" : "-translate-y-full"
        }`}
      >
        <div className="max-w-xl mx-auto px-6 py-3 ">
          <form onSubmit={handleSubmit} className="relative">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products or pages..."
              className="w-full py-2 sm:py-2 px-2 text-[13px] sm:text-md  sm:px-4 pr-12 text-gray-800 border bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ce967e] focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute  right-2 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#ce967e]"
            >
              <MdSearch className="size-6" />
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-10 sm:right-16 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label="Close search"
            >
              <MdClose className="size-6" />
            </button>
          </form>

          <div className="relative">
            {suggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-none shadow-lg max-h-60 overflow-auto">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-2 sm:px-4 py-2 text-xs sm:text-sm hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSuggestionClick(suggestion.path)}
                  >
                    {suggestion.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBar;