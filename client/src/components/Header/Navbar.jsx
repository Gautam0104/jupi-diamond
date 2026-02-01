import React, { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa6";
import TopBar from "./TopBar";
import { MdOutlineCurrencyRupee, MdSearch } from "react-icons/md";
import { BsPerson } from "react-icons/bs";
import { Link } from "react-router-dom";
import Cart from "../Cart/Cart";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import CurrencyToggle from "../CurrencyToggle/CurrencyToggle";
import MobileDrawer from "./MobileDrawer";
import SearchBar from "./SearchBar";
import Wishlist from "../../Pages/Wishlist/Wishlist";
import useAuth from "../../Hooks/useAuth";
import { useCart } from "../../Context/CartContext";
import {
  fetchProductStylesByJewelryType,
  getAllPublicCurrencies,
  getSideFilterData,
} from "../../api/Public/publicApi";
import { useWishlist } from "../../Context/WishlistContext";
import userLogout from "../../Hooks/userLogout";
import { CurrencyContext } from "../../Context/CurrencyContext";
import { useContext } from "react";

const Navbar = () => {
  const { wishlistCount } = useWishlist();
  const { cartCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const { user, setUser } = useAuth();
  const [currencyList, setCurrencyList] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [productStyles, setProductStyles] = useState({});
  const { convertPrice, currency, getCurrencySymbol } =
    useContext(CurrencyContext);

  const displayPrice = (price) => {
    return `${getCurrencySymbol(currency)}${convertPrice(price).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  useEffect(() => {
    if (isCartOpen || isWishlistOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isCartOpen, isWishlistOpen]);

  const fetchProductStyles = async (jewelryTypeSlug) => {
    if (productStyles[jewelryTypeSlug]) return; // Already fetched

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

  const handleItemHover = (item) => {
    if (item.title === "RINGS") {
      setHoveredItem("RINGS");
      fetchProductStyles("rings");
    } else if (item.title === "EARRINGS") {
      setHoveredItem("EARRINGS");
      fetchProductStyles("earrings");
    } else if (item.title === "NECKLACES") {
      setHoveredItem("NECKLACES");
      fetchProductStyles("necklaces");
    } else if (item.title === "BRACELETS") {
      setHoveredItem("BRACELETS");
      fetchProductStyles("bracelets");
    } else if (item.title === "MEN'S COLLECTION") {
      setHoveredItem("MEN'S COLLECTION");
      fetchProductStyles("mens-collection");
    }
  };
  const logout = userLogout();

  const handleLogout = async () => {
    await logout();
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };
  const toggleWishlist = () => {
    setIsWishlistOpen(!isWishlistOpen);
  };

  const toggleLoginDropdown = () => {
    setIsLoginDropdownOpen(!isLoginDropdownOpen);
  };

  const handleClickOutside = (e) => {
    if (
      !e.target.closest(".login-dropdown-trigger") &&
      !e.target.closest(".login-dropdown-content")
    ) {
      setIsLoginDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [navbarData, setNavbarData] = useState({
    jewelleryType: [],
    style: [],
    shape: [],
    metalVariant: [],
    diamondColor: [],
    diamondGemstone: [],
    collection: [],
    occasion: [],
    color: [],
  });

  const fetchData = async () => {
    try {
      const response = await getSideFilterData();
      setNavbarData(response.data.data);

      const res = await getAllPublicCurrencies();
      setCurrencyList(res.data.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const generateMegaMenuData = () => {
    return {
      RINGS: {
        categories: [
          {
            title: "Shop By Style",
            links: (productStyles["rings"] || [])?.map((style) => ({
              name: style.name,
              path: generateShopAllUrl({
                productStyleSlug: style.productStyleSlug,
                jewelryTypeSlug: "rings",
              }),
            })),
          },
          {
            title: "Shop By Shape",
            links: navbarData?.shape.map((item) => ({
              name: item.shape,
              path: generateShopAllUrl({
                gemstoneVariantSlug: item.gemstoneVariantSlug,
                jewelryTypeSlug: "rings",
              }),
            })),
          },
          {
            title: "Shop By Gold Color",
            links: navbarData?.color.map((metal) => ({
              name: `${metal.name} Gold `,
              path: generateShopAllUrl({
                metalColorSlug: metal.metalColorSlug,
                jewelryTypeSlug: "rings",
              }),
            })),
          },
        ],
        images: [
          { src: "/home/Rings1.png", alt: "Rings", path: "/rings" },
          {
            src: "/home/Rings2.png",
            alt: "Ring Collection",
            path: "/rings/collection",
          },
        ],
      },
      EARRINGS: {
        categories: [
          {
            title: "Shop By Style",

            links: (productStyles["earrings"] || [])?.map((style) => ({
              name: style.name,
              path: generateShopAllUrl({
                productStyleSlug: style.productStyleSlug,
                jewelryTypeSlug: "earrings",
              }),
            })),
          },
          {
            title: "Shop By Shape",
            links: navbarData?.shape.map((item) => ({
              name: item.shape,
              path: generateShopAllUrl({
                gemstoneVariantSlug: item.gemstoneVariantSlug,
                jewelryTypeSlug: "earrings",
              }),
            })),
          },
          {
            title: "Shop By Gold Color",
            links: navbarData?.color.map((metal) => ({
              name: `${metal.name} Gold`,
              path: generateShopAllUrl({
                metalColorSlug: metal.metalColorSlug,
                jewelryTypeSlug: "earrings",
              }),
            })),
          },
        ],
        images: [
          { src: "/home/earrings1.png", alt: "Earrings", path: "/earrings" },
          {
            src: "/home/earrings2.png",
            alt: "Earrings Collection",
            path: "/earrings/collection",
          },
        ],
      },
      NECKLACES: {
        categories: [
          {
            title: "Shop By Style",
            links: (productStyles["necklaces"] || [])?.map((style) => ({
              name: style.name,
              path: generateShopAllUrl({
                productStyleSlug: style.productStyleSlug,
                jewelryTypeSlug: "necklaces",
              }),
            })),
          },
          {
            title: "Shop By Gold Color",
            links: navbarData?.color.map((metal) => ({
              name: `${metal.name} Gold`,
              path: generateShopAllUrl({
                metalColorSlug: metal.metalColorSlug,
                jewelryTypeSlug: "necklaces",
              }),
            })),
          },
        ],
        images: [
          { src: "/home/necklaces1.png", alt: "Necklaces", path: "/necklaces" },
          {
            src: "/home/necklaces2.png",
            alt: "Necklaces Collection",
            path: "/necklaces/collection",
          },
        ],
      },
      BRACELETS: {
        categories: [
          {
            title: "Shop By Style",

            links: (productStyles["bracelets"] || [])?.map((style) => ({
              name: style.name,
              path: generateShopAllUrl({
                productStyleSlug: style.productStyleSlug,
                jewelryTypeSlug: "bracelets",
              }),
            })),
          },
          {
            title: "Shop By Shape",
            links: navbarData?.shape.map((shape) => ({
              name: shape.shape,
              path: generateShopAllUrl({
                gemstoneVariantSlug: shape.gemstoneVariantSlug,
                jewelryTypeSlug: "bracelets",
              }),
            })),
          },
          {
            title: "Shop By Gold Color",
            links: navbarData?.color.map((metal) => ({
              name: `${metal.name} Gold`,
              path: generateShopAllUrl({
                metalColorSlug: metal.metalColorSlug,
                jewelryTypeSlug: "bracelets",
              }),
            })),
          },
        ],
        images: [
          { src: "/home/Bracelets1.png", alt: "Bracelets", path: "/bracelets" },
          {
            src: "/home/Bracelets2.png",
            alt: "Bracelets Collection",
            path: "/bracelets/collection",
          },
        ],
      },
      "MEN'S COLLECTION": {
        categories: [
          {
            title: "Shop By Style",

            links: (productStyles["mens-collection"] || [])?.map((style) => ({
              name: style.name,
              path: generateShopAllUrl({
                productStyleSlug: style.productStyleSlug,
                jewelryTypeSlug: "mens-collection",
              }),
            })),
          },

          {
            title: "Shop By Gold Color",
            links: navbarData?.color.map((metal) => ({
              name: `${metal.name} Gold `,
              path: generateShopAllUrl({
                metalColorSlug: metal.metalColorSlug,
                collectionSlug: "mens-collection",
              }),
            })),
          },
        ],
        images: [
          {
            src: "/home/Mens1.png",
            alt: "Men's Collection",
            path: "/mens-collection",
          },
          {
            src: "/home/Mens2.png",
            alt: "Men's Jewelry",
            path: "/mens-collection",
          },
        ],
      },
      GIFTS: {
        categories: [
          {
            title: "Top Gifts",
            links: [
              {
                name: `Gifts under ${displayPrice(41666.67)}`,
                path: generateShopAllUrl({
                  maxPrice: 41666.67,
                  isGift: "true",
                }),
              },
              {
                name: `Gifts under ${displayPrice(83333.33)}`,
                path: generateShopAllUrl({
                  maxPrice: 83333.33,
                  isGift: "true",
                }),
              },
              {
                name: "Best Selling Gifts",
                path: generateShopAllUrl({
                  isBestSelling: "true",
                  isGift: "true",
                }),
              },
            ],
          },
          {
            title: "Gift By Occasion",
            links: navbarData?.occasion.map((occasion) => ({
              name: occasion.name.toLowerCase() + " Gifts",
              path: generateShopAllUrl({
                occasionSlug: occasion.occasionSlug,
                isGift: "true",
              }),
            })),
          },
        ],
        images: [
          { src: "/home/Gift1.png", alt: "Gifts", path: "/gifts" },
          { src: "/home/Gift2.png", alt: "Gifts", path: "/gifts" },
        ],
      },
    };
  };

  const megaMenuData = generateMegaMenuData();

  const navItems = [
    { title: "SHOP ALL", path: "/shop-all" },
    { title: "RINGS" },
    { title: "EARRINGS" },
    { title: "NECKLACES" },
    { title: "BRACELETS" },
    { title: "MEN'S COLLECTION" },
    { title: "GIFTS" },
  ];

  return (
    <>
      <header>
        <TopBar />
        <nav className="bg-white px-0 md:px-8 lg:px-4 py-4 flex items-center justify-between gap-5 border-b relative ">
          <Link to="/" className=" items-center hidden sm:flex ">
            <img
              src="/jupi_logos.png"
              alt="Jupi Logo"
              loading="lazy"
              className="w-full h-12 xl:h-14 "
            />
          </Link>

          <ul className="hidden lg:flex items-center space-x-4 xl:space-x-8 text-xs xl:text-sm font-normal text-black">
            {navItems.map((item, index) => {
              const megaMenu = megaMenuData[item.title];

              if (!megaMenu) {
                return (
                  <li key={index} className="hover:text-[#ce967e] transition">
                    <Link
                      to={
                        item.path ||
                        `/${item.title.toLowerCase().replace(/\s+/g, "-")}`
                      }
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              }

              return (
                <li
                  key={index}
                  className="group"
                  onMouseEnter={() => handleItemHover(item)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="flex items-center gap-1 hover:text-[#ce967e] transition cursor-pointer py-2">
                    <span>{item.title}</span>
                    <IoIosArrowDown
                      size={14}
                      className="group-hover:rotate-180 transition-transform duration-300 ease-in-out"
                    />
                  </div>

                  <div className="absolute left-0 top-full w-full bg-white shadow-xl border-t z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out">
                    <div className="max-w-screen-lg xl:max-w-screen-xl mx-auto px-8 py-8 grid grid-cols-[3fr_2fr] gap-10">
                      <div className="grid grid-cols-3 gap-8">
                        {megaMenu.categories.map((category, catIndex) => (
                          <div key={catIndex}>
                            <h3 className="font-medium text-sm xl:text-base mb-2 xl:mb-4 text-black">
                              <Link
                                to={
                                  category?.links[0]?.path?.replace(
                                    /\/[^/]+$/,
                                    ""
                                  ) || "#"
                                }
                              >
                                {category?.title}
                              </Link>
                            </h3>
                            <ul className="space-y-2">
                              {category?.links.map((link, linkIndex) => (
                                <li key={linkIndex}>
                                  <Link
                                    to={link?.path}
                                    className="text-gray-600 capitalize hover:text-black hover:font-medium transition font-normal text-xs xl:text-sm"
                                  >
                                    {link?.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      <div className="pl-0 border-l">
                        <div className="grid grid-cols-2 gap-4 aspect-auto">
                          {megaMenu.images.map((image, imgIndex) => (
                            <Link to={image.path} key={imgIndex}>
                              <img
                                src={image.src}
                                alt={image.alt}
                                loading="lazy"
                                className="w-auto h-[200px] xl:h-[240px] object-cover "
                              />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="flex justify-center items-center gap-5 md:ml-20  text-xl text-black w-full sm:w-0 relative">
            <div className="flex items-center sm:hidden absolute left-4 gap-5">
              <MobileDrawer navItems={navItems} megaMenuData={megaMenuData} />
              <SearchBar />
              <CurrencyToggle
                currencyList={currencyList}
                className="cursor-pointer w-5 h-5 sm:w-6 sm:h-6"
              />
            </div>

            <div className="items-center justify-center flex sm:hidden">
              <Link to="/" className="flex items-center mr-4 ">
                <img
                  src="/jupi_logos.png"
                  alt="Jupi Logo"
                  loading="lazy"
                  className="h-8 sm:h-14 w-auto max-w-[100%] "
                />
              </Link>
            </div>

            <div className="flex items-center gap-5 absolute right-4">
              <div className="hidden sm:block">
                <SearchBar />
              </div>
              <div className="hidden lg:block">
                <Link to="/wishlist" className="relative">
                  <FaRegHeart className="cursor-pointer w-4 h-4 xl:w-5 xl:h-5 " />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-brown text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              </div>
              <div className="block lg:hidden">
                <Link onClick={toggleWishlist} className="relative">
                  <FaRegHeart className="cursor-pointer w-4 h-4 xl:w-5 xl:h-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-brown text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              </div>
              <div
                className={`fixed top-0 right-0 h-full w-full md:w-xl bg-white shadow-xl transform ${
                  isWishlistOpen ? "translate-x-0" : "translate-x-full"
                } transition-transform duration-300 ease-in-out z-50 `}
              >
                <Wishlist onClose={() => setIsWishlistOpen(false)} />
              </div>
              {isWishlistOpen && (
                <div
                  className="fixed inset-0 bg-black/50 bg-opacity-50 z-40"
                  onClick={() => setIsWishlistOpen(false)}
                />
              )}
              <button onClick={toggleCart} className="cursor-pointer relative">
                <svg
                  fill="none"
                  viewBox="0 0 28 28"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5  xl:w-6 xl:h-6"
                >
                  <path
                    d="M9.647 9.412V8.265a4.588 4.588 0 019.177 0v1.147m-1.148 6.882V14m-6.882 2.294V14"
                    stroke="#000"
                    strokeLinecap="round"
                    strokeWidth="2.294"
                  />
                  <path
                    d="M5.059 14c0-2.163 0-3.244.672-3.916.672-.672 1.753-.672 3.916-.672h9.176c2.164 0 3.244 0 3.917.672.672.672.672 1.753.672 3.916v1.147c0 4.326 0 6.489-1.345 7.832-1.344 1.343-3.506 1.345-7.832 1.345-4.325 0-6.489 0-7.832-1.345-1.343-1.344-1.344-3.506-1.344-7.832V14z"
                    stroke="#000"
                    strokeWidth="2.294"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 sm:-top-2 -right-2 bg-brown text-white text-[10px] sm:text-xs rounded-full w-4 sm:w-5 h-4 sm:h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              <div className="relative ">
                <button
                  onClick={toggleLoginDropdown}
                  className="login-dropdown-trigger flex items-center gap-1 hover:text-[#ce967e] transition"
                >
                  <BsPerson className="cursor-pointer w-5 h-5 xl:w-6 xl:h-6" />
                </button>

                {isLoginDropdownOpen && (
                  <div className="login-dropdown-content  absolute right-0 mt-2 w-32 md:w-28 xl:w-36  bg-white rounded-sm shadow-lg py-0 z-50 ">
                    {user ? (
                      <>
                        <Link
                          to="/user/profile"
                          className="block  px-4 py-2 text-xs xl:text-sm text-gray-700 hover:bg-gray-100 rounded-sm"
                          onClick={() => setIsLoginDropdownOpen(false)}
                        >
                          My Profile
                        </Link>
                        <Link
                          to="/user/address-book"
                          className="block md:hidden px-4 py-2 text-xs xl:text-sm text-gray-700 hover:bg-gray-100 rounded-sm"
                          onClick={() => setIsLoginDropdownOpen(false)}
                        >
                          Address Book
                        </Link>
                        <Link
                          to="/user/order-history"
                          className="block md:hidden px-4 py-2 text-xs xl:text-sm text-gray-700 hover:bg-gray-100 rounded-sm"
                          onClick={() => setIsLoginDropdownOpen(false)}
                        >
                          My Orders
                        </Link>
                        <Link
                          to="/user/my-gifts"
                          className="block md:hidden px-4 py-2 text-xs xl:text-sm text-gray-700 hover:bg-gray-100 rounded-sm"
                          onClick={() => setIsLoginDropdownOpen(false)}
                        >
                          My Gifts
                        </Link>
                        <div className="border-t border-gray-200"></div>
                        <button
                          className="w-full text-left px-4 py-2 text-xs xl:text-sm cp text-gray-700 hover:bg-red-100 rounded-sm"
                          onClick={handleLogout}
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="block px-4 py-2 text-xs xl:text-sm text-gray-700 hover:bg-gray-100 rounded-sm"
                          onClick={() => setIsLoginDropdownOpen(false)}
                        >
                          Login
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="hidden sm:block lg:hidden  mt-2">
                <MobileDrawer navItems={navItems} megaMenuData={megaMenuData} />
              </div>
            </div>
          </div>

          <div
            className={`fixed top-0 right-0 h-full w-full md:w-md xl:w-xl bg-white shadow-xl transform ${
              isCartOpen ? "translate-x-0 " : "translate-x-full "
            } transition-transform duration-300 ease-in-out z-50`}
          >
            <Cart onClose={() => setIsCartOpen(false)} />
          </div>

          {isCartOpen && (
            <div
              className="fixed inset-0 bg-black/50 bg-opacity-50 z-40 "
              onClick={() => setIsCartOpen(false)}
            />
          )}
        </nav>
      </header>
    </>
  );
};

export default Navbar;
