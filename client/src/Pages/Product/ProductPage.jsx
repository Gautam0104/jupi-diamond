import React, { useCallback, useContext, useRef, useState } from "react";
import {
  FaAngleRight,
  FaFilter,
  FaHeart,
  FaRegHeart,
  FaRegImage,
} from "react-icons/fa6";
import { FiSearch, FiX } from "react-icons/fi";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { HiOutlineChevronUp } from "react-icons/hi";
import { HiOutlineChevronDown } from "react-icons/hi";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import MobileFilterDrawer from "./MobileFilterDrawer";
import { CiImageOn } from "react-icons/ci";
import {
  getPublicProductVariant,
  getSideFilterData,
} from "../../api/Public/publicApi";
import { useEffect } from "react";
import useFiltration from "../../Hooks/useFilteration";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import SEOProvider from "../../components/common/SEOProvider/SEOProvider";
import { CurrencyContext } from "../../Context/CurrencyContext";
import { useWishlist } from "../../Context/WishlistContext";
import { gsap } from "gsap";
import { useCompare } from "../../Context/CompareContext";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../components/ui/drawer";
import { Button } from "../../components/ui/button";
import { FaBalanceScale } from "react-icons/fa";
import { toast } from "sonner";
import { ScaleIcon, TrashIcon } from "lucide-react";
import { MdCompare } from "react-icons/md";
import { Slider } from "../../components/ui/slider";

