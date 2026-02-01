import { useCallback, useRef, useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { FiImage, FiSearch, FiTrash2, FiX } from "react-icons/fi";
import { Switch } from "../../../components/ui/switch";
import {
  bulkUploadProductsFromExcel,
  deleteProductVariant,
  getProductVariant,
  toggleProductVariantStatus,
  updateDailyWearStatus,
} from "../../../api/Admin/ProductApi";
import { useEffect } from "react";
import DataLoading from "../../../components/Loaders/DataLoading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import {
  BsCheckCircleFill,
  BsDownload,
  BsFillCloudArrowUpFill,
  BsUpload,
} from "react-icons/bs";
import { toast } from "sonner";
import PaginationComponent from "../../../components/PaginationComponent/PaginationComponent";
import useFiltration from "../../../Hooks/useFilteration";
import ProductVariantFilters from "../../../components/ProductVariantFilters/ProductVariantFilters";
import ProductImageCell from "../../../components/ProductImageCell/ProductImageCell";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { set } from "date-fns";
import { getGlobalDiscounts } from "../../../api/Admin/GlobalDiscount";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  applyDiscountToMultiple,
  removeDiscountHandler,
} from "../../../api/Admin/DiscountApi";
import { Checkbox } from "../../../components/ui/checkbox";
import EditableStockCell from "./EditableStockCell";

