import { useEffect, useState } from "react";
import { X, User } from "lucide-react";
import { Link } from "react-router-dom";
import { FaRegUser } from "react-icons/fa6";
import { HiOutlineMenuAlt1, HiX } from "react-icons/hi";
import useAuth from "../../Hooks/useAuth";
import { fetchProductStylesByJewelryType } from "../../api/Public/publicApi";

const MobileDrawer = ({ navItems, megaMenuData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("RINGS");
  const [openIndex, setOpenIndex] = useState(null);
  const [showAuthDrawer, setShowAuthDrawer] = useState(false);
  const { user } = useAuth();
  const [productStyles, setProductStyles] = useState({});

  useEffect(() => {
    fetchProductStyles("rings");
  }, []);
  
  const fetchProductStyles = async (jewelryTypeSlug) => {
    if (productStyles[jewelryTypeSlug]) return; 

    try {
      const response = await fetchProductStylesByJewelryType(jewelryTypeSlug);
      setProductStyles((prev) => ({
        ...prev,
        [jewelryTypeSlug]: response.data.data,
      }));
    } catch (err) {
      console.error("Error fetching product styles:", err);
    }
  };

  const handleMobileItemClick = (itemTitle) => {
    setActiveTab(itemTitle);

    // Map the item title to the corresponding jewelry type slug
    const jewelryTypeMap = {
      RINGS: "rings",
      EARRINGS: "earrings",
      NECKLACES: "necklaces",
      BRACELETS: "bracelets",
      "MEN'S COLLECTION": "mens-collection",
      GIFTS: "gifts",
    };

    const jewelryTypeSlug = jewelryTypeMap[itemTitle];
    if (jewelryTypeSlug) {
      fetchProductStyles(jewelryTypeSlug);
    }
  };

  const generateMegaMenuDataWithStyles = () => {
    return {
      RINGS: {
        categories: [
          {
            title: "Shop By Style",
            links: (
              productStyles["rings"] || megaMenuData.RINGS.categories[0].links
            ).map((style) => ({
              name: style.name,
              path:
                megaMenuData.RINGS.categories[0].links.find(
                  (link) => link.name === style.name
                )?.path || "#",
            })),
          },
          ...megaMenuData.RINGS.categories.slice(1),
        ],
        images: megaMenuData.RINGS.images,
      },
      EARRINGS: {
        categories: [
          {
            title: "Shop By Style",
            links: (
              productStyles["earrings"] ||
              megaMenuData.EARRINGS.categories[0].links
            ).map((style) => ({
              name: style.name,
              path:
                megaMenuData.EARRINGS.categories[0].links.find(
                  (link) => link.name === style.name
                )?.path || "#",
            })),
          },
          ...megaMenuData.EARRINGS.categories.slice(1),
        ],
        images: megaMenuData.EARRINGS.images,
      },
      NECKLACES: {
        categories: [
          {
            title: "Shop By Style",
            links: (
              productStyles["necklaces"] ||
              megaMenuData.NECKLACES.categories[0].links
            ).map((style) => ({
              name: style.name,
              path:
                megaMenuData.NECKLACES.categories[0].links.find(
                  (link) => link.name === style.name
                )?.path || "#",
            })),
          },
          ...megaMenuData.NECKLACES.categories.slice(1),
        ],
        images: megaMenuData.NECKLACES.images,
      },
      BRACELETS: {
        categories: [
          {
            title: "Shop By Style",
            links: (
              productStyles["bracelets"] ||
              megaMenuData.BRACELETS.categories[0].links
            ).map((style) => ({
              name: style.name,
              path:
                megaMenuData.BRACELETS.categories[0].links.find(
                  (link) => link.name === style.name
                )?.path || "#",
            })),
          },
          ...megaMenuData.BRACELETS.categories.slice(1),
        ],
        images: megaMenuData.BRACELETS.images,
      },
      "MEN'S COLLECTION": {
        categories: [
          {
            title: "Shop By Style",
            links: (
              productStyles["mens-collection"] ||
              megaMenuData["MEN'S COLLECTION"].categories[0].links
            ).map((style) => ({
              name: style.name,
              path:
                megaMenuData["MEN'S COLLECTION"].categories[0].links.find(
                  (link) => link.name === style.name
                )?.path || "#",
            })),
          },
          ...megaMenuData["MEN'S COLLECTION"].categories.slice(1),
        ],
      },
      GIFTS: megaMenuData.GIFTS,
    };
  };

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const toggleAuthDrawer = () => {
    setShowAuthDrawer(!showAuthDrawer);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest(".drawer-container")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Filter out items that have mega menus (excluding "SHOP ALL")
  const megaMenuItems = navItems.filter(
    (item) => megaMenuData[item.title] && item.title !== "SHOP ALL"
  );

  const currentMegaMenuData = generateMegaMenuDataWithStyles();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="xl:hidden focus:outline-none"
      >
        <HiOutlineMenuAlt1 className="cursor-pointer size-5 sm:size-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"></div>
      )}
      
      <div
        className={`drawer-container fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className=" ">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-brown text-white">
            {!user ? (
              <div                className="flex items-center gap-3 px-1 py-2 "
                onClick={toggleAuthDrawer}
              >
                <div className="bg-white text-black rounded-full p-3">
                  <FaRegUser className="w-4 h-4 text-black" />
                </div>
                <div>
                  <p className="text-xs font-light">Guest User</p>
                  <div className="text-sm font-normal cursor-pointer">
                    Tap to Log In / Sign Up
                  </div>
                </div>
              </div>
            ) : (
              <a href="/user/profile">
                <div className="flex items-center gap-3 px-1 py-2">
                  <div className="bg-white text-black rounded-full p-3">
                    {user.firstName?.charAt(0)}
                    {user.lastName?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-light">My Account</p>
                    <p className="text-sm font-normal  cursor-pointer truncate">
                      Welcome {user.firstName} {user.lastName}
                    </p>
                  </div>
                </div>
              </a>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-black focus:outline-none"
            >
              <HiX className="size-4" />
            </button>
          </div>

          <Link
            to="/shop-all"
            className="block px-4 py-4 border-b-2 border-gray-300"
            onClick={() => setIsOpen(false)}
          >
            <span className="text-sm font-medium text-gray-800">SHOP ALL</span>
          </Link>

          <div className="overflow-x-auto scrollbarWidthNone px-2 py-4 border-b-2 border-gray-300 whitespace-nowrap no-scrollbar">
            <div className="flex gap-4 w-max">
              {megaMenuItems.map((item) => (
                <button
                  key={item.title}
                  onClick={() => handleMobileItemClick(item.title)}
                  className={`px-4 py-2 text-xs whitespace-nowrap  ${
                    activeTab === item.title
                      ? "bg-brown text-white"
                      : "text-gray-700 bg-gray-100"
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </div>

          {activeTab && currentMegaMenuData[activeTab] && (
            <div className="text-gray-800">
              {currentMegaMenuData[activeTab].categories.map(
                (category, idx) => (
                  <div key={idx}>
                    <div
                      className="flex items-center justify-between px-4 py-5 text-sm cursor-pointer border-b border-gray-300"
                      onClick={() => toggleAccordion(idx)}
                    >
                      <div className="flex items-center gap-5">
                        <span className="text-sm text-[#818080]">
                          {openIndex === idx ? "−" : "+"}
                        </span>
                        <span className="text-[#818080] font-light">
                          {category.title}
                        </span>
                      </div>
                    </div>

                    {openIndex === idx && category.links.length > 0 && (
                      <div className="bg-gray-100 px-6 py-4 space-y-4">
                        {category.links.map((link, i) => (
                          <Link
                            key={i}
                            to={link.path}
                            className="block text-xs text-[#818080] capitalize hover:text-brown"
                            onClick={() => setIsOpen(false)}
                          >
                            {link.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}

          {showAuthDrawer && (
            <div className="fixed inset-0 z-[110] flex items-end">
              <div className="w-full py-6 px-3 animate-slide-up bg-brown shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.3)]">
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-xl font-bold text-white">
                    Welcome to Jupi Diamonds
                  </h2>
                  <button onClick={toggleAuthDrawer}>
                    <X size={24} className="text-white" />
                  </button>
                </div>

                <p className="text-white text-sm mb-8">
                  Login or Signup to access account and manage your orders.
                </p>
                <div className="flex gap-5">
                  <button className="w-full text-xs  bg-white text-brown py-2 rounded-lg font-medium">
                    <Link to="/signup">Sign Up</Link>
                  </button>
                  <button className="w-full text-xs bg-brown border border-white text-white py-2 rounded-lg font-medium">
                    <Link to="/login">Login</Link>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileDrawer;