const ProductPage = React.memo(() => {
  const { convertPrice, currency, getCurrencySymbol } =
    useContext(CurrencyContext);
  const { addToWishlist, removeFromWishlist, isInWishlist, wishlistItems } =
    useWishlist();

  const [sort, setSort] = useState("A-Z");
  const [isOpen, setIsOpen] = useState(true);
  const [isWeightOpen, setIsWeightOpen] = useState(true);
  const [openSections, setOpenSections] = useState({});
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { compareProducts, addToCompare, removeFromCompare } = useCompare();
  const [isCompareDrawerOpen, setIsCompareDrawerOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const {
    clearFilters,
    filters,
    handleFilterChangeHook,
    handlePaginationChange,
    handleFilterMultipleChangeHook,
    debouncedSearch,
  } = useFiltration();

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState();
  const [loading, setLoading] = useState(false);
  const [sideFilterData, setSideFilterData] = useState({});
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const wishlistRefs = useRef({});

  const handleWishlistClick = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();

    const heartIcon = wishlistRefs.current[productId];

    if (!heartIcon) return;

    const isMobile = window.innerWidth < 768;
    const scales = {
      initialBump: isMobile ? 1.1 : 1.2,
      shrink: isMobile ? 0.9 : 0.8,
      expand: isMobile ? 1.2 : 1.5,
    };

    if (isInWishlist(productId)) {
      gsap
        .timeline()
        .to(heartIcon, {
          scale: scales.initialBump,
          duration: 0.1,
          ease: "power1.out",
        })
        .to(heartIcon, {
          scale: scales.shrink,
          duration: 0.2,
          ease: "back.in",
        })
        .to(heartIcon, {
          scale: 1,
          duration: 0.1,
          ease: "power1.out",
          onComplete: () => {
            const wishlistItem = wishlistItems.find(
              (item) => item.productVariantId === productId
            );
            if (wishlistItem) {
              removeFromWishlist(wishlistItem.id);
            }
          },
        });
    } else {
      gsap
        .timeline()
        .to(heartIcon, {
          scale: scales.shrink,
          duration: 0.1,
          ease: "power1.out",
        })
        .to(heartIcon, {
          scale: scales.expand,
          duration: 0.2,
          ease: "back.out",
          onComplete: () => {
            addToWishlist(productId);
          },
        })
        .to(heartIcon, {
          scale: 1,
          duration: 0.1,
          ease: "power1.in",
        });
    }
  };

  // Handle price slider change
  const handlePriceSliderChange = (value) => {
    handleFilterChangeHook({
      target: {
        name: "minPrice",
        value: value[0],
      },
    });
    handleFilterChangeHook({
      target: {
        name: "maxPrice",
        value: value[1],
      },
    });
  };

  // Handle weight slider change
  const handleWeightSliderChange = (value) => {
    handleFilterChangeHook({
      target: {
        name: "minWeight",
        value: value[0],
      },
    });
    handleFilterChangeHook({
      target: {
        name: "maxWeight",
        value: value[1],
      },
    });
  };

  const validSortFields = {
    "A-Z": { sortBy: "productVariantTitle", sortOrder: "asc" }, // A-Z
    "Z-A": { sortBy: "productVariantTitle", sortOrder: "desc" }, // Z-A
    "Low-High": { sortBy: "finalPrice", sortOrder: "asc" }, // Price low to high
    "High-Low": { sortBy: "finalPrice", sortOrder: "desc" }, // Price high to low
    Newest: { sortBy: "createdAt", sortOrder: "desc" },
    Oldest: { sortBy: "createdAt", sortOrder: "asc" },
  };

  const handleSortChange = (value) => {
    setSort(value);
    const sortConfig = validSortFields[value];
    if (sortConfig) {
      handleFilterChangeHook({
        target: {
          name: "sortBy",
          value: sortConfig.sortBy,
        },
      });
      handleFilterChangeHook({
        target: {
          name: "sortOrder",
          value: sortConfig.sortOrder,
        },
      });
    }
  };

  // Get current slider values
  const priceSliderValues = [
    filters.minPrice || 0,
    filters.maxPrice || 1000000,
  ];
  const weightSliderValues = [filters.minWeight || 0, filters.maxWeight || 200];

  const fetchProductData = useCallback(
    async (loadMore = false) => {
      try {
        if (!loadMore) {
          setLoading(true);
          setAllProducts([]);
          setIsInitialLoad(true);
        } else {
          setIsLoadingMore(true);
        }
        const params = Object.fromEntries(searchParams.entries());
        const currentLimit = parseInt(filters.limit) || 12;
        const newLimit = loadMore ? currentLimit + 12 : currentLimit;

        const response = await getPublicProductVariant({
          ...params,
          page: 1,
          search: debouncedSearch,
          limit: newLimit,
          ...filters,
        });

        const newProducts = response.data.data.productVariant;
        const totalProducts = response.data.data.pagination.totalCount;

        setAllProducts(newProducts);
        setPagination(response.data.data.pagination);
        setHasMore(newProducts.length < totalProducts);
        setIsInitialLoad(false);
        handleFilterChangeHook({
          target: {
            name: "limit",
            value: newLimit.toString(),
          },
        });

        if (!loadMore) {
          const res = await getSideFilterData(filters.jewelryTypeSlug);
          setSideFilterData(res.data.data);
          // console.log("Side Filter Data:", res.data.data);

          const sections = {};
          Object.keys(res.data.data).forEach((key, index) => {
            sections[index] = index === 0;
            sections["diamondColor"] = false;
          });
          setOpenSections(sections);
        }
      } catch (err) {
        console.log("Error fetching products:", err);
        setHasMore(false);
        setIsInitialLoad(false);
      } finally {
        setLoading(false);
        setIsLoadingMore(false);
      }
    },
    [filters.limit, loading, searchParams]
  );

  const handleLoadMore = () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    fetchProductData(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProductData();
    }, 100);

    window.scrollTo(0, 0);
    return () => clearTimeout(timer);
  }, [
    location.search,
    debouncedSearch,
    filters.limit,
    filters.minWeight,
    filters.maxWeight,
    filters.metalVariantSlug,
    filters.gemstoneVariantSlug,
    filters.sortBy,
    filters.sortOrder,
    filters.isActive,
    filters.isGift,
    filters.isFeatured,
    filters.isNewArrival,
    filters.minPrice,
    filters.maxPrice,
    filters.occasionSlug,
    filters.productStyleSlug,
    filters.collectionSlug,
    filters.jewelryTypeSlug,
    filters.startDate,
    filters.endDate,
    filters.globalDiscountId,
    filters.globalMakingChargesId,
    filters.karigarId,
    filters.productSizeId,
    filters.makingChargeWeightRangeId,
    filters.makingChargeCategorySetId,
    filters.shape,
    filters.metal,
    filters.style,
    filters.occasion,
    filters.collection,
    filters.caratWeight,
    filters.dailyWear,
    filters.metalColorSlug,
  ]);

  useEffect(() => {
    const jewelryTypeSlug = searchParams.get("jewelryTypeSlug");
    if (jewelryTypeSlug) {
      handleFilterMultipleChangeHook({
        target: {
          name: "jewelryTypeSlug",
          value: jewelryTypeSlug.split(","),
          type: "checkbox",
          checked: true,
        },
      });
    }
  }, []);

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleDropdown = () => setIsOpen(!isOpen);
  const toggleWeightDropdown = () => setIsWeightOpen(!isWeightOpen);

  const renderProductImages = (product) => (
    <div className="relative w-full aspect-square">
      <Swiper
        loop={true}
        pagination={{
          clickable: true,
          // dynamicBullets: true, // improves pagination visibility
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true, // pauses autoplay on hover
        }}
        modules={[Pagination, Autoplay]}
        className="w-full aspect-square"
      >
        {product.productVariantImage.length === 0 ? (
          <SwiperSlide>
            <div className="flex items-center bg-gray-200 justify-center h-full w-full aspect-square">
              <span className="text-gray-400 font-semibold">No Image</span>
            </div>
          </SwiperSlide>
        ) : (
          product.productVariantImage.map((image, index) => (
            <SwiperSlide key={`${image.imageUrl}-${index}`}>
              {image.imageUrl.endsWith(".mp4") ? (
                <video
                  src={image.imageUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover aspect-square"
                  aria-label={`${product.productVariantTitle} video ${
                    index + 1
                  }`}
                />
              ) : (
                <img
                  src={image.imageUrl}
                  alt={`${product.productVariantTitle} - ${index + 1}`}
                  className="w-full h-full object-cover aspect-square"
                  loading="lazy"
                />
              )}
            </SwiperSlide>
          ))
        )}
      </Swiper>
    </div>
  );

  const renderProductComapreImages = (product) => (
    <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-16 lg:h-16 xl:w-20 xl:h-20 aspect-square">
      <Swiper
        loop={true}
        pagination={false}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        modules={[Pagination, Autoplay]}
        className="w-full aspect-square"
      >
        {product.productVariantImage.length === 0 ? (
          <SwiperSlide>
            <div className="flex items-center bg-gray-200 justify-center border-2 border-dashed border-gray-300 h-full w-full aspect-square">
              <span className="text-gray-400 font-semibold text-md sm:text-xl">
                <FaRegImage />
              </span>
            </div>
          </SwiperSlide>
        ) : (
          product.productVariantImage.map((image, index) => (
            <SwiperSlide key={`${image.imageUrl}-${index}`}>
              {image.imageUrl.endsWith(".mp4") ? (
                <video
                  src={image.imageUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover aspect-square"
                  aria-label={`${product.productVariantTitle} video ${
                    index + 1
                  }`}
                />
              ) : (
                <img
                  src={image.imageUrl}
                  alt={`${product.productVariantTitle} - ${index + 1}`}
                  className="w-full h-full object-cover aspect-square"
                  loading="lazy"
                />
              )}
            </SwiperSlide>
          ))
        )}
      </Swiper>
    </div>
  );

  // Helper function to transform filter options into display format
  const getFilterDisplayData = () => {
    return [
      {
        title: "jewelryTypeSlug",
        displayTitle: "SHOP BY JEWELLERY TYPE",
        options:
          sideFilterData.jewelleryType?.map((type) => ({
            slug: type.jewelryTypeSlug,
            label: type.name,
            count: type.products.reduce(
              (total, product) => total + (product._count?.productVariant || 0),
              0
            ),
          })) || [],
      },
      {
        title: "productStyleSlug",
        displayTitle: "SHOP BY STYLE",
        options:
          sideFilterData.style?.map((style) => ({
            slug: style.productStyleSlug,
            label: style.name,
            count:
              style.products?.reduce(
                (total, product) =>
                  total + (product._count?.productVariant || 0),
                0
              ) || 0,
            jewelryTypeSlug: style.jewelryType?.jewelryTypeSlug,
          })) || [],
      },
      {
        title: "metalColorSlug",
        displayTitle: "SHOP BY Gold Color",
        options:
          sideFilterData.color?.map((metal) => ({
            slug: metal.metalColorSlug,
            label: `${metal?.name}`,
            count: metal._count?.productVariant || 0,
          })) || [],
      },
      {
        title: "gemstoneVariantSlug",
        displayTitle: "SHOP BY Shape",
        options:
          sideFilterData.shape?.map((metal) => ({
            slug: metal.gemstoneVariantSlug,
            label: `${metal?.shape}`,
            count: metal._count?.productVariant || 0,
          })) || [],
      },
      {
        title: "caratWeight",
        displayTitle: "SHOP BY Carat Weight",
        options:
          sideFilterData.caratWeightRanges?.map((wt) => ({
            slug: wt.slug,
            label: `${wt?.name}`,
            count: wt.count || 0,
          })) || [],
      },
      // {
      //   title: "gemstoneVariantSlug",
      //   displayTitle: "SHOP BY Diamond Color",
      //   options:
      //     sideFilterData.diamondColor?.map((color) => ({
      //       slug: color.gemstoneVariantSlug,
      //       label: `${color?.color}`,
      //       count: color._count?.productVariant || 0,
      //     })) || [],
      // },
      // {
      //   title: "gemstoneVariantSlug",
      //   displayTitle: "SHOP BY GEMSTONE",
      //   options:
      //     sideFilterData.diamondGemstone?.map((gemstone) => ({
      //       slug: gemstone.gemstoneVariantSlug,
      //       label: `${gemstone.gemstoneType?.name} - ${gemstone.clarity}`,
      //       count: gemstone._count?.productVariant || 0,
      //     })) || [],
      // },
      // {
      //   title: "occasionSlug",
      //   displayTitle: "SHOP BY OCCASION",
      //   options:
      //     sideFilterData.occasion?.map((occasion) => ({
      //       slug: occasion.occasionSlug,
      //       label: occasion.name,
      //       count: occasion._count?.product || 0,
      //     })) || [],
      // },
      // {
      //   title: "collectionSlug",
      //   displayTitle: "SHOP BY COLLECTION",
      //   options:
      //     sideFilterData.collection?.map((collection) => ({
      //       slug: collection.collectionSlug,
      //       label: collection.name,
      //       count: collection._count?.products || 0,
      //     })) || [],
      // },
    ];
  };

  // const filterDisplayData = getFilterDisplayData();
  const filterDisplayData = React.useMemo(
    () => getFilterDisplayData(),
    [sideFilterData]
  );

  const ProductCardSkeleton = () => {
    return (
      <div className="bg-white overflow-hidden relative">
        <div className="absolute top-2 md:top-4 z-20 right-2 md:right-4 p-2">
          <Skeleton className="h-4 w-4 rounded-full" />
        </div>

        <div className="w-full aspect-square">
          <Skeleton className="h-full w-full" />
        </div>

        <div className="p-2 space-y-2">
          <Skeleton className="h-4 w-full hidden md:block" />
          <Skeleton className="h-4 w-full block md:hidden" />

          <div className="items-center space-x-2 hidden md:flex">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-4 w-16" />
          </div>

          <div className="items-start space-y-1 flex flex-col md:hidden">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-7 w-12" />
          </div>
        </div>
      </div>
    );
  };

  const handleCompareClick = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    const isInCompare = compareProducts.some(
      (p) => p.productVariantSlug === product.productVariantSlug
    );

    if (isInCompare) {
      removeFromCompare(product.productVariantSlug);
      toast.success("Removed from comparison", {
        position: "top-right",
        duration: 2000,
      });
    } else {
      if (compareProducts.length >= 3) {
        toast.error("You can compare up to 3 products", {
          position: "top-right",
          duration: 2000,
        });
        return;
      }
      addToCompare(product);
      toast.success("Added to comparison", {
        position: "top-right",
        duration: 2000,
      });
    }
  };

  const countActiveFilters = () => {
    let count = 0;

    // Count standard filters
    filterDisplayData.forEach((filter) => {
      if (filters[filter.title]?.length > 0) {
        count += filters[filter.title].length;
      }
    });

    // Count price range filter if not default
    if (filters.minPrice !== 0 || filters.maxPrice !== 100000) {
      count += 1;
    }

    // Count diamond color filters
    if (filters.gemstoneVariantSlug?.length > 0) {
      count += filters.gemstoneVariantSlug.length;
    }

    return count;
  };

  return (
    <>
      <SEOProvider
        title="Shop All Jewellery Collections | Jupi Diamonds"
        description="Browse our exquisite collection of jewellery including rings, necklaces, earrings and more. Find the perfect piece for any occasion."
        keywords={[
          "jewellery",
          "rings",
          "necklaces",
          "earrings",
          "gold jewellery",
          "diamond jewellery",
          "luxury jewellery",
        ]}
        image="/jupi-logo.png"
        url={window.location.href}
      />
      <div className="flex flex-col py-4 md:py-8">
        <div className="flex items-start flex-col md:flex-row justify-between gap-0 md:gap-0 mt-2">
          <div className="md:sticky  md:top-4 md:h-screen overflow-y-auto scrollbarWidthNone border-r-2 w-full xl:px-4 md:w-[30%] lg:w-[25%] xl:w-[20%]">
            <nav className="text-xs xl:text-sm text-brown mb-2 md:mb-4 flex items-start md:items-center gap-2 px-4 md:px-6">
              <a href="/" className="hover:underline">
                Home
              </a>
              <FaAngleRight />
              <span>Shop All</span>
            </nav>

            <div className="flex justify-between items-center px-4 md:px-6">
              <h1 className="text-md md:text-lg xl:text-2xl font-semibold text-black ">
                Shop All
              </h1>
              <div className="block md:hidden relative">
                {countActiveFilters() > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-gray-100 shadow text-brown rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                    {countActiveFilters()}
                  </span>
                )}
                <FaFilter
                  className="h-5 w-5 text-brown cursor-pointer hover:text-brown-dark transition-colors"
                 onClick={() => setIsDrawerOpen(!isDrawerOpen)} 
                  aria-label={`Filter products (${countActiveFilters()} active filters)`}
                />
              </div>
            </div>

            <div className="w-full p-4 space-y-4 hidden md:block ">
              {filterDisplayData.map((filter, idx) => (
                <div key={idx} className="border-b pb-4">
                  <button
                    onClick={() => toggleSection(idx)}
                    className="w-full flex items-center gap-3 md:text-sm xl:text-md font-medium uppercase mb-2 text-left cursor-pointer"
                  >
                    {openSections[idx] ? (
                      <HiOutlineChevronUp className="w-4 h-4" />
                    ) : (
                      <HiOutlineChevronDown className="w-4 h-4" />
                    )}
                    {filter.displayTitle}
                  </button>

                  {openSections[idx] && (
                    <ul className="space-y-2 pl-1">
                      {filter.options.map((option, i) => (
                        <li
                          key={i}
                          className="flex items-center space-x-2 md:text-xs xl:text-sm text-gray-700"
                        >
                          <input
                            type="checkbox"
                            className="accent-black w-4 h-4"
                            id={`${filter.title}-${option.slug}`}
                            name={filter.title}
                            value={option.slug}
                            checked={filters[filter.title]?.includes(
                              option.slug
                            )}
                            onChange={handleFilterMultipleChangeHook}
                          />
                          <label
                            htmlFor={`${filter.title}-${option.slug}`}
                            className="flex w-full cursor-pointer"
                          >
                            <span>{option.label}</span>
                            <span className="text-gray-400">
                              ({option.count})
                            </span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* Price Range Filter */}
            <div className="w-full px-4 pb-4 hidden md:block">
              <div className="border-b pb-4">
                <button
                  onClick={toggleDropdown}
                  className="w-full flex items-center gap-3 text-sm xl:text-md font-medium uppercase mb-2 text-left cursor-pointer"
                >
                  {isOpen ? (
                    <HiOutlineChevronUp className="w-4 h-4" />
                  ) : (
                    <HiOutlineChevronDown className="w-4 h-4" />
                  )}
                  SHOP BY PRICE
                </button>

                {isOpen && (
                  <div className="px-2">
                    <div className="relative">
                      <Slider
                        value={priceSliderValues}
                        onValueChange={handlePriceSliderChange}
                        min={0}
                        max={100000}
                        step={100}
                        minStepsBetweenThumbs={100}
                        className="w-full"
                      />
                      <div className="flex justify-between mt-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="md:text-xs xl:text-sm text-muted-foreground">
                              {getCurrencySymbol(currency)}
                              {convertPrice(
                                priceSliderValues[0]
                              ).toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Minimum price</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="md:text-xs xl:text-sm text-muted-foreground">
                              {getCurrencySymbol(currency)}
                              {convertPrice(
                                priceSliderValues[1]
                              ).toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Maximum price</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Diamond Color Filter */}
            <div className="w-full px-4 pb-4 hidden md:block">
              <div className="border-b pb-4">
                <button
                  onClick={() => toggleSection("diamondColor")}
                  className="w-full flex items-center gap-3 text-sm xl:text-md font-medium uppercase mb-2 text-left cursor-pointer"
                >
                  {openSections["diamondColor"] ? (
                    <HiOutlineChevronUp className="w-4 h-4" />
                  ) : (
                    <HiOutlineChevronDown className="w-4 h-4" />
                  )}
                  SHOP BY DIAMOND COLOR
                </button>

                {openSections["diamondColor"] && (
                  <ul className="space-y-2 pl-1">
                    {sideFilterData.diamondColor?.map((color, i) => (
                      <li
                        key={i}
                        className="flex items-center space-x-2 md:text-xs xl:text-sm text-gray-700"
                      >
                        <input
                          type="checkbox"
                          className="accent-black w-4 h-4"
                          id={`diamondColor-${color.gemstoneVariantSlug}`}
                          name="gemstoneVariantSlug" // Changed from diamondColorSlug to gemstoneVariantSlug
                          value={color.gemstoneVariantSlug}
                          checked={filters.gemstoneVariantSlug?.includes(
                            color.gemstoneVariantSlug
                          )}
                          onChange={handleFilterMultipleChangeHook}
                        />
                        <label
                          htmlFor={`diamondColor-${color.gemstoneVariantSlug}`}
                          className="flex w-full cursor-pointer"
                        >
                          <span>{color.color}</span>
                          <span className="text-gray-400">
                            ({color._count?.productVariant || 0})
                          </span>
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Weight Range Filter */}
            {/* <div className="w-full px-4 pb-4 hidden md:block">
              <div className="border-b pb-4">
                <button
                  onClick={toggleWeightDropdown}
                  className="w-full flex items-center gap-3 text-sm xl:text-md font-medium uppercase mb-2 text-left cursor-pointer"
                >
                  {isWeightOpen ? (
                    <HiOutlineChevronUp className="w-4 h-4" />
                  ) : (
                    <HiOutlineChevronDown className="w-4 h-4" />
                  )}
                  SHOP BY WEIGHT (g)
                </button>

                {isWeightOpen && (
                  <div className="px-2">
                    <div className="relative">
                      <Slider
                        value={weightSliderValues}
                        onValueChange={handleWeightSliderChange}
                        min={0}
                        max={100}
                        step={1}
                        minStepsBetweenThumbs={1}
                        className="w-full"
                      />
                      <div className="flex justify-between mt-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="md:text-xs xl:text-sm text-muted-foreground">
                              {weightSliderValues[0]}g
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Minimum weight</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="md:text-xs xl:text-sm text-muted-foreground">
                              {weightSliderValues[1]}g
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Maximum weight</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div> */}
          </div>
          <div className="w-full md:w-[70%] lg:w-[85%] xl:w-[80%] mt-0 md:mt-5 lg:mt-5">
            <div className="px-4 md:px-6 py-2">
              <div className="mb-6 space-y-4">
                <div className="flex items-center justify-between gap-5">
                  <div className="w-full max-w-full relative hidden md:block">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 md:text-md xl:text-xl" />
                    <input
                      type="text"
                      name="search"
                      value={filters.search}
                      onChange={handleFilterChangeHook}
                      placeholder="Search Products"
                      autoComplete="off"
                      className="w-full pl-12 pr-4 py-3 md:py-2.5 xl:py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black text-xs "
                    />
                    {filters.search && (
                      <button
                        onClick={clearFilters}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={clearFilters}
                    className="hidden md:block text-white px-6 py-3 bg-[#ce967e] cp hover:shadow-md transition duration-200 text-xs sm:text-sm md:text-xs xl:text-sm font-medium  "
                  >
                    Clear
                  </button>
                </div>

                <div className="flex flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-xs sm:text-sm md:text-xs xl:text-sm font-medium">
                    <span className="text-black font-semibold">
                      {pagination?.totalCount || products.length}
                    </span>{" "}
                    <span className="text-gray-500">Products</span>
                  </div>

                  <div className="gap-3 hidden md:flex">
                    <Select
                      value={filters.limit?.toString() || "12"}
                      onValueChange={(value) => {
                        handleFilterChangeHook({
                          target: {
                            name: "limit",
                            value: value,
                          },
                        });
                        handleFilterChangeHook({
                          target: {
                            name: "pageSize",
                            value: value,
                          },
                        });
                      }}
                    >
                      <SelectTrigger
                        className={`w-[120px] ${
                          isLoadingMore ? "bg-white" : "bg-[#f7f3f3]"
                        } text-xs sm:text-sm md:text-xs xl:text-sm font-medium text-gray-700 px-4 py-2 border border-gray-200 focus:ring-none border-none rounded-none cp focus:outline-none`}
                      >
                        <SelectValue
                          placeholder="Show 12"
                          className="text-gray-700"
                        />
                      </SelectTrigger>
                      <SelectContent className={"cp"}>
                        <SelectItem value="12">Show 12</SelectItem>
                        <SelectItem value="16">Show 16</SelectItem>
                        <SelectItem value="32">Show 32</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={sort} onValueChange={handleSortChange}>
                      <SelectTrigger className="w-auto bg-[#f7f3f3] text-xs sm:text-sm md:text-xs xl:text-sm font-medium text-gray-700 px-4 py-2 border border-gray-200 focus:ring-none border-none rounded-none cp focus:outline-none">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent className={"cp"}>
                        <SelectItem value="A-Z">Alphabetically, A-Z</SelectItem>
                        <SelectItem value="Z-A">Alphabetically, Z-A</SelectItem>
                        <SelectItem value="Low-High">
                          Price: Low to High
                        </SelectItem>
                        <SelectItem value="High-Low">
                          Price: High to Low
                        </SelectItem>
                        <SelectItem value="Newest">Newest</SelectItem>
                        <SelectItem value="Oldest">Oldest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3  xl:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 md:gap-6">
                {loading && isInitialLoad ? (
                  Array.from({ length: 8 }).map((_, index) => (
                    <ProductCardSkeleton key={`skeleton-${index}`} />
                  ))
                ) : allProducts?.length > 0 ? (
                  allProducts.map((product) => {
                    const isProductWishlisted = isInWishlist(product.id);
                    return (
                      <Link
                        to={`/shop-all/details/${product?.productVariantSlug}`}
                        key={product.id}
                        className="bg-white  hover:shadow-md group transition duration-200 overflow-hidden relative"
                      >
                        <button
                          ref={(el) => (wishlistRefs.current[product.id] = el)}
                          className="absolute top-2 md:top-4 z-20 right-2 md:right-4 p-2 bg-white/80 rounded-full cursor-pointer hover:bg-white transition-colors duration-200"
                          onClick={(e) => handleWishlistClick(e, product.id)}
                          aria-label={
                            isProductWishlisted
                              ? "Remove from wishlist"
                              : "Add to wishlist"
                          }
                        >
                          {isProductWishlisted ? (
                            <FaHeart className="text-brown fill-brown w-4 h-4 md:w-5 md:h-5" />
                          ) : (
                            <FaRegHeart className="text-gray-600 w-4 h-4 md:w-5 md:h-5 group-hover:text-[#C68B73] transition-colors duration-200" />
                          )}
                        </button>
                        <button
                          className={`absolute top-12 md:top-16 z-20 right-2 md:right-4 p-2 bg-white/80 rounded-full cursor-pointer hover:bg-white transition-colors duration-200 ${
                            compareProducts.some(
                              (p) =>
                                p.productVariantSlug ===
                                product.productVariantSlug
                            )
                              ? "text-[#674335] fill-[#674335]"
                              : "text-gray-400"
                          }`}
                          onClick={(e) => handleCompareClick(e, product)}
                          aria-label={
                            compareProducts.some(
                              (p) =>
                                p.productVariantSlug ===
                                product.productVariantSlug
                            )
                              ? "Remove from comparison"
                              : "Add to comparison"
                          }
                        >
                          <MdCompare
                            className={`w-4 h-4 md:w-5 md:h-5 ${
                              compareProducts.some(
                                (p) =>
                                  p.productVariantSlug ===
                                  product.productVariantSlug
                              )
                                ? "fill-current"
                                : ""
                            }`}
                          />
                        </button>

                        {renderProductImages(product)}

                        <div className="p-2">
                          <div>
                            <h3 className="text-sm text-black font-medium h-16 hidden md:block line-clamp-2">
                              {product.productVariantTitle}
                            </h3>
                            <h3 className="text-xs text-black font-normal h-16 block md:hidden line-clamp-2">
                              {product.productVariantTitle
                                .split(" ")
                                .slice(0, 10)
                                .join(" ")}
                            </h3>

                            <div className="items-center space-x-2 hidden md:flex">
                              <span className="text-lg font-semibold text-gray-900">
                                {getCurrencySymbol(currency)}
                                {convertPrice(
                                  product.finalPrice
                                ).toLocaleString("en-IN", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                            </div>
                            <div className="items-start space-x-2 flex flex-col md:hidden">
                              <span className="text-gray-900 font-semibold text-xs">
                                {getCurrencySymbol(currency)}
                                {convertPrice(
                                  product.finalPrice
                                ).toLocaleString("en-IN", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                ) : !isInitialLoad ? (
                  <div className="col-span-2 lg:col-span-4  flex flex-col items-center justify-center space-y-4">
                    <img
                      src="/home/no_product_available.png"
                      alt="No products"
                      className="w-auto h-80 "
                    />
                  </div>
                ) : null}

                {isLoadingMore &&
                  Array.from({ length: 4 }).map((_, index) => (
                    <ProductCardSkeleton key={`load-more-skeleton-${index}`} />
                  ))}
              </div>

              {hasMore && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleLoadMore}
                    disabled={!hasMore || isLoadingMore}
                    className={`bg-[#C68B73] py-2 px-6 hover:bg-[#C68B73]/90 text-white flex items-center justify-center min-w-[120px] ${
                      isLoadingMore ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                  >
                    {isLoadingMore ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Loading...
                      </span>
                    ) : (
                      "Load More"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
          <MobileFilterDrawer
            filters={filterDisplayData}
            handleFilterChangeHook={handleFilterChangeHook}
            handleFilterMultipleChangeHook={handleFilterMultipleChangeHook}
            sort={sort}
            handleSortChange={handleSortChange}
            filterValues={filters}
            clearFilters={clearFilters}
            sideFilterData={sideFilterData}
            handlePriceSliderChange={handlePriceSliderChange}
            priceSliderValues={priceSliderValues}
            getCurrencySymbol={getCurrencySymbol}
            convertPrice={convertPrice}
            currency={currency}
            activeFilterCount={countActiveFilters()}
            isDrawerOpen={isDrawerOpen}
            setIsDrawerOpen={setIsDrawerOpen}
          />
        </div>
      </div>

      <Drawer open={isCompareDrawerOpen} onOpenChange={setIsCompareDrawerOpen}>
        <DrawerTrigger asChild>
          {compareProducts.length > 0 && (
            <Button
              variant="edit"
              className="fixed bottom-20 text-xs sm:text-sm bg-brown text-white sm:bottom-4 right-4 z-40 flex items-center gap-2"
              onClick={() => {
                setIsCompareDrawerOpen(true);
                toast.info(`Comparing ${compareProducts.length} products`, {
                  position: "top-right",
                  duration: 2000,
                });
              }}
            >
              <MdCompare />
              Compare ({compareProducts.length})
            </Button>
          )}
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-2xl lg:max-w-2xl xl:max-w-4xl overflow-visible">
            <DrawerHeader className="border-b">
              <DrawerTitle className="text-md sm:text-lg lg:text-md xl:text-lg font-semibold">
                Compare Products
              </DrawerTitle>
              <DrawerDescription className="text-xs sm:text-sm lg:text-xs xl:text-sm text-muted-foreground">
                Select up to 3 products to compare
              </DrawerDescription>
            </DrawerHeader>

            <div className="p-2 sm:p-4">
              {compareProducts.length > 0 ? (
                <div className="space-y-2">
                  {compareProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-0 border rounded-none hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 truncate">
                        {renderProductComapreImages(product)}
                        <div className="flex flex-col gap-2">
                          <span className="text-xs sm:text-sm lg:text-xs xl:text-sm font-medium  text-balance">
                            {product.productVariantTitle}
                          </span>
                          <span className="text-xs  font-medium text-gray-500 text-balance">
                            {getCurrencySymbol(currency)}
                            {convertPrice(product.finalPrice).toLocaleString(
                              "en-IN",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive text-xs sm:text-sm lg:text-xs xl:text-sm font-normal hover:font-medium cp hover:text-destructive"
                        onClick={() =>
                          removeFromCompare(product.productVariantSlug)
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 space-y-2">
                  <ScaleIcon className="h-8 w-8 text-muted-foreground" />
                  <p className="text-muted-foreground text-center">
                    No products selected for comparison
                  </p>
                </div>
              )}
            </div>

            <DrawerFooter className="border-t px-6">
              <div className="flex flex-row items-center justify-between w-full gap-3">
                <DrawerClose asChild>
                  <Button
                    variant="outline"
                    className="flex-1 text-xs sm:text-sm lg:text-xs xl:text-sm rounded-sm"
                  >
                    Cancel
                  </Button>
                </DrawerClose>
                {compareProducts.length > 1 && (
                  <Button asChild className="flex-1 bg-brown">
                    <Link
                      to={`/compare?compare=${compareProducts
                        .map((p) => p.productVariantSlug)
                        .join(",")}`}
                      className=" text-xs sm:text-sm lg:text-xs xl:text-sm rounded-sm"
                    >
                      Compare Now
                    </Link>
                  </Button>
                )}
              </div>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
});

export default ProductPage;