const AllProducts = () => {
  const {
    clearFilters,
    filters,
    handleFilterChangeHook,
    handlePaginationChange,
    debouncedSearch,
  } = useFiltration();

  const [activeTab, setActiveTab] = useState(filters.gridView ? 1 : 0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [product, setProduct] = useState([]);
  const [globalDiscount, setGlobalDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef();
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [discountToApply, setDiscountToApply] = useState("");
  const [pagination, setPagination] = useState({});

  const currentPage = pagination.page;
  const navigate = useNavigate();

  const handleFileClick = () => {
    fileInputRef.current.click();
  };
  useEffect(() => {
    setActiveTab(filters.gridView ? 1 : 0);
  }, [filters.gridView]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
      ];

      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a valid Excel file (.xls, .xlsx, .csv)");
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleBulkUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }
    setIsUploading(true);

    try {
      const response = await bulkUploadProductsFromExcel(selectedFile);
      console.log("Bulk Upload Response:", response);
      
      if (response.data.success) {
        toast.success(
          response.data.message || "Products uploaded successfully!"
        );
        fetchProductData();
        setSelectedFile(null);
        setIsDialogOpen(false);
      } else {
        toast.error(response.data.message || "Upload failed");
      }
    } catch (error) {
      console.log("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload products");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSingleSelect = (variantId) => {
    setSelectedVariants((prev) =>
      prev.includes(variantId)
        ? prev.filter((id) => id !== variantId)
        : [...prev, variantId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedVariants([]);
    } else {
      setSelectedVariants(product.map((item) => item.id));
    }
    setSelectAll(!selectAll);
  };

  const applyDiscount = async () => {
    if (!discountToApply || selectedVariants.length === 0) {
      toast.error("Please select a discount and at least one variant");
      return;
    }

    try {
      const response = await applyDiscountToMultiple(discountToApply, {
        variantIds: selectedVariants,
      });

      if (response.data.success) {
        toast.success("Discount applied successfully");
        fetchProductData();
        setSelectedVariants([]);
        setSelectAll(false);
      } else {
        toast.error(response.data.message || "Failed to apply discount");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply discount");
    }
  };

  const removeDiscount = async () => {
    if (selectedVariants.length === 0) {
      toast.error("Please select at least one variant");
      return;
    }

    try {
      const response = await removeDiscountHandler({
        variantIds: selectedVariants,
      });

      if (response.data.success) {
        toast.success("Discount removed successfully");
        fetchProductData();
        setSelectedVariants([]);
        setSelectAll(false);
      } else {
        toast.error(response.data.message || "Failed to remove discount");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove discount");
    }
  };

  const fetchProductData = async (page = filters.page) => {
    setLoading(true);
    try {
      const response = await getProductVariant({
        page: filters.page,
        search: debouncedSearch,
        ...filters,
      });
      // console.log("Product Data Response:", response.data);
      const discount = await getGlobalDiscounts();
      setGlobalDiscounts(discount.data.data.discounts);

      setProduct(response.data.data.productVariant);
      setPagination(response.data.data.pagination);
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [
    debouncedSearch,
    filters.minWeight,
    filters.page,
    filters.maxWeight,
    filters.metalVariantId,
    filters.gemstoneVariantId,
    filters.sortBy,
    filters.gridView,
    filters.sortOrder,
    filters.isActive,
    filters.isFeatured,
    filters.isGift,
    filters.isNewArrival,
    filters.minPrice,
    filters.maxPrice,
    filters.occasionId,
    filters.productStyleId,
    filters.collectionId,
    filters.jewelryTypeId,
    filters.startDate,
    filters.endDate,
    filters.globalDiscountId,
    filters.globalMakingChargesId,
    filters.karigarId,
    filters.productSizeId,
    filters.makingChargeWeightRangeId,
    filters.makingChargeCategorySetId,
  ]);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const handleDeleteClick = (id) => {
    setProductToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      await handleDeleteProductVariant(productToDelete);
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
    }
  };

  const handleDeleteProductVariant = async (id) => {
    try {
      const response = await deleteProductVariant(id);
      if (response.data.success) {
        toast.success("Product deleted successfully");
        fetchProductData(currentPage);
      } else {
        toast.error(response.data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/admin/product/product-details/${productId}`);
  };

  const handlePageChange = (page) => {
    handlePaginationChange(page, filters.pageSize);
  };

  const refreshProductData = () => {
    fetchProductData(currentPage);
  };

  const handleToggleStatus = async (id, statusType, currentValue) => {
    // Optimistically update the UI
    setProduct((prevProducts) =>
      prevProducts.map((item) =>
        item.id === id ? { ...item, [statusType]: !item[statusType] } : item
      )
    );

    try {
      const response = await toggleProductVariantStatus(id, statusType);
      if (!response.data.success) {
        setProduct((prevProducts) =>
          prevProducts.map((item) =>
            item.id === id ? { ...item, [statusType]: !item[statusType] } : item
          )
        );
        toast.error(response.data.message || `Failed to update ${statusType}`);
      } else {
        toast.success(`Product variant ${statusType} updated successfully`);
      }
    } catch (error) {
      console.error(`Toggle ${statusType} error:`, error);
      setProduct((prevProducts) =>
        prevProducts.map((item) =>
          item.id === id ? { ...item, [statusType]: !item[statusType] } : item
        )
      );
      toast.error(
        error.response?.data?.message || `Failed to update ${statusType}`
      );
    }
  };

  const handleDailyWearChange = async (id, dailyWear) => {
    try {
      const response = await updateDailyWearStatus(id, dailyWear);
      console.log("Daily wear update response:", response);

      if (response.status === 200) {
        toast.success("Daily wear type updated successfully");
        // Update the local state to reflect the change
        setProduct((prevProducts) =>
          prevProducts.map((item) =>
            item.id === id ? { ...item, dailyWear } : item
          )
        );
      } else {
        toast.error(
          response.data.message || "Failed to update daily wear type"
        );
      }
    } catch (error) {
      console.error("Daily wear update error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update daily wear type"
      );
    }
  };

  const handleStockUpdate = (variantId, newStock) => {
    setProduct((prevProducts) =>
      prevProducts.map((item) =>
        item.id === variantId ? { ...item, stock: newStock } : item
      )
    );
  };

  return (
    <div className=" w-full ">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-4">Products</h2>
        <p className="text-md font-semibold mb-2">All Products</p>

        {/* View Toggle Buttons */}
        <div className="flex flex-row items-center justify-between gap-4 overflow-y-auto scrollbarWidthNone">
          <div>
            <nav className="flex gap-x-1">
              <button
                className={`py-2 px-1 tracking-wide cp inline-flex items-center gap-x-2 border-b-2 text-sm whitespace-nowrap hover:text-black focus:outline-none focus:text-black ${
                  activeTab === 0
                    ? "font-semibold border-black text-black"
                    : "border-transparent text-gray-500"
                }`}
                onClick={() => {
                  setActiveTab(0);
                  handleFilterChangeHook({
                    target: { name: "gridView", value: false },
                  });
                }}
                aria-selected={activeTab === 0}
              >
                Table View
              </button>
              <button
                className={`py-2 px-1 tracking-wide cp inline-flex items-center gap-x-2 ml-5 border-b-2 text-sm whitespace-nowrap hover:text-black focus:outline-none focus:text-black ${
                  activeTab === 1
                    ? "font-semibold border-black text-black"
                    : "border-transparent text-gray-500"
                }`}
                onClick={() => {
                  setActiveTab(1);
                  handleFilterChangeHook({
                    target: { name: "gridView", value: true },
                  });
                }}
                aria-selected={activeTab === 1}
              >
                Grid View
              </button>
            </nav>
          </div>

          {/* Action Buttons - Right Side */}
          <div className="flex flex-row items-center gap-2 w-full md:w-auto">
            {/* Selection Controls (only visible in table view when items are selected) */}
            {!filters.gridView && selectedVariants.length > 0 ? (
              <div className="flex items-center gap-2 mr-4">
                <span className="text-sm font-medium whitespace-nowrap">
                  {selectedVariants.length} selected
                </span>

                <Select
                  value={discountToApply}
                  onValueChange={setDiscountToApply}
                >
                  <SelectTrigger className="w-[190px] text-xs">
                    <SelectValue placeholder="Select discount" />
                  </SelectTrigger>
                  <SelectContent>
                    {globalDiscount.map((item) => (
                      <SelectItem
                        key={item.id}
                        value={item.id}
                        className={"text-xs"}
                      >
                        {item.title} ({item.discountType === "FIXED" ? "₹" : ""}
                        {item.discountValue}
                        {item.discountType === "PERCENTAGE" ? "%" : ""})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="edit"
                  size="sm"
                  onClick={applyDiscount}
                  disabled={!discountToApply}
                  className="whitespace-nowrap rounded-full text-xs px-4 py-2"
                >
                  Apply
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={removeDiscount}
                  className="whitespace-nowrap rounded-full text-xs px-4 py-2"
                >
                  Remove
                </Button>

                <Button
                  variant="edit"
                  size="sm"
                  onClick={() => {
                    setSelectedVariants([]);
                    setSelectAll(false);
                  }}
                  className="whitespace-nowrap rounded-full text-xs px-4 py-2"
                >
                  Clear
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* Regular Action Buttons */}
                <Link
                  to="/admin/product/add-product"
                  title="Add Product"
                  aria-label="Add Product"
                >
                  <Button variant="edit" className="text-xs rounded-full px-8">
                    Add Product
                  </Button>
                </Link>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="edit"
                      className="rounded-full px-6 py-2 bg-Lime text-black font-medium"
                    >
                      <BsFillCloudArrowUpFill className="mr-2 h-4 w-4" />
                      Bulk Upload
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] p-5 bg-white rounded-lg shadow-lg">
                    <DialogContent className="sm:max-w-[500px] p-5 bg-white rounded-lg shadow-lg">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-gray-900">
                          Bulk Product Upload
                        </DialogTitle>
                        <DialogDescription className="text-gray-500 text-sm">
                          Upload an Excel file with product data. Use our
                          template for proper formatting.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-4 py-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-md">
                          <BsDownload className="h-4 w-4 text-black" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Template File
                            </p>
                            <a
                              href="/admin/NewDemo_bulk_products.xlsx"
                              download="BulkProduct_Test_Template.xlsx"
                              className="text-lime-600 hover:text-lime-800 text-xs underline"
                            >
                              Download Bulk_Product_Test_Template.xlsx
                            </a>
                          </div>
                        </div>

                        <div
                          onClick={handleFileClick}
                          className={`border-2 border-dashed rounded-md flex flex-col items-center justify-center w-full h-48 transition-all duration-200 ${
                            selectedFile
                              ? "border-lime-500 bg-lime-50"
                              : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                          } cursor-pointer`}
                        >
                          {selectedFile ? (
                            <div className="text-center p-4">
                              <BsCheckCircleFill className="h-8 w-8 text-lime-500 mx-auto mb-3" />
                              <p className="text-sm font-medium text-gray-900">
                                {selectedFile.name}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
                                MB
                              </p>
                              <Button
                                variant="ghost"
                                className="mt-2 text-xs text-lime-600 hover:text-lime-800"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedFile(null);
                                  fileInputRef.current.value = null;
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          ) : (
                            <div className="text-center p-4">
                              <BsFillCloudArrowUpFill className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                              <p className="text-sm font-medium text-gray-900">
                                Click to upload file
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Supports .xls, .xlsx, .csv
                              </p>
                            </div>
                          )}
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={handleFileChange}
                            accept=".xls,.xlsx,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                          />
                        </div>

                        <div className="text-xs text-gray-500">
                          <p className="font-medium">Requirements:</p>
                          <ul className="list-disc pl-4 mt-1 space-y-0.5">
                            <li>Match template column structure</li>
                            <li>Max file size: 5MB</li>
                            <li>Formats: .xls, .xlsx, .csv</li>
                          </ul>
                        </div>
                      </div>

                      <DialogFooter className="flex justify-end gap-3">
                        <Button
                          variant="outline"
                          className="text-xs border-gray-300"
                          onClick={() => {
                            setSelectedFile(null);
                            setIsDialogOpen(false);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          className="bg-black  text-white text-xs"
                          onClick={handleBulkUpload}
                          disabled={!selectedFile || isUploading}
                        >
                          {isUploading ? (
                            <span className="flex items-center gap-2">
                              Uploading...
                            </span>
                          ) : (
                            <>
                              <BsUpload className="mr-2 h-4 w-4" />
                              Upload
                            </>
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            <div className="flex items-center gap-2 w-full max-w-md">
              <div className="relative flex items-center w-[300px] sm:w-full max-w-md mx-auto">
                <div className="absolute left-3 text-gray-400">
                  <FiSearch className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChangeHook}
                  placeholder="Search..."
                  className="w-full py-2 pl-10 text-sm pr-10 text-gray-700 bg-white shadow-md rounded-full focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500"
                />
                {filters.search && (
                  <button
                    onClick={clearFilters}
                    className="absolute right-3 text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                )}
              </div>

              <ProductVariantFilters
                filters={filters}
                handleFilterChangeHook={handleFilterChangeHook}
                clearFilters={clearFilters}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border ">
        <div
          className={`${filters.gridView ? "" : "hidden"} grid   gap-4`}
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          }}
        >
          {loading ? (
            <div className="col-span-full flex justify-center items-center h-64">
              <DataLoading />
            </div>
          ) : product?.length > 0 ? (
            product.map((item) => (
              <div
                key={item.id}
                className="bg-white hover:shadow-md transition duration-200 overflow-hidden relative"
              >
                <div className="h-72 sm:h-56 w-full overflow-hidden flex items-center justify-center aspect-square">
                  {item.productVariantImage.length > 0 ? (
                    <Swiper
                      loop={true}
                      autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                      }}
                      pagination={{
                        clickable: true,
                      }}
                      modules={[Pagination, Autoplay]}
                      className="h-full w-full aspect-square"
                    >
                      {item.productVariantImage.map((media, index) => (
                        <SwiperSlide key={index}>
                          {media.imageUrl.endsWith(".mp4") ? (
                            <video
                              src={media.imageUrl}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="w-full h-full object-fit"
                              alt={`${item.products?.name} - Video ${
                                index + 1
                              }`}
                            />
                          ) : (
                            <img
                              src={media.imageUrl}
                              alt={`${item.products?.name} - ${index + 1}`}
                              className="w-full h-full object-fit"
                            />
                          )}
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    <div className="h-full w-full bg-gray-100 flex flex-col items-center justify-center">
                      <FiImage className="h-6 w-6 text-gray-400" />
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                </div>

                <div className="px-4 py-2 flex flex-col flex-grow ">
                  <Link
                    to={`/admin/product/product-details/${item?.id}`}
                    className="block flex-grow"
                  >
                    <div className="mb-3 h-16 ">
                      <h3 className="text-base font-semibold text-gray-900 line-clamp-2 hover:text-primary-600 transition-colors">
                        {item.products?.name}
                      </h3>
                      {item.gemstoneVariant?.clarity && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                          {item.gemstoneVariant?.clarity}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm mb-2">
                      <div className="">
                        <span className="text-gray-500 block text-xs">
                          Purity
                        </span>
                        <span className="font-medium text-xs text-gray-700">
                          {item.metalVariant?.metalType?.name}{" "}
                          {item.metalVariant?.purityLabel}
                          {item.metalColor?.name &&
                            `- ${item.metalColor?.name}`}
                        </span>
                      </div>

                      <div className="">
                        <span className="text-gray-500 block text-xs">
                          Clarity
                        </span>
                        <span className="font-medium text-xs text-gray-700">
                          {item.gemstoneVariant?.gemstoneType?.name || "N/A"}
                        </span>
                      </div>

                      <div className="">
                        <span className="text-gray-500 block text-xs">
                          Size
                        </span>
                        <span className="font-medium text-xs text-gray-700">
                          {item.productSize && item.productSize.length > 0
                            ? item.productSize
                                .map((size) => `${size.label} ${size.unit}`)
                                .join(", ")
                            : "N/A"}
                        </span>
                      </div>

                      <div className="">
                        <span className="text-gray-500 block text-xs">
                          Stock
                        </span>
                        <span
                          className={`font-medium text-xs ${
                            item.stock > 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {item.stock}{" "}
                          {item.stock > 0 ? "Available" : "Out of stock"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto pt-2 border-t border-gray-100 flex items-baseline justify-between">
                      <div className="flex items-baseline">
                        <span className="text-lg font-bold text-gray-900">
                          ₹{item.finalPrice?.toLocaleString()}
                        </span>
                      </div>
                      <div
                        className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                          item.isActive
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex justify-center items-center h-24">
              <span className="text-gray-500">No Data Available</span>
            </div>
          )}
        </div>

        <div className={`${filters.gridView ? "hidden" : ""} relative mb-4  `}>
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                {[
                  "Image",
                  "Product Name",
                  "Jewellery Type",
                  "Stock",
                  "Metal ",
                  "Gemstone ",
                  "Daily Wear",
                  "Discount",
                  "Price",
                  "Created At",
                  "Status",
                  // "Featured",
                  "Gift",
                  // "On Sale",
                  "Actions",
                ].map((header) => (
                  <TableHead
                    key={header}
                    className="whitespace-nowrap text-center"
                  >
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={13} className="h-20 text-center">
                    <DataLoading />
                  </TableCell>
                </TableRow>
              ) : product?.length > 0 ? (
                product.map((item) => (
                  <TableRow key={item.id} className="text-center">
                    <TableCell>
                      <Checkbox
                        checked={selectedVariants.includes(item.id)}
                        onCheckedChange={() => handleSingleSelect(item.id)}
                      />
                    </TableCell>
                    <ProductImageCell
                      item={item}
                      refreshData={refreshProductData}
                    />
                    <TableCell className="min-w-[200px] text-left px-4">
                      <div
                        onClick={() => handleProductClick(item.id)}
                        className="text-lime-600 cp hover:text-lime-800 hover:underline font-medium"
                      >
                        {item.products?.name} - {item.gemstoneVariant?.clarity}
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[40px]">
                      {item.products?.jewelryType?.name}
                    </TableCell>
                    <TableCell className="min-w-[80px]">
                     <div className="flex items-center justify-center">
                       <EditableStockCell
                        variant={item}
                        onStockUpdate={handleStockUpdate}
                      />
                     </div>
                    </TableCell>{" "}
                    <TableCell className="min-w-[160px]">
                      {item.metalVariant?.metalType?.name} -{" "}
                      {item.metalVariant?.purityLabel} - {item.metalColor?.name}
                    </TableCell>
                    <TableCell className="min-w-[160px]">
                      {item.gemstoneVariant?.gemstoneType?.name} -{" "}
                      {item.gemstoneVariant?.clarity}
                    </TableCell>
                    <TableCell className="min-w-[120px]">
                      <Select
                        value={item.dailyWear || ""}
                        onValueChange={(value) =>
                          handleDailyWearChange(item.id, value)
                        }
                      >
                        <SelectTrigger className="w-[150px] text-xs">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="WORK_WEAR">Work Wear</SelectItem>
                          <SelectItem value="EVERYDAY_WEAR">
                            Everyday Wear
                          </SelectItem>
                          <SelectItem value="PARTY_WEAR">Party Wear</SelectItem>
                          <SelectItem value="STATEMENT_WEAR">
                            Statement Wear
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="min-w-[140px]">
                      {item.GlobalDiscount?.title} -
                      {item.GlobalDiscount?.discountType === "FIXED" ? "₹" : ""}{" "}
                      {item.GlobalDiscount?.discountValue}{" "}
                      {item.GlobalDiscount?.discountType === "PERCENTAGE"
                        ? "%"
                        : ""}
                    </TableCell>
                    <TableCell className="min-w-[120px]">
                      ₹ {item.finalPrice}
                    </TableCell>
                    {/* <TableCell className="min-w-[120px]">
                      {item.MakingChargeWeightRange?.discountType === "FIXED"
                        ? "₹ "
                        : ""}
                      {item.MakingChargeWeightRange?.discountValue}
                      {item.MakingChargeWeightRange?.discountType ===
                      "PERCENTAGE"
                        ? "%"
                        : ""}
                    </TableCell> */}
                    <TableCell className="min-w-[140px] truncate">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="min-w-[120px]">
                      <Switch
                        checked={item.isActive}
                        onCheckedChange={() =>
                          handleToggleStatus(item.id, "isActive", item.isActive)
                        }
                      />
                    </TableCell>
                    {/* <TableCell className="min-w-[120px]">
                      <Switch
                        checked={item.isFeatured}
                        onCheckedChange={() =>
                          handleToggleStatus(
                            item.id,
                            "isFeatured",
                            item.isFeatured
                          )
                        }
                      />
                    </TableCell> */}
                    <TableCell className="min-w-[120px]">
                      <Switch
                        checked={item.isGift}
                        onCheckedChange={() =>
                          handleToggleStatus(item.id, "isGift", item.isGift)
                        }
                      />
                    </TableCell>
                    {/* <TableCell className="min-w-[120px]">
                      <Switch
                        checked={item.isNewArrival}
                        onCheckedChange={() =>
                          handleToggleStatus(
                            item.id,
                            "isNewArrival",
                            item.isNewArrival
                          )
                        }
                      />
                    </TableCell> */}
                    <TableCell className="min-w-[120px] text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/admin/product/edit-product/${item.products?.id}`}
                        >
                          <Button
                            variant="edit"
                            size="sm"
                            className="text-[10px] md:text-sm px-6"
                          >
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="edit"
                          size="sm"
                          className="text-[10px] md:text-sm px-2 rounded-sm hover:shadow-xl"
                          onClick={() => handleDeleteClick(item.id)}
                        >
                          <FiTrash2 />
                        </Button>
                      </div>
                      <Dialog
                        open={deleteConfirmOpen}
                        onOpenChange={setDeleteConfirmOpen}
                      >
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this product ?
                              This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setDeleteConfirmOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={confirmDelete}
                            >
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={13} className="h-24 text-center">
                    <div className="flex justify-center items-center">
                      <span className="text-gray-500">No Data Available</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="p-2 md:p-4 border-t">
          <PaginationComponent
            currentPage={Number(pagination.currentPage || filters.page)}
            totalPages={Number(pagination.totalPages)}
            onPageChange={handlePageChange}
            pageSize={Number(filters.pageSize)}
          />
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
