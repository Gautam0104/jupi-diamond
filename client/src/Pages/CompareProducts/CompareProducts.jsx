import React, { useContext, useEffect, useState } from "react";
import { useCompare } from "../../Context/CompareContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { getProductComparison } from "../../api/Public/publicApi";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { AiFillThunderbolt } from "react-icons/ai";
import { FaRegImage } from "react-icons/fa6";
import { ScaleIcon } from "lucide-react";
import { CurrencyContext } from "../../Context/CurrencyContext";

const CompareProducts = () => {
  const { compareProducts, clearCompare } = useCompare();
  const [comparisonData, setComparisonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
    const fetchComparisonData = async () => {
      try {
        setLoading(true);

        const slugsFromParams = searchParams.get("compare")?.split(",") || [];
        const slugsToCompare =
          compareProducts.length > 0
            ? compareProducts.map((p) => p.productVariantSlug)
            : slugsFromParams;

        if (slugsToCompare.length > 1) {
          const response = await getProductComparison(slugsToCompare);
          setComparisonData(response.data.data);

          if (compareProducts.length > 0) {
            navigate(`?compare=${slugsToCompare.join(",")}`, { replace: true });
          }
        } else {
          setComparisonData([]); // clear table if no valid products
        }
      } catch (error) {
        console.error("Error fetching comparison data:", error);
      } finally {
        setLoading(false);
      }
    };

    // ✅ Condition to avoid repeated fetches after clearing
    if (
      compareProducts.length > 1 ||
      (compareProducts.length === 0 && searchParams.get("compare"))
    ) {
      fetchComparisonData();
    }
    window.scrollTo(0, 0); 
  }, [compareProducts, searchParams, navigate]);

  const handleClearCompare = () => {
    clearCompare();
    navigate("/compare", { replace: true });
    setComparisonData([]);
  };

  if (compareProducts.length < 2 && !searchParams.get("compare")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 max-w-7xl mx-auto text-center bg-gradient-to-b from-gray-50 to-white transition-all duration-500">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 w-full max-w-md transform transition-all duration-300 hover:shadow-xl animate-fadeIn">
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 opacity-50 rounded-full blur-xl animate-pulse"></div>
            <ScaleIcon className="mx-auto h-12 w-12 text-brown dark:text-blue-300 relative z-10 transition-transform duration-300 hover:scale-110" />
          </div>
          <h2 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white mb-3 tracking-tight">
            Compare Products
          </h2>
          <p className="text-gray-600 text-sm sm:text-base xl:text-base dark:text-gray-300 mb-6 leading-relaxed">
            Please select at least 2 products to start the comparison process.
          </p>
          <div className="flex justify-center">
            <Button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto text-xs sm:text-sm bg-brown  text-white font-semibold py-2 px-6 rounded-sm transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5"
            >
              Browse Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const renderProductComapreImages = (product) => (
    <div className="relative w-24 h-24 sm:w-20 sm:h-20 lg:w-24 lg:h-24 xl:w-40 xl:h-40 aspect-square">
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
              <span className="text-gray-400 font-semibold text-md sm:text-xl xl:text-2xl">
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

  if (loading) {
    return (
      <div className="p-4 max-w-7xl mx-auto">
        <h2 className="text-lg font-semibold mb-4">Compare Products</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Define the attributes to compare
  const attributes = [
    {
      key: "productVariantTitle",
      label: "Product Title",
      accessor: (product) => (
        <span className="font-semibold text-xs sm:text-sm">
          {product.productVariantTitle}
        </span>
      ),
    },

    {
      key: "finalPrice",
      label: "Price",
      accessor: (product) => displayPrice(product.finalPrice),
    },
    {
      key: "rating",
      label: "Rating",
      accessor: (product) =>
        `${
          product.ProductReview.length > 0
            ? `${product.ProductReview.length} Ratings`
            : " -"
        } `,
    },

    {
      key: "metalType",
      label: "Metal Type",
      accessor: (product) => product.metalVariant?.metalType?.name,
    },
    {
      key: "metalPurity",
      label: "Metal Purity",
      accessor: (product) => product.metalVariant?.purityLabel,
    },
    {
      key: "metalColor",
      label: "Metal Color",
      accessor: (product) => product.metalColor?.name,
    },
    {
      key: "metalPrice",
      label: "Metal Price",
      accessor: (product) => displayPrice(product.metalPrice),
    },
    {
      key: "metalWeightInGram",
      label: "Metal Weight",
      format: (value) => `${value} gm`,
      accessor: (product) => product.metalWeightInGram,
    },
    {
      key: "metalPriceInGram",
      label: "Metal Price/Gram",
      accessor: (product) =>
        displayPrice(product.metalVariant?.metalPriceInGram),
    },

    {
      key: "gemstoneType",
      label: "Gemstone Type",
      accessor: (product) =>
        product.gemstoneVariant?.gemstoneTypeId ? "Diamond" : "-",
    },
    {
      key: "gemstoneOrigin",
      label: "Gemstone Origin",
      accessor: (product) =>
        product.gemstoneVariant?.origin?.replace("_", " ") || "-",
    },
    {
      key: "gemstoneClarity",
      label: "Gemstone Clarity",
      accessor: (product) => product.gemstoneVariant?.clarity || "-",
    },
    {
      key: "gemstoneCut",
      label: "Gemstone Cut",
      accessor: (product) => product.gemstoneVariant?.cut || "-",
    },
    {
      key: "gemstoneColor",
      label: "Gemstone Color",
      accessor: (product) => product.gemstoneVariant?.color || "-",
    },
    {
      key: "gemstoneShape",
      label: "Gemstone Shape",
      accessor: (product) => product.gemstoneVariant?.shape || "-",
    },
    {
      key: "gemstoneCertification",
      label: "Gemstone Certification",
      accessor: (product) => product.gemstoneVariant?.certification || "-",
    },
    {
      key: "gemstonePrice",
      label: "Gemstone Price",
      accessor: (product) =>
        product.gemstoneVariant?.gemstonePrice
          ? displayPrice(product.gemstoneVariant.gemstonePrice)
          : "-",
    },
    {
      key: "gemstoneWeightInCarat",
      label: "Gemstone Weight",
      format: (value) => (value ? `${value} ct` : "-"),
      accessor: (product) => product.gemstoneWeightInCarat,
    },
    {
      key: "diamondPrice",
      label: "Diamond Price",
      accessor: (product) =>
        product.diamondPrice ? displayPrice(product.diamondPrice) : "-",
    },

    {
      key: "numberOfDiamonds",
      label: "Number of Diamonds",
      accessor: (product) => product.numberOfDiamonds || "-",
    },
    {
      key: "numberOfSideDiamonds",
      label: "Side Diamonds",
      accessor: (product) => product.numberOfSideDiamonds || "-",
    },
    {
      key: "sideDiamondPriceCarat",
      label: "Side Diamond Price/Carat",
      accessor: (product) =>
        product.sideDiamondPriceCarat
          ? displayPrice(product.sideDiamondPriceCarat)
          : "-",
    },
    {
      key: "sideDiamondWeight",
      label: "Side Diamond Weight",
      format: (value) => (value ? `${value} ct` : "-"),
      accessor: (product) => product.sideDiamondWeight,
    },
    {
      key: "totalPriceSideDiamond",
      label: "Total Side Diamond Price",
      accessor: (product) =>
        product.totalPriceSideDiamond
          ? displayPrice(product.totalPriceSideDiamond)
          : "-",
    },

    {
      key: "grossWeight",
      label: "Gross Weight",
      format: (value) => `${value} gm`,
      accessor: (product) => product.grossWeight,
    },
    {
      key: "dimensions",
      label: "Dimensions (L×W×H)",
      format: (dimensions) => {
        const [length = "-", width = "-", height = "-"] = dimensions || [];
        return `${length} × ${width} × ${height}`;
      },
      accessor: (product) => [product.length, product.width, product.height],
    },
    {
      key: "stock",
      label: "Stock",
      accessor: (product) => product.stock,
    },
    {
      key: "isFeatured",
      label: "Featured",
      accessor: (product) => (product.isFeatured ? "Yes" : "No"),
    },
    {
      key: "isNewArrival",
      label: "New Arrival",
      accessor: (product) => (product.isNewArrival ? "Yes" : "No"),
    },
    {
      key: "returnPolicyText",
      label: "Return Policy",
      accessor: (product) => product.returnPolicyText,
    },
    {
      key: "gst",
      label: "GST",
      format: (value) => (value ? `${value}%` : "0%"),
      accessor: (product) => product.gst,
    },

    {
      key: "description",
      label: "Description",
      accessor: (product) => (
        <div
          dangerouslySetInnerHTML={{
            __html: product.products?.description || "",
          }}
          className="jodit-wysiwyg"
        />
      ),
      disableFormatting: true,
    },
  ];

  return (
    <div className="p-4 overflow-x-auto w-full sm:max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm sm:text-lg font-semibold">
          Compare Products{" "}
          {comparisonData.length > 0 ? `(${comparisonData.length})` : ""}
        </h2>
        <Button
          variant="outline"
          className="text-xs sm:text-sm"
          onClick={handleClearCompare}
        >
          Clear Comparison
        </Button>
      </div>

      <div className="w-full overflow-x-auto">
        {/* Desktop Table */}
        <table className="w-full table-fixed border-collapse hidden md:table">
          <thead>
            <tr>
              <th className="w-1/5 p-4"></th>
              {comparisonData.map((product) => (
                <th key={product.id} className="text-center px-4 py-2">
                  <div className="relative w-full flex justify-center">
                    {renderProductComapreImages(product)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm">
            {attributes.map((attr) => (
              <tr key={attr.key} className="border-t-2">
                <td className="font-semibold p-4 border-2">{attr.label}</td>
                {comparisonData.map((product) => {
                  const value = attr.accessor
                    ? attr.accessor(product)
                    : product[attr.key];
                  return (
                    <td
                      key={`${product.id}-${attr.key}`}
                      className="text-center p-4 border-2"
                    >
                      {attr.format ? attr.format(value) : value || "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr className="border-2">
              <td className="font-semibold p-2"></td>
              {comparisonData.map((product) => (
                <td
                  key={`${product.id}-action`}
                  className="text-center p-4 border-2"
                >
                  <Button
                    asChild
                    className="text-xs sm:text-sm bg-brown rounded-none w-full py-2"
                  >
                    <a
                      href={`/shop-all/details/${product.products?.productSlug}`}
                    >
                      <AiFillThunderbolt className="inline mr-1" /> Buy Now
                    </a>
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>

        {/* Mobile Accordion */}
        <div className="md:hidden overflow-x-auto">
          <div className="min-w-[600px] sm:min-w-[500px]">
            {/* Product Headers */}
            <div className="flex ">
              <div className="w-36 p-2 sticky left-0 bg-white z-10">
                <p className="text-sm font-semibold text-gray-800">Attribute</p>
              </div>
              {comparisonData.map((product) => (
                <div
                  key={product.id}
                  className={` ${
                    comparisonData.length === 2 ? "w-1/2" : "w-1/3"
                  } p-2 flex flex-col items-center border`}
                >
                  <div className=" mb-2">
                    {renderProductComapreImages(product)}
                  </div>
                </div>
              ))}
            </div>

            {/* Attributes */}
            {attributes.map((attr) => (
              <div key={attr.key} className="flex ">
                <div className="w-36 p-2 sticky left-0 bg-white z-10 border">
                  <span className="text-xs font-medium text-gray-700">
                    {attr.label}
                  </span>
                </div>
                {comparisonData.map((product) => {
                  const value = attr.accessor
                    ? attr.accessor(product)
                    : product[attr.key];
                  return (
                    <div
                      key={`${product.id}-${attr.key}`}
                      className={`${
                        comparisonData.length === 2 ? "w-1/2" : "w-1/3"
                      } p-2 text-center border`}
                    >
                      <span className="text-xs text-gray-600">
                        {attr.format ? attr.format(value) : value || "-"}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Buy Now Buttons */}
            <div className="flex border-b">
              <div className="w-36 p-2 sticky left-0 bg-white"></div>
              {comparisonData.map((product) => (
                <div
                  key={`${product.id}-action`}
                  className={`${
                    comparisonData.length === 2 ? "w-1/2" : "w-1/3"
                  } p-2 border`}
                >
                  <Button
                    asChild
                    className="text-xs bg-brown text-white rounded-none w-full py-1.5"
                  >
                    <a
                      href={`/shop-all/details/${product.products?.productSlug}`}
                    >
                      <AiFillThunderbolt className="inline mr-1" /> Buy Now
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareProducts;
