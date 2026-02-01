import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "../../../components/ui/badge";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { toast } from "sonner";
import { FiArrowLeft } from "react-icons/fi";
import { Button } from "../../../components/ui/button";
import { getProductVariantById } from "../../../api/Admin/ProductApi";
import EditableStockCell from "./EditableStockCell";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await getProductVariantById(id);

        setProduct(response.data.data);
      } catch (error) {
        toast.error("Failed to fetch product details");
        console.log("Error fetching product details:", error);
        navigate("/admin/product");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const extractTextFromHTML = (html) => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || doc.body.innerText || "";
  };

  const truncatedDescription = (html) => {
    const plainText = extractTextFromHTML(html);
    return plainText;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleStockUpdate = (variantId, newStock) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      stock: newStock,
    }));
  };

  if (loading) {
    return (
      <div className="w-full">
        <div className="min-h-screen">
          <div className="mx-auto">
            <div className="flex items-center mb-4">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse ml-4"></div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              <div className="w-full lg:w-[55%] space-y-6">
                <div className="bg-white p-6 rounded-lg">
                  <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(6)].map((_, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg">
                  <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mt-8 mb-4"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(8)].map((_, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                    <div className="flex flex-wrap gap-2">
                      {[...Array(5)].map((_, idx) => (
                        <div
                          key={idx}
                          className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                  <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                    {[...Array(4)].map((_, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-[45%] space-y-6">
                <div className="bg-white rounded-xl shadow p-6">
                  <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="p-3 bg-[#FFF7F7] border border-gray-200 border-dashed rounded-lg">
                    <div className="flex flex-row gap-3">
                      <div className="h-52 w-48 flex-shrink-0 bg-gray-200 rounded-lg animate-pulse"></div>
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          {[...Array(3)].map((_, idx) => (
                            <div
                              key={idx}
                              className="h-24 w-20 bg-gray-200 rounded-lg animate-pulse"
                            ></div>
                          ))}
                        </div>
                        <div className="flex gap-3">
                          {[...Array(2)].map((_, idx) => (
                            <div
                              key={idx}
                              className="h-24 w-20 bg-gray-200 rounded-lg animate-pulse"
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                  <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                    {[...Array(6)].map((_, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                  <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                    {[...Array(4)].map((_, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse mt-6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Product not found</p>
      </div>
    );
  }
  function isVideoFile(url) {
    return /\.(mp4|webm|ogg)$/i.test(url) || url.includes("videos.domain.com");
  }

  const Info = ({ label, value }) => (
    <div className="flex flex-col">
      <span className="text-black font-semibold">{label}</span>
      <span className="text-gray-900 break-words">{value || "N/A"}</span>
    </div>
  );

  const generalInfo = [
    { label: "Product Variant Title", value: product.productVariantTitle },
    { label: "Product Variant Slug", value: product.productVariantSlug },

    {
      label: "Description",
      value: (
        <div
          dangerouslySetInnerHTML={{
            __html: product.products?.description,
          }}
          className="jodit-wysiwyg "
        />
      ),
    },
    { label: "Number of Diamonds", value: product.numberOfDiamonds },
    { label: "Number of Gemstones", value: product.numberOfgemStones },

    { label: "Metal Weight (g)", value: product.metalWeightInGram },
    { label: "Gemstone Weight (ct)", value: product.gemstoneWeightInCarat },
    { label: "Selling Price", value: formatPrice(product.sellingPrice) },
    { label: "Final Price", value: formatPrice(product.finalPrice) },
    {
      label: "Stock",
      value: (
        <EditableStockCell
          variant={product}
          onStockUpdate={handleStockUpdate}
        />
      ),
    },
    { label: "GST (%)", value: product.gst },
    { label: "SKU", value: product.sku || "N/A" },
    { label: "Status", value: product.isActive ? "Active" : "Inactive" },
    // { label: "Featured", value: product.isFeatured ? "Yes" : "No" },
    // { label: "New Arrival", value: product.isNewArrival ? "Yes" : "No" },
    {
      label: "Return Policy",
      value: (
        <div
          dangerouslySetInnerHTML={{
            __html: product.returnPolicyText,
          }}
          className="jodit-wysiwyg "
        />
      ),
    },

    { label: "Length", value: product.length },
    { label: "Width", value: product.width },
    { label: "Height", value: product.height },
    {
      label: "Note",
      value: (
        <div
          dangerouslySetInnerHTML={{
            __html: product.note,
          }}
          className="jodit-wysiwyg "
        />
      ),
    },
    { label: "Created At", value: formatDate(product.createdAt) },
    { label: "Updated At", value: formatDate(product.updatedAt) },
  ];

  const metalVariantInfo = [
    { label: "Metal Type", value: product.metalVariant?.metalType?.name },
    { label: "Purity Label", value: product.metalVariant?.purityLabel },
    { label: "Metal Color", value: product.metalColor?.name },
    {
      label: "Price Per Gram",
      value: formatPrice(product.metalVariant?.metalPriceInGram),
    },
    // {
    //   label: "Buy Back Price",
    //   value: formatPrice(product.metalVariant?.byBackPrice),
    // },
    { label: "Created At", value: formatDate(product.metalVariant?.createdAt) },
    { label: "Updated At", value: formatDate(product.metalVariant?.updatedAt) },
  ];

  const gemstoneVariantInfo = [
    {
      label: "Gemstone Type",
      value: product.gemstoneVariant?.gemstoneType?.name,
    },
    { label: "Origin", value: product.gemstoneVariant?.origin },
    { label: "Clarity", value: product.gemstoneVariant?.clarity },
    { label: "Cut", value: product.gemstoneVariant?.cut },
    {
      label: "Price",
      value: formatPrice(product.gemstoneVariant?.gemstonePrice),
    },
    { label: "Shape", value: product.gemstoneVariant?.shape },
    // {
    //   label: "Dimensions",
    //   value: `${product.gemstoneVariant?.height} × ${product.gemstoneVariant?.width} × ${product.gemstoneVariant?.depth} mm`,
    // },
    { label: "Certification", value: product.gemstoneVariant?.certification },
    {
      label: "Certificate Number",
      value: product.gemstoneVariant?.certificateNumber,
    },
    { label: "Number of Side Diamonds", value: product.numberOfSideDiamonds },
    {
      label: "Side Diamond Price Carat",
      value: formatPrice(product.sideDiamondPriceCarat),
    },
    { label: "Side Diamond Weight", value: product.sideDiamondWeight },
    { label: "Side Diamond Quality", value: product.sideDiamondQuality },
    {
      label: "Total Price Side Diamond",
      value: formatPrice(product.totalPriceSideDiamond),
    },
  ];

  const productInfo = [
    { label: "Name", value: product.products?.name },
    { label: "Slug", value: product.products?.productSlug },
    { label: "Jewelry Type", value: product.products?.jewelryType?.name },
    {
      label: "Collection",
      value: product.products?.collection?.length ? (
        <div className="flex flex-wrap gap-2 mt-1">
          {product.products.collection.map((collection) => (
            <Badge
              key={collection.id}
              className="bg-white border-2 border-gray-200 text-black"
            >
              {collection.name}
            </Badge>
          ))}
        </div>
      ) : (
        <Badge color="gray">N/A</Badge>
      ),
    },
    {
      label: "Style",
      value: product.products?.productStyle?.length ? (
        <div className="flex flex-wrap gap-2 mt-1">
          {product.products.productStyle.map((style) => (
            <Badge
              key={style.id}
              className="bg-white border-2 border-gray-200 text-black"
            >
              {style.name}
            </Badge>
          ))}
        </div>
      ) : (
        <Badge color="gray">N/A</Badge>
      ),
    },
    {
      label: "Occasion",
      value: product.products?.occasion?.length ? (
        <div className="flex flex-wrap gap-2 mt-1">
          {product.products.occasion.map((occasion) => (
            <Badge
              key={occasion.id}
              className="bg-white border-2 border-gray-200 text-black"
            >
              {occasion.name}
            </Badge>
          ))}
        </div>
      ) : (
        <Badge color="gray">N/A</Badge>
      ),
    },
    { label: "Meta Title", value: product.products?.metaTitle },
    {
      label: "Meta Description",
      value: truncatedDescription(product.products?.metaDescription),
    },
  ];

  const makingChargeInfo = [
    {
      label: "Charge Category",
      value: product.MakingChargeWeightRange?.chargeCategory,
    },
    {
      label: "Charge Type",
      value: product.MakingChargeWeightRange?.chargeType,
    },
    {
      label: "Metal Variant",
      value: product.MakingChargeWeightRange?.metalVariant?.metalVariantSlug,
    },
    {
      label: "Gemstone Variant",
      value:
        product.MakingChargeWeightRange?.gemstoneVariant?.gemstoneVariantSlug,
    },
    {
      label: "Weight Range",
      value: `${product.MakingChargeWeightRange?.minWeight}-${product.MakingChargeWeightRange?.maxWeight}g`,
    },
    {
      label: "Charge Value",
      value:
        product.MakingChargeWeightRange?.chargeType === "PERCENTAGE"
          ? `${product.MakingChargeWeightRange?.chargeValue}%`
          : product.MakingChargeWeightRange?.chargeType === "PER_GRAM_WEIGHT"
          ? `${formatPrice(product.MakingChargeWeightRange?.chargeValue)}/g`
          : formatPrice(product.MakingChargeWeightRange?.chargeValue),
    },
    {
      label: "Charge Value",
      value:
        product.MakingChargeWeightRange?.chargeType === "PERCENTAGE"
          ? `${product.MakingChargeWeightRange?.chargeValue}%`
          : formatPrice(product.MakingChargeWeightRange?.chargeValue),
    },
    {
      label: "Discount Type",
      value: product.MakingChargeWeightRange?.discountType,
    },
    {
      label: "Discount Value",
      value:
        product.MakingChargeWeightRange?.discountType === "PERCENTAGE"
          ? `${product.MakingChargeWeightRange?.discountValue}%`
          : formatPrice(product.MakingChargeWeightRange?.discountValue),
    },
    {
      label: "Category Set",
      value: product.MakingChargeWeightRange?.MakingChargeCategorySet?.category,
    },
    {
      label: "Making & Wastage Price",
      value: formatPrice(product?.makingChargePrice),
    },
  ];

  const globalDiscountInfo = [
    { label: "Title", value: product.GlobalDiscount?.title },
    { label: "Description", value: product.GlobalDiscount?.description },
    { label: "Discount Type", value: product.GlobalDiscount?.discountType },
    { label: "Discount Value", value: product.GlobalDiscount?.discountValue },
    {
      label: "Status",
      value: product.GlobalDiscount?.isActive ? "Active" : "Inactive",
    },
    {
      label: "Valid From",
      value: formatDate(product.GlobalDiscount?.validFrom),
    },
    { label: "Valid To", value: formatDate(product.GlobalDiscount?.validTo) },
  ];

  const karigarInfo = [
    { label: "Name", value: product.Karigar?.name },
    { label: "Email", value: product.Karigar?.email },
    { label: "Phone", value: product.Karigar?.phone },
    { label: "Location", value: product.Karigar?.location },
    { label: "Expertise", value: product.Karigar?.expertise },
    {
      label: "Status",
      value: product.Karigar?.isActive ? "Active" : "Inactive",
    },
  ];

  const productSizeInfo = [
    {
      label: "Size",
      value: product?.productSize?.label || product?.productSize?.labelSize,
    },
    { label: "Unit", value: product.productSize?.unit },
    { label: "Product Size Slug", value: product.productSize?.productSizeSlug },
    { label: "Created At", value: formatDate(product.productSize?.createdAt) },
    { label: "Updated At", value: formatDate(product.productSize?.updatedAt) },
  ];
  const screwOptionInfo = (screwOption) => [
    { label: "Type", value: screwOption?.screwType },
    { label: "Material", value: screwOption?.screwMaterial },
    { label: "Detachable", value: screwOption?.isDetachable ? "Yes" : "No" },
    { label: "Notes", value: screwOption?.notes || "N/A" },
    { label: "Created At", value: formatDate(screwOption?.createdAt) },
    { label: "Updated At", value: formatDate(screwOption?.updatedAt) },
  ];

  const MediaThumbnail = ({ media, idx }) => {
    const isVideo = isVideoFile(media.imageUrl);

    return (
      <div className="flex-shrink-0 bg-white">
        {isVideo ? (
          <video
            src={media.imageUrl}
            controls
            className="h-24 w-24 object-fit rounded-lg border"
          />
        ) : (
          <img
            src={media.imageUrl}
            alt={`Product ${idx + 2}`}
            className="h-24 w-24 object-fit rounded-lg border"
          />
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="min-h-screen">
        <div className="mx-auto">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-semibold ml-4">Product Detail</h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* LEFT COLUMN */}
            <div className=" w-full lg:w-[55%] space-y-6">
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">
                  General Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  {generalInfo.map((item, idx) => (
                    <Info key={idx} label={item.label} value={item.value} />
                  ))}
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg">
                <h3 className="text-lg font-semibold mt-8 mb-4">
                  Product Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  {productInfo.map((item, idx) => (
                    <Info key={idx} label={item.label} value={item.value} />
                  ))}
                </div>

                {product.products?.tags?.length > 0 && (
                  <>
                    <h3 className="text-lg font-semibold mt-8 mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.products.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}

                {product.products?.metaKeywords?.length > 0 && (
                  <>
                    <h3 className="text-lg font-semibold mt-8 mb-4">
                      Meta Keywords
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.products.metaKeywords.map((keyword, idx) => (
                        <Badge key={idx} variant="outline">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {product.gemstoneVariant && (
                <div className="bg-white rounded-xl shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Gemstone Variant
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 text-sm text-gray-800">
                    {gemstoneVariantInfo.map((item, idx) => (
                      <Info key={idx} label={item.label} value={item.value} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN */}
            <div className="w-full lg:w-[45%] space-y-6">
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold mb-2">Product Media</h2>
                <p className="text-sm text-gray-600 mb-4">Product Photos</p>
                <div className="p-3 bg-[#FFF7F7] border border-gray-200 border-dashed  rounded-lg">
                  <div className="flex flex-row gap-3">
                    {/* First item (fixed size) */}
                    {product.productVariantImage?.length > 0 && (
                      <div className="h-52 w-48 bg-white flex-shrink-0">
                        {" "}
                        {/* Prevent shrinking */}
                        {isVideoFile(
                          product.productVariantImage[0].imageUrl
                        ) ? (
                          <video
                            src={product.productVariantImage[0].imageUrl}
                            controls
                            className="h-full w-full object-fit rounded-lg border"
                          />
                        ) : (
                          <img
                            src={product.productVariantImage[0].imageUrl}
                            alt="Product main"
                            className="h-full w-full object-fit rounded-lg border"
                          />
                        )}
                      </div>
                    )}

                    {/* Scrollable items (horizontal) */}
                    {product.productVariantImage?.length > 1 && (
                      <div className="space-y-3">
                        <div className="flex gap-3 overflow-x-auto w-full scrollbar-hide scrollbarWidthNone">
                          {product.productVariantImage
                            .slice(
                              1,
                              Math.ceil(
                                product.productVariantImage.length / 2
                              ) + 1
                            )
                            .map((media, idx) => (
                              <MediaThumbnail
                                key={idx + 1}
                                media={media}
                                idx={idx}
                              />
                            ))}
                        </div>
                        {product.productVariantImage.length > 2 && ( // Only show if more than 2 items
                          <div className="flex gap-3 overflow-x-auto w-full scrollbar-hide scrollbarWidthNone">
                            {product.productVariantImage
                              .slice(
                                Math.ceil(
                                  product.productVariantImage.length / 2
                                ) + 1
                              )
                              .map((media, idx) => (
                                <MediaThumbnail
                                  key={
                                    idx +
                                    Math.ceil(
                                      product.productVariantImage.length / 2
                                    ) +
                                    1
                                  }
                                  media={media}
                                  idx={idx}
                                />
                              ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Metal Variant</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 text-sm text-gray-800">
                  {metalVariantInfo.map((item, idx) => (
                    <Info key={idx} label={item.label} value={item.value} />
                  ))}
                </div>
              </div>

              {product.productSize && product.productSize.length > 0 && (
                <div className="bg-white rounded-xl shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Product Sizes</h2>
                  <div className="space-y-4">
                    {product.productSize.map((size, index) => (
                      <div
                        key={size.id}
                        className="grid grid-cols-1 md:grid-cols-2 gap-y-4 text-sm text-gray-800 "
                      >
                        {product.products?.jewelryType?.name === "Bangles" ? (
                          <Info
                            label="Size"
                            value={`${size.label || size.labelSize} `}
                          />
                        ) : (
                          <Info
                            label="Size"
                            value={`${size.label || size.labelSize} ${
                              size.unit
                            }`}
                          />
                        )}
                        <Info
                          label="Product Size Slug"
                          value={size.productSizeSlug}
                        />
                        {product.products?.jewelryType?.name === "Bangles" ? (
                          <Info
                            label="Diameter"
                            value={`${size.circumference} ${size.unit}`}
                          />
                        ) : (
                          <Info
                            label="Circumference"
                            value={size.circumference}
                          />
                        )}
                        {/* <Info
                          label="Created At"
                          value={formatDate(size.createdAt)}
                        />
                        <Info
                          label="Updated At"
                          value={formatDate(size.updatedAt)}
                        /> */}
                        {index < product.productSize.length - 1 && (
                          <div className="col-span-2 border-t border-gray-200 my-2"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {product?.ScrewOption && (
                <div className="bg-white rounded-xl shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Screw Options</h2>
                  <div className="space-y-6">
                    {product.ScrewOption.map((option, index) => (
                      <div key={option.id}>
                        {index > 0 && (
                          <div className="border-t border-gray-200 my-4"></div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 text-sm text-gray-800">
                          {screwOptionInfo(option).map((item, idx) => (
                            <Info
                              key={idx}
                              label={item.label}
                              value={item.value}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {product.MakingChargeWeightRange && (
                <div className="bg-white rounded-xl shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Making Charge</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 text-sm text-gray-800">
                    {makingChargeInfo.map((item, idx) => (
                      <Info key={idx} label={item.label} value={item.value} />
                    ))}
                  </div>
                </div>
              )}

              {product.GlobalDiscount && (
                <div className="bg-white rounded-xl shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Global Discount
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 text-sm text-gray-800">
                    {globalDiscountInfo.map((item, idx) => (
                      <Info key={idx} label={item.label} value={item.value} />
                    ))}
                  </div>
                </div>
              )}

              {product.Karigar && (
                <div className="bg-white rounded-xl shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Karigar</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 text-sm text-gray-800">
                    {karigarInfo.map((item, idx) => (
                      <Info key={idx} label={item.label} value={item.value} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <Button
          className={"mt-6 text-sm px-12 py-2.5"}
          variant="edit"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </div>
    </div>
  );
}
