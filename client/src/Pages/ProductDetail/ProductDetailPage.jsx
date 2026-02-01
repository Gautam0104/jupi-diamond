import { useContext, useEffect, useState } from "react";
import { FaAngleDown, FaAngleUp, FaHeart, FaRegHeart } from "react-icons/fa6";
import { MdKeyboardArrowRight, MdOutlineDownloading } from "react-icons/md";
import RelatedSuggestions from "./RelatedSuggestion";
import { fetchProductBySlug } from "../../api/Public/publicApi";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Skeleton } from "../../components/ui/skeleton";
import SEOProvider from "../../components/common/SEOProvider/SEOProvider";
import { useCart } from "../../Context/CartContext";
import { toast } from "sonner";
import { CurrencyContext } from "../../Context/CurrencyContext";
import Cart from "../../components/Cart/Cart";
import ReviewCard from "./ReviewCard";
import { useWishlist } from "../../Context/WishlistContext";
import ShareButton from "../../components/ShareButton/ShareButton";
import RecentlyViewed from "./RecentlyViewed";
import { AuthContext } from "../../Context/Auth";
import ButtonLoading from "../../components/Loaders/ButtonLoading";
import { ImDownload2 } from "react-icons/im";
import ImageCarouselModal from "../../components/ImageCarouselModal/ImageCarouselModal";
import { formatSizeUnit } from "../../lib/sizeUtils";

export default function ProductDetailPage() {
  const { convertPrice, currency, getCurrencySymbol } =
    useContext(CurrencyContext);
  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    wishlistCount,
    addWishLoading,
  } = useWishlist();
  const { addToRecentlyViewed } = useContext(AuthContext);
  const [showSharePopup, setShowSharePopup] = useState(false);

  const {
    addToCart,
    buyNow,
    isItemInCart,
    addLoading,
    buyNowLoading,
    cartData,
  } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedMetalVariant, setSelectedMetalVariant] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [ringSize, setRingSize] = useState("");
  const [selectedProductSizeId, setSelectedProductSizeId] = useState("");
  const { productVariantSlug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [carouselStartIndex, setCarouselStartIndex] = useState(0);
  const [openSections, setOpenSections] = useState({
    description: true,
    shipping: true,
    price: true,
  });
  const [selectedScrewOptionId, setSelectedScrewOptionId] = useState("");

  const extractTextFromHTML = (html) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || doc.body.innerText || "";
  };

  const displayPrice = (price) => {
    return `${getCurrencySymbol(currency)}${convertPrice(price).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleMetalVariantChange = (metalVariant) => {
    setSelectedMetalVariant(metalVariant);
    // Reset color selection when metal variant changes
    const group = product.groupedVariants.find(
      (g) => g.metalVariant.id === metalVariant.id
    );
    if (group && group.colors.length > 0) {
      setSelectedColor(group.colors[0]);
      if (group.colors[0].variant.productVariantImage?.length > 0) {
        setSelectedImage(
          group.colors[0].variant.productVariantImage[0].imageUrl
        );
      }
    } else {
      setSelectedColor(null);
      setSelectedImage("");
    }
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    if (color.variant.productVariantImage?.length > 0) {
      setSelectedImage(color.variant.productVariantImage[0].imageUrl);
    }
  };

  const generateShopAllUrl = (params) => {
    const baseUrl = "/shop-all";
    const queryParams = new URLSearchParams();

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

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await fetchProductBySlug(productVariantSlug);
        setProduct(response.data.data);

        // Find the variant that matches the productVariantSlug
        let initialVariant = null;
        for (const group of response.data.data.groupedVariants) {
          for (const color of group.colors) {
            if (color.variant.productVariantSlug === productVariantSlug) {
              initialVariant = color.variant;
              setSelectedMetalVariant(group.metalVariant);
              setSelectedColor(color);
              if (color.variant.productVariantImage?.length > 0) {
                setSelectedImage(color.variant.productVariantImage[0].imageUrl);
              }
              break;
            }
          }
          if (initialVariant) break;
        }

        // If variant not found (fallback), use first variant
        if (
          !initialVariant &&
          response.data.data?.groupedVariants?.length > 0
        ) {
          const firstGroup = response.data.data.groupedVariants[0];
          setSelectedMetalVariant(firstGroup.metalVariant);
          if (firstGroup.colors.length > 0) {
            setSelectedColor(firstGroup.colors[0]);
            if (firstGroup.colors[0].variant.productVariantImage?.length > 0) {
              setSelectedImage(
                firstGroup.colors[0].variant.productVariantImage[0].imageUrl
              );
            }
          }
        }
      } catch (error) {
        toast.error("Failed to fetch product details");
        console.log("Error fetching product details:", error);
        navigate("/shop-all");
      } finally {
        setLoading(false);
      }
    };

    if (productVariantSlug) {
      fetchProductDetails();
    }
    window.scrollTo(0, 0);
  }, [productVariantSlug, navigate]);

  // Get the currently selected variant
  const currentVariant = selectedColor?.variant;
  const metalVariant = selectedMetalVariant;
  const gemstoneVariant = currentVariant?.gemstoneVariant;

  // Get the current group of variants
  const currentGroup = product?.groupedVariants?.find(
    (group) => group.metalVariant.id === selectedMetalVariant?.id
  );

  const isInCart = currentVariant ? isItemInCart(currentVariant?.id) : false;

  useEffect(() => {
    if (product && currentVariant) {
      const viewedProduct = {
        id: currentVariant.id,
        productVariantTitle: currentVariant.productVariantTitle,
        productVariantSlug: currentVariant.productVariantSlug,
        finalPrice: currentVariant.finalPrice,
        productVariantImage: currentVariant.productVariantImage,
        products: {
          productSlug: product.productSlug,
          name: product.name,
        },
      };

      // Add to context (if using server-side tracking)
      addToRecentlyViewed(viewedProduct);

      const storedItems = JSON.parse(
        localStorage.getItem("recentlyViewed") || "[]"
      );
      const updatedItems = [
        viewedProduct,
        ...storedItems.filter((item) => item.id !== viewedProduct.id),
      ].slice(0, 10); // Keep only the last 8 items

      localStorage.setItem("recentlyViewed", JSON.stringify(updatedItems));
    }
  }, [product, currentVariant, addToRecentlyViewed]);

  if (loading || !product) {
    return (
      <div className="2xl:container mx-auto px-4 lg:px-14 py-4">
        <div className="flex md:sticky top-2 flex-wrap items-center text-xs sm:text-sm md:text-xs mb-4 sm:mb-6">
          <div className="flex items-center flex-wrap">
            <Skeleton className="h-4 w-12 mr-1" />
            <Skeleton className="h-4 w-4 mx-1" />
            <Skeleton className="h-4 w-20 mr-1" />
            <Skeleton className="h-4 w-4 mx-1" />
          </div>
          <Skeleton className="h-4 w-48 mt-1 sm:mt-0" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 xl:gap-12 mx-auto">
          <div className="lg:sticky md:top-10 self-start lg:col-span-2">
            <div className="bg-white flex flex-col sm:flex-row-reverse items-start gap-4 md:gap-5">
              <div className="w-full aspect-square">
                <Skeleton className="w-full h-full max-h-[350px] sm:max-h-[450px] md:max-h-[500px] xl:max-h-[600px]" />
              </div>

              <div className="flex sm:flex-col gap-3 sm:gap-4 pb-2 sm:pb-0 w-full sm:w-auto">
                {[...Array(4)].map((_, idx) => (
                  <Skeleton
                    key={idx}
                    className="w-14 h-14 sm:w-18 sm:h-18 md:w-24 md:h-20 flex-shrink-0"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
            <Skeleton className="h-6 w-3/4 sm:h-7 md:h-8" />

            <div className="flex items-center gap-2 sm:gap-3 md:gap-3">
              <Skeleton className="h-5 w-16 sm:h-6 md:h-7" />
              <Skeleton className="h-6 w-20 sm:h-7 md:h-8" />
              <Skeleton className="h-5 w-12 px-2 py-1" />
            </div>

            <div className="space-y-3 sm:space-y-4 md:space-y-5">
              <div>
                <Skeleton className="h-4 w-32 mb-1 sm:mb-1" />
                <Skeleton className="w-full h-10" />
              </div>

              <div>
                <Skeleton className="h-4 w-24 mb-1 sm:mb-1" />
                <Skeleton className="w-full h-10" />
              </div>

              <div>
                <div className="flex justify-between mb-1 sm:mb-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="w-full h-10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className=" max-w-[1450px] mx-auto px-4 lg:px-14 py-4">
        <>
          <SEOProvider
            title={product.metaTitle || product.name}
            description={
              product.metaDescription ||
              extractTextFromHTML(product.description)
            }
            keywords={product.metaKeywords}
            url={window.location.href}
          />
        </>
        <div className=" md:max-w-[1450px] md:mx-auto">
          <h3 className="flex lg:sticky top-2 flex-wrap items-center  text-xs sm:text-sm md:text-xs text-black font-medium mb-4 sm:mb-6">
            <span className="text-brown flex items-center flex-wrap">
              <Link to="/" className="whitespace-nowrap">
                Home
              </Link>
              <MdKeyboardArrowRight className="mx-1" />
              <Link
                to={generateShopAllUrl({
                  jewelryTypeSlug: product.jewelryType?.name.toLowerCase(),
                })}
                className="whitespace-nowrap"
              >
                {product.jewelryType?.name}
              </Link>
              <MdKeyboardArrowRight className="mx-1" />
            </span>
            <span className="text-wrap mt-1 sm:mt-0">{product.name}</span>
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 xl:gap-12 mx-auto">
            <div className="lg:sticky md:top-10 self-start lg:col-span-2">
              <div className="bg-white flex flex-col lg:flex-row-reverse items-start gap-4 md:gap-5">
                {/* RIGHT */}
                <div className="w-full  lg:aspect-square flex justify-center items-start relative">
                  {selectedImage ? (
                    selectedImage.endsWith(".mp4") ? (
                      <video
                        src={selectedImage}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="object-fill w-full h-full max-h-[350px] sm:max-h-[450px] md:max-h-[500px] xl:max-h-[600px]"
                        alt={product.name}
                      />
                    ) : (
                      <img
                        onClick={() => {
                          setCarouselStartIndex(
                            currentVariant?.productVariantImage?.findIndex(
                              (img) => img.imageUrl === selectedImage
                            ) || 0
                          );
                          setIsCarouselOpen(true);
                        }}
                        src={selectedImage}
                        alt={product.name}
                        loading="lazy"
                        className="cursor-zoom-in object-fill w-full h-full max-h-[350px] sm:max-h-[450px] md:max-h-[500px] xl:max-h-[600px]"
                      />
                    )
                  ) : (
                    <div className="w-full h-full max-h-[350px] sm:max-h-[450px] md:max-h-[500px] xl:max-h-[600px] bg-gray-200 flex items-center justify-center">
                      <span>No Image available</span>
                    </div>
                  )}

                  <ShareButton
                    url={window.location.href}
                    title={product.name}
                    price={displayPrice(currentVariant?.finalPrice)}
                    variantTitle={currentVariant?.productVariantTitle}
                    position="absolute"
                    className="z-10"
                  />
                </div>

                {/* LEFT */}
                <div className="flex lg:flex-col  md:max-h-[475px] xl:max-h-[600px] lg:overflow-y-auto lg:overflow-x-hidden gap-3 sm:gap-4 pb-2 sm:pb-0 w-full lg:w-32 overflow-x-auto ">
                  {currentVariant?.productVariantImage?.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedImage(img.imageUrl)}
                      className={`w-14 h-14 sm:w-18 sm:h-18 md:w-24 md:h-20 flex-shrink-0 border cursor-pointer ${
                        selectedImage === img.imageUrl
                          ? "border-brown"
                          : "border-gray-300"
                      }`}
                    >
                      {img.imageUrl.endsWith(".mp4") ? (
                        <video
                          src={img.imageUrl}
                          muted
                          playsInline
                          className="w-full h-full object-fill"
                          alt={`Thumbnail ${idx + 1}`}
                        />
                      ) : (
                        <img
                          src={img.imageUrl}
                          alt={`Thumbnail ${idx + 1}`}
                          loading="lazy"
                          className="w-full h-full object-fill"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Info Section */}
            <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
              <h1 className="text-md sm:text-lg md:text-2xl font-medium">
                {currentVariant?.productVariantTitle || product.name}
              </h1>

              <div className="flex items-center gap-2 sm:gap-3 md:gap-3 text-sm sm:text-base md:text-base">
                <>
                  <span className="text-black text-base sm:text-lg md:text-xl">
                    {displayPrice(currentVariant?.finalPrice)}
                    <span className="text-[12px]">(Incl. taxes)</span>
                  </span>
                  {currentVariant?.GlobalDiscount && (
                    <span className="brown text-white rounded-full text-[10px] sm:text-sm md:text-sm px-2 sm:px-2 md:px-3 py-1">
                      <>
                        {" "}
                        {currentVariant?.GlobalDiscount?.discountType ===
                          "FIXED" && "Flat ₹"}
                        {currentVariant?.GlobalDiscount?.discountValue}{" "}
                        {currentVariant?.GlobalDiscount?.discountType ===
                          "PERCENTAGE" && "%"}{" "}
                        OFF
                      </>
                    </span>
                  )}
                </>
              </div>

              <div className="space-y-3 sm:space-y-4 md:space-y-5">
                {/* Metal Variant Selection */}
                <div>
                  <label className="block mb-1 sm:mb-1 font-medium text-sm sm:text-sm md:text-sm">
                    Jewellery Material
                  </label>
                  <select
                    value={selectedMetalVariant?.id}
                    onChange={(e) => {
                      const selected = product.groupedVariants.find(
                        (g) => g.metalVariant.id === e.target.value
                      )?.metalVariant;
                      if (selected) handleMetalVariantChange(selected);
                    }}
                    className="w-full border-2 border-brown bg-[#ce967e]/10 px-3 py-2 focus:outline-none text-sm sm:text-sm"
                  >
                    {product.groupedVariants.map((group) => (
                      <option
                        key={group.metalVariant.id}
                        value={group.metalVariant.id}
                      >
                        {group.metalVariant.purityLabel}{" "}
                        {group.metalVariant.metalType?.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Color Selection */}
                <div>
                  <label className="block mb-1 sm:mb-1 font-medium text-sm sm:text-sm md:text-sm">
                    Metal Color
                  </label>
                  <select
                    value={selectedColor?.color}
                    onChange={(e) => {
                      const selected = currentGroup?.colors.find(
                        (c) => c.color === e.target.value
                      );
                      if (selected) handleColorChange(selected);
                    }}
                    className="w-full border-2 border-brown bg-[#ce967e]/10 capitalize px-3 py-2 focus:outline-none text-sm sm:text-sm"
                  >
                    {currentGroup?.colors.map((colorOption) => (
                      <option key={colorOption.color} value={colorOption.color}>
                        {colorOption.color}
                      </option>
                    ))}
                  </select>
                </div>

                {currentVariant?.ScrewOption?.length > 0 ? (
                  <div>
                    <label className="mb-1 sm:mb-1 capitalize font-medium flex justify-between items-center text-xs sm:text-sm md:text-sm">
                      Select Screw Option
                    </label>
                    <select
                      value={selectedScrewOptionId}
                      onChange={(e) => setSelectedScrewOptionId(e.target.value)}
                      className="w-full border-2 border-brown bg-[#ce967e]/10 px-3 py-2 focus:outline-none text-sm sm:text-sm"
                    >
                      <option value="">Select Screw Option</option>
                      {currentVariant?.ScrewOption.map((screw) => (
                        <option key={screw.id} value={screw.id}>
                          {screw.screwType} ({screw.screwMaterial})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : currentVariant?.productSize?.length > 0 ? (
                  <div>
                    <label className="mb-1 sm:mb-1 capitalize font-medium flex justify-between items-center text-xs sm:text-sm md:text-sm">
                      Select {product.jewelryType?.name.toLowerCase()} Size
                      {product.jewelryType?.name.toLowerCase() !==
                        "earrings" && (
                        <Link
                          to={`/${product.jewelryType?.name
                            .toLowerCase()
                            .replace(/\s+/g, "-")}-size-chart`}
                          className="text-brown text-xs sm:text-sm md:text-sm"
                        >
                          {product.jewelryType?.name} Size Chart
                        </Link>
                      )}
                    </label>
                    <select
                      value={selectedProductSizeId}
                      onChange={(e) => setSelectedProductSizeId(e.target.value)}
                      className="w-full border-2 border-brown bg-[#ce967e]/10 px-3 py-2 focus:outline-none text-sm sm:text-sm"
                    >
                      <option value="">Select Size</option>
                      {currentVariant?.productSize.map((size) => (
                        <option key={size.id} value={size.id}>
                          {size.label || size.labelSize}{" "}
                          {product.jewelryType?.name.toLowerCase() === "bangles"
                            ? ""
                            : formatSizeUnit(size.unit)}
                          {size.circumference ? `- ${size.circumference}` : ""}{" "}
                          {product.jewelryType?.name.toLowerCase() === "bangles"
                            ? formatSizeUnit(size.unit)
                            : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col gap-2 sm:gap-2 mt-1 sm:mt-2">
                <div className="flex gap-2 sm:gap-2 md:gap-3 text-xs md:text-xs xl:text-sm">
                  <button
                    onClick={async () => {
                      if (
                        currentVariant?.ScrewOption?.length > 0 &&
                        !selectedScrewOptionId
                      ) {
                        toast.error("Please select a screw option");
                        return;
                      }
                      if (
                        !selectedProductSizeId &&
                        currentVariant?.productSize?.length > 0 &&
                        !currentVariant?.ScrewOption?.length > 0
                      ) {
                        toast.error("Please select a size");
                        return;
                      }

                      const result = await addToCart(
                        currentVariant?.id,
                        currentVariant?.ScrewOption?.length > 0
                          ? selectedScrewOptionId
                          : selectedProductSizeId || null,
                        1,
                        currentVariant?.ScrewOption?.length > 0
                          ? "SCREW_OPTION"
                          : "SIZE"
                      );
                      if (result.success) {
                        setIsCartOpen(true);
                      }
                    }}
                    disabled={
                      isInCart ||
                      addLoading ||
                      (currentVariant?.stock !== undefined &&
                        currentVariant.stock <= 0)
                    }
                    className={`flex-1 ${
                      isInCart
                        ? "bg-[#ce967e] text-white cursor-not-allowed"
                        : currentVariant?.stock <= 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-white hover:bg-[#ce967e] cursor-pointer border-2 border-brown text-[#ce967e] hover:text-white"
                    } px-2 sm:px-2 md:px-3 py-2 sm:py-1 md:py-2 font-medium transition-colors duration-300 ease-in-out`}
                  >
                    {addLoading ? (
                      <span className="flex items-center justify-center">
                        Adding...
                      </span>
                    ) : isInCart ? (
                      "Added to Cart"
                    ) : currentVariant?.stock <= 0 ? (
                      "Out of Stock"
                    ) : (
                      "Add To Cart"
                    )}
                  </button>
                  <button
                    onClick={async () => {
                      if (isInWishlist(currentVariant?.id)) {
                        await removeFromWishlist(currentVariant?.id);
                      } else {
                        await addToWishlist(currentVariant?.id);
                      }
                    }}
                    disabled={addWishLoading}
                    className={`flex-1 cursor-pointer flex items-center justify-center gap-1 sm:gap-1 border-2 ${
                      isInWishlist(currentVariant?.id)
                        ? "border-black bg-black text-white"
                        : "border-black text-black hover:bg-black hover:text-white"
                    } ${
                      addWishLoading ? "opacity-70 cursor-not-allowed" : ""
                    } px-2 sm:px-2 md:px-3 py-2 sm:py-1 md:py-2 font-medium transition-colors duration-300 ease-in-out`}
                  >
                    {addWishLoading ? (
                      <span className="flex items-center justify-center gap-1">
                        Adding...
                      </span>
                    ) : isInWishlist(currentVariant?.id) ? (
                      <>
                        <FaHeart className="text-sm sm:text-sm" /> Added To
                        Wishlist
                      </>
                    ) : (
                      <>
                        <FaRegHeart className="text-sm sm:text-sm" /> Add To
                        Wishlist
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={async () => {
                    if (
                      currentVariant?.ScrewOption?.length > 0 &&
                      !selectedScrewOptionId
                    ) {
                      toast.error("Please select a screw option");
                      return;
                    }
                    if (
                      !selectedProductSizeId &&
                      currentVariant?.productSize?.length > 0 &&
                      !currentVariant?.ScrewOption?.length > 0
                    ) {
                      toast.error("Please select a size");
                      return;
                    }

                    const result = await buyNow(
                      currentVariant?.id,
                      currentVariant?.ScrewOption?.length > 0
                        ? selectedScrewOptionId
                        : selectedProductSizeId || null,
                      1,
                      currentVariant?.ScrewOption?.length > 0
                        ? "SCREW_OPTION"
                        : "SIZE"
                    );

                    // if (result.success) {
                    //   navigate("/checkout");
                    // }
                  }}
                  disabled={
                    (currentVariant?.stock !== undefined &&
                      currentVariant.stock <= 0) ||
                    buyNowLoading
                  }
                  className={`w-full ${
                    currentVariant?.stock <= 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "brown hover:shadow-md cursor-pointer text-white"
                  } px-2 sm:px-2 md:px-3 py-2.5 sm:py-1 md:py-2 font-semibold transition text-xs sm:text-sm md:text-sm`}
                >
                  {buyNowLoading ? (
                    <>
                      <span className="flex items-center justify-center">
                        <ButtonLoading />
                      </span>
                    </>
                  ) : (
                    "Buy Now"
                  )}
                </button>

                <div className="mt-3 sm:mt-4 md:mt-5">
                  <div className="max-w-4xl mx-auto p-0 sm:py-2 md:py-4 space-y-4 md:space-y-5 text-gray-800 text-xs sm:text-xs">
                    <section>
                      <h2
                        className="text-sm sm:text-sm md:text-base font-normal flex justify-between items-center border-t pt-2 sm:pt-2 mb-1 sm:mb-2 cursor-pointer"
                        onClick={() => toggleSection("description")}
                      >
                        Product Description
                        {openSections.description ? (
                          <FaAngleUp />
                        ) : (
                          <FaAngleDown />
                        )}
                      </h2>
                      {openSections.description && (
                        <>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: product.description,
                            }}
                            className="jodit-wysiwyg mb-1 sm:mb-2 text-xs [&>*]:text-xs [&>*]:poppins"
                          />

                          <h3 className="text-sm sm:text-sm font-medium mb-1 sm:mb-1 text-[#595959]">
                            Item Details
                          </h3>
                          <table className="w-full text-xs sm:text-xs mb-2 sm:mb-3 table-auto text-left stripe">
                            <tbody className="">
                              <tr className="bg-gray">
                                <td className="py-1 sm:py-2 font-normal text-gray w-1/2 px-1 sm:px-2">
                                  SKU
                                </td>
                                <td className="py-1 sm:py-2 px-1 sm:px-2 font-medium text-darkGray">
                                  {currentVariant?.sku}
                                </td>
                              </tr>
                              {product.productStyle?.length > 0 && (
                                <tr className="bg-white">
                                  <td className="py-1 sm:py-2 font-normal text-gray px-1 sm:px-2">
                                    Style
                                  </td>
                                  <td className="py-1 sm:py-2 px-1 sm:px-2 font-medium text-darkGray">
                                    {product.productStyle.map((style, idx) => (
                                      <span key={style.id || idx}>
                                        {style.name}
                                        {idx !== product.productStyle.length - 1
                                          ? ", "
                                          : ""}
                                      </span>
                                    ))}
                                  </td>
                                </tr>
                              )}
                              <tr className="bg-gray">
                                <td className="py-1 sm:py-2 font-normal text-gray px-1 sm:px-2">
                                  Gross Weight (Product)
                                </td>
                                <td className="py-1 sm:py-2 px-1 sm:px-2 font-medium text-darkGray">
                                  {currentVariant?.grossWeight} Grams
                                </td>
                              </tr>
                              {product.collection?.length > 0 && (
                              <tr className="bg-white">
                                <td className="py-1 sm:py-2 font-normal text-gray px-1 sm:px-2">
                                  Collection
                                </td>
                                <td className="py-1 sm:py-2 px-1 sm:px-2 !capitalize font-medium text-darkGray">
                                  {/* {product.collection?.name} */}
                                  {product.collection.map((style, idx) => (
                                    <span key={style.id || idx}>
                                      {style.name.toLowerCase()}
                                      {idx !== product.collection.length - 1
                                        ? ", "
                                        : ""}
                                    </span>
                                  ))}
                                </td>
                              </tr>
                              )}
                              <tr className="bg-gray">
                                <td className="py-1 sm:py-2 font-normal text-gray px-1 sm:px-2">
                                  Net Gold Weight
                                </td>
                                <td className="py-1 sm:py-2 px-1 sm:px-2 font-medium text-darkGray">
                                  {currentVariant?.metalWeightInGram} Grams
                                </td>
                              </tr>
                              <tr className="bg-white">
                                <td className="py-1 sm:py-2 font-normal text-gray px-1 sm:px-2">
                                  Metal Type & Color
                                </td>
                                <td className="py-1 sm:py-2 px-1 sm:px-2 font-medium text-darkGray">
                                  {metalVariant?.purityLabel}{" "}
                                  {metalVariant?.metalType?.name} -{" "}
                                  {selectedColor?.color}
                                </td>
                              </tr>
                            </tbody>
                          </table>

                          {gemstoneVariant && (
                            <>
                              <h3 className="text-sm sm:text-sm font-medium mb-1 sm:mb-1">
                                Diamond / Gemstone
                              </h3>
                              <table className="w-full text-xs sm:text-xs table-auto text-left">
                                <tbody className="">
                                  <tr className="bg-white">
                                    <td className="py-1 sm:py-2 font-normal text-gray w-1/2  px-1 sm:px-2">
                                      Total Carat Weight
                                    </td>
                                    <td className="py-1 sm:py-2 px-1 sm:px-2 font-medium text-darkGray">
                                      {(
                                        (currentVariant?.gemstoneWeightInCarat ||
                                          0) +
                                        (currentVariant?.sideDiamondWeight || 0)
                                      ).toFixed(2)}
                                      Carat
                                    </td>
                                  </tr>
                                  <tr className="bg-gray">
                                    <td className="py-1 sm:py-2 font-normal text-gray w-1/2  px-1 sm:px-2">
                                      Main Diamond Shape
                                    </td>
                                    <td className="py-1 sm:py-2 px-1 sm:px-2 font-medium text-darkGray">
                                      {gemstoneVariant?.shape}
                                    </td>
                                  </tr>
                                  <tr className="bg-white">
                                    <td className="py-1 sm:py-2 font-normal text-gray w-1/2  px-1 sm:px-2">
                                      Main Diamond Weight
                                    </td>
                                    <td className="py-1 sm:py-2 px-1 sm:px-2 font-medium text-darkGray">
                                      {currentVariant?.gemstoneWeightInCarat}{" "}
                                      Carat
                                    </td>
                                  </tr>
                                  <tr className="bg-gray">
                                    <td className="py-1 sm:py-2 font-normal text-gray px-1 sm:px-2">
                                      Main Diamond Color
                                    </td>
                                    <td className="py-1 sm:py-2 px-1 sm:px-2 font-medium text-darkGray">
                                      {gemstoneVariant.color}
                                    </td>
                                  </tr>
                                  <tr className="bg-white">
                                    <td className="py-1 sm:py-2 font-normal text-gray  px-1 sm:px-2">
                                      Main Diamond Clarity
                                    </td>
                                    <td className="py-1 sm:py-2 px-1 sm:px-2 font-medium text-darkGray">
                                      {gemstoneVariant.clarity}
                                    </td>
                                  </tr>
                                  <tr className="bg-gray">
                                    <td className="py-1 sm:py-2 font-normal text-gray px-1 sm:px-2">
                                      Main Diamond Cut
                                    </td>
                                    <td className="py-1 sm:py-2 px-1 sm:px-2 font-medium text-darkGray">
                                      {gemstoneVariant.cut}
                                    </td>
                                  </tr>
                                  {gemstoneVariant.certification && (
                                    <tr className="bg-white">
                                      <td className="py-1 sm:py-2 font-normal text-gray px-1 sm:px-2">
                                        Certification
                                      </td>
                                      <td className="py-1 sm:py-2 px-1 sm:px-2 font-medium text-darkGray">
                                        <div className="flex items-center justify-between">
                                          <span>
                                            {gemstoneVariant.certification}
                                          </span>
                                          {gemstoneVariant.certificateUrl && (
                                            <a
                                              href={
                                                gemstoneVariant.certificateUrl
                                              }
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              download={`${gemstoneVariant.certification}_certificate.pdf`}
                                              className="flex items-center gap-1 text-brown text-xs hover:font-normal ml-2 group"
                                              title="Download Certificate"
                                            >
                                              Download{" "}
                                              <ImDownload2 className="text-base transition-transform duration-200 group-hover:translate-y-0.5" />
                                            </a>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                  <tr className="bg-gray">
                                    <td className="py-1 sm:py-2 font-normal text-gray w-1/2 bg-gray px-1 sm:px-2">
                                      Main Diamond Type
                                    </td>
                                    <td className="py-1 sm:py-2 px-1 sm:px-2 font-medium text-darkGray">
                                      {gemstoneVariant.gemstoneType?.name}
                                    </td>
                                  </tr>

                                  <tr className="bg-white">
                                    <td className="py-1 sm:py-2 font-normal text-gray px-1 sm:px-2">
                                      Side Diamond Weight
                                    </td>
                                    <td className="py-1 sm:py-2 px-1 sm:px-2 font-medium text-darkGray">
                                      {currentVariant.sideDiamondWeight} Carat
                                    </td>
                                  </tr>
                                  <tr className="bg-gray">
                                    <td className="py-1 sm:py-2 font-normal text-gray px-1 sm:px-2">
                                      Number of Diamonds
                                    </td>
                                    <td className="py-1 sm:py-2 px-1 sm:px-2 font-medium text-darkGray">
                                      {currentVariant.numberOfDiamonds}
                                    </td>
                                  </tr>
                                  <tr className="bg-white">
                                    <td className="py-1 sm:py-2 font-normal text-gray px-1 sm:px-2">
                                      Number of Side Diamonds
                                    </td>
                                    <td className="py-1 sm:py-2 px-1 sm:px-2 font-medium text-darkGray">
                                      {currentVariant.numberOfSideDiamonds}
                                    </td>
                                  </tr>
                                  <tr className="bg-gray">
                                    <td className="py-1 sm:py-2 font-normal text-gray px-1 sm:px-2">
                                      Side Diamonds Quality
                                    </td>
                                    <td className="py-1 sm:py-2 px-1 sm:px-2 font-medium text-darkGray">
                                      {currentVariant.sideDiamondQuality}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </>
                          )}
                          {currentVariant?.note && (
                            <p className="text-xs text-darkGray mt-1 sm:mt-2  tracking-wide">
                              <span className="font-semibold">NOTE:</span>
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: currentVariant.note,
                                }}
                                className="jodit-wysiwyg  text-xs [&>*]:text-xs [&>*]:poppins"
                              />
                            </p>
                          )}
                        </>
                      )}
                    </section>

                    <section>
                      <h2
                        className="text-sm sm:text-sm md:text-base font-normal flex justify-between items-center border-t-2 pt-2 mb-1 sm:mb-2 cursor-pointer"
                        onClick={() => toggleSection("shipping")}
                      >
                        Shipping and Returns
                        {openSections.shipping ? (
                          <FaAngleUp />
                        ) : (
                          <FaAngleDown />
                        )}
                      </h2>
                      {openSections.shipping && (
                        // <p className="text-xs text-darkGray mt-1 sm:mt-2 font-medium tracking-wide">
                        //   {currentVariant?.returnPolicyText}
                        // </p>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: currentVariant.returnPolicyText,
                          }}
                          className="jodit-wysiwyg mb-1 sm:mb-2 text-xs [&>*]:text-xs [&>*]:poppins"
                        />
                      )}
                    </section>

                    <section>
                      <h2
                        className="text-sm sm:text-sm md:text-base font-normal flex justify-between items-center border-t-2 pt-2 mb-1 sm:mb-2 cursor-pointer"
                        onClick={() => toggleSection("price")}
                      >
                        Price Breakup
                        {openSections.price ? <FaAngleUp /> : <FaAngleDown />}
                      </h2>
                      {openSections.price && (
                        <>
                          <div className="border-2 border-brown text-xs sm:text-xs overflow-hidden mb-3 sm:mb-2">
                            <div className="grid grid-cols-1 bg-white p-1 sm:p-2 font-medium">
                              <span className="text-center">Metal Details</span>
                            </div>
                            <div className="grid grid-cols-2 bg-brown text-white p-1 sm:p-2 font-medium border-t">
                              <span>Gold Weight</span>
                              <span className="text-right">Value</span>
                            </div>

                            <div className="grid grid-cols-2 p-1 sm:p-2 border-t">
                              <span>
                                {currentVariant?.metalWeightInGram} gms
                              </span>
                              <span className="text-right">
                                {displayPrice(currentVariant?.metalPrice)}{" "}
                              </span>
                            </div>
                          </div>

                          {gemstoneVariant && (
                            <div className="border-2 border-brown text-xs sm:text-xs overflow-hidden mb-3 sm:mb-2">
                              <div className="grid grid-cols-1 bg-white p-1 sm:p-2 font-medium">
                                <span className="text-center">
                                  Diamond/Gemstone Details
                                </span>
                              </div>
                              <div className="grid grid-cols-2 bg-brown text-white p-1 sm:p-2 font-medium border-t">
                                <span>Diamond/Gemstone</span>
                                <span className="text-right">Value</span>
                              </div>

                              <div className="grid grid-cols-2 p-1 sm:p-2 border-t">
                                <span>
                                  {gemstoneVariant.shape} {"- "}
                                  {gemstoneVariant.clarity}
                                </span>
                                <span className="text-right">
                                  {displayPrice(currentVariant.diamondPrice)}
                                </span>
                              </div>
                            </div>
                          )}

                          {currentVariant?.makingChargePrice && (
                            <div className="border-2 border-brown text-xs sm:text-xs overflow-hidden mb-3 sm:mb-2">
                              <div className="grid grid-cols-1 bg-white p-1 sm:p-2 font-medium">
                                <span className="text-center">
                                  Making Details
                                </span>
                              </div>
                              <div className="grid grid-cols-2 bg-brown text-white p-1 sm:p-2 font-medium border-t">
                                <span>Components</span>
                                <span className="text-right">Value</span>
                              </div>

                              <div className="grid grid-cols-2 p-1 sm:p-2 border-t">
                                <span>Making & Wastage</span>
                                <span className="text-right">
                                  {/* {currentVariant?.MakingChargeWeightRange
                                  ?.chargeType === "FIXED" &&
                                  `${displayPrice(
                                    currentVariant?.MakingChargeWeightRange
                                      ?.chargeValue
                                  )}`}

                                {currentVariant?.MakingChargeWeightRange
                                  ?.chargeType === "PERCENTAGE" &&
                                  `${currentVariant?.MakingChargeWeightRange?.chargeValue}%`}

                                {currentVariant?.MakingChargeWeightRange
                                  ?.chargeType === "PER_GRAM_WEIGHT" &&
                                  `${displayPrice(
                                    currentVariant?.MakingChargeWeightRange
                                      ?.chargeValue
                                  )}/gm`} */}
                                  {displayPrice(
                                    currentVariant?.makingChargePrice
                                  )}
                                </span>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      <div className="border-t text-xs sm:text-xs border-brown overflow-hidden font-normal bg-white">
                        {/* <div className="grid grid-cols-2 border-2 border-brown font-normal p-1 sm:p-2 border-t">
                        <span>Net Value</span>
                        <span className="text-right">
                          {displayPrice(
                            currentVariant.sellingPrice - currentVariant.gst
                          )}
                        </span>
                      </div> */}
                        {currentVariant?.GlobalDiscount && (
                          <>
                            <div className="grid grid-cols-2 border-2 border-brown p-1 sm:p-2 border-t">
                              <span>Discount</span>
                              <span className="text-right">
                                {currentVariant?.GlobalDiscount
                                  ?.discountType === "FIXED" && "₹"}
                                {currentVariant?.GlobalDiscount?.discountValue}{" "}
                                {currentVariant?.GlobalDiscount
                                  ?.discountType === "PERCENTAGE" && "%"}
                              </span>
                            </div>
                          </>
                        )}
                        {currentVariant?.gst > 0 && (
                          <div className="grid grid-cols-2 border-2 border-brown p-1 sm:p-2 border-t">
                            <span>GST</span>
                            <span className="text-right">
                              {currentVariant?.gst}%
                            </span>
                          </div>
                        )}
                        <div className="grid grid-cols-2 border-2 border-brown p-1 sm:p-2 border-t">
                          <span>Grand Total</span>
                          <span className="text-right">
                            {displayPrice(currentVariant?.finalPrice)}
                          </span>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <RelatedSuggestions product={product.relatedSuggestion} />
        <RecentlyViewed />
        <ReviewCard variantId={currentVariant?.id} />
        {isCartOpen && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-50">
            <div className="fixed top-0 right-0 h-full w-full md:w-md xl:w-xl bg-white shadow-xl transform translate-x-0 transition-transform duration-300 ease-in-out z-50">
              <Cart onClose={() => setIsCartOpen(false)} />
            </div>
          </div>
        )}
      </div>

      {isCarouselOpen && currentVariant?.productVariantImage && (
        <ImageCarouselModal
          images={currentVariant.productVariantImage.map((img) => img.imageUrl)}
          initialIndex={carouselStartIndex}
          onClose={() => setIsCarouselOpen(false)}
        />
      )}
    </>
  );
}
