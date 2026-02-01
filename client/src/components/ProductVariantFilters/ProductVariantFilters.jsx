import React from "react";
import { Filter, X } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Slider } from "../ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Switch } from "../ui/switch";
import { getMetalVariant } from "../../api/Admin/MetalApi";
import { getGemstoneVariant } from "../../api/Admin/GemstoneApi";
import {
  fetchGlobalMakingCharges,
  fetchMakingWeightByCategoryId,
} from "../../api/Admin/MakingChargeApi";
import { getJewelleryType } from "../../api/Admin/JewelleryApi";
import { getGlobalDiscounts } from "../../api/Admin/GlobalDiscount";
import { getOccassion } from "../../api/Admin/OccationAPi";
import {
  getKarigarDetails,
  getProductSize,
  getProductStyle,
} from "../../api/Admin/ProductApi";
import { getCollection } from "../../api/Admin/CollectionApi";
import { Skeleton } from "../ui/skeleton";

const disableBodyScroll = (disable) => {
  if (disable) {
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${
      window.innerWidth - document.documentElement.clientWidth
    }px`;
  } else {
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  }
};

const ProductVariantFilters = ({
  filters,
  handleFilterChangeHook,
  onApplyFilters,
  clearFilters,
}) => {
  const [open, setOpen] = React.useState(false);
  const [localFilters, setLocalFilters] = React.useState(filters);
  const [weightSliderValues, setWeightSliderValues] = React.useState([0, 500]);
  const [priceSliderValues, setPriceSliderValues] = React.useState([0, 100000]);
  const [loading, setLoading] = React.useState(false);

  const [filterOptions, setFilterOptions] = React.useState({
    metalVariant: [],
    gemstoneVariant: [],
    makingCharge: [],
    jewelleryType: [],
    productSize: [],
    globalDiscounts: [],
    occasion: [],
    productStyle: [],
    collection: [],
    makingChargeWeightRangeOptions: [],
    globalMakingChargesOptions: [],
    karigarOptions: [],
  });

  React.useEffect(() => {
    const fetchAllFilterOptions = async () => {
      setLoading(true);
      try {
        const [
          metalVariantRes,
          gemstoneVariantRes,
          makingChargeRes,
          jewelleryTypeRes,
          productSizeRes,
          globalDiscountsRes,
          occasionRes,
          productStyleRes,
          collectionRes,
          karigarDetailsRes,
        ] = await Promise.all([
          getMetalVariant(),
          getGemstoneVariant(),
          fetchGlobalMakingCharges(),
          getJewelleryType(),
          getProductSize(),
          getGlobalDiscounts(),
          getOccassion(),
          getProductStyle(),
          getCollection(),
          getKarigarDetails(),
        ]);

        setFilterOptions({
          metalVariant: metalVariantRes.data?.data?.metalVariant || [],
          gemstoneVariant: gemstoneVariantRes.data?.data?.gemstoneVariant || [],
          makingCharge: makingChargeRes.data?.data || [],
          jewelleryType: jewelleryTypeRes.data?.data.jewelryType || [],
          productSize: productSizeRes.data?.data?.result || [],
          globalDiscounts: globalDiscountsRes.data?.data.discounts || [],
          occasion: occasionRes.data?.data.result || [],
          productStyle: productStyleRes.data?.data.result || [],
          collection: collectionRes.data?.data?.collection || [],
          karigarOptions: karigarDetailsRes.data.data || [],
          // These would need their own API calls if available
          makingChargeWeightRangeOptions: [],
          globalMakingChargesOptions: [],
        });
      } catch (error) {
        console.log("Error fetching filter options:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllFilterOptions();
  }, []);

  React.useEffect(() => {
    setLocalFilters(filters);
    if (filters.minWeight || filters.maxWeight) {
      setWeightSliderValues([
        Number(filters.minWeight) || 0,
        Number(filters.maxWeight) || 500,
      ]);
    }
    if (filters.minPrice || filters.maxPrice) {
      setPriceSliderValues([
        Number(filters.minPrice) || 0,
        Number(filters.maxPrice) || 100000,
      ]);
    }
  }, [filters]);

  React.useEffect(() => {
    disableBodyScroll(open);
    return () => disableBodyScroll(false);
  }, [open]);

  const handleFilterChange = (name, value) => {
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleWeightSliderChange = (values) => {
    setWeightSliderValues(values);
    setLocalFilters((prev) => ({
      ...prev,
      minWeight: values[0].toString(),
      maxWeight: values[1].toString(),
    }));
  };

  const handlePriceSliderChange = (values) => {
    setPriceSliderValues(values);
    setLocalFilters((prev) => ({
      ...prev,
      minPrice: values[0].toString(),
      maxPrice: values[1].toString(),
    }));
  };

  const handleApplyFilters = () => {
    Object.entries(localFilters).forEach(([key, value]) => {
      handleFilterChangeHook({ target: { name: key, value: value || "" } });
    });
    setOpen(false);
    if (onApplyFilters) onApplyFilters();
  };

  const handleResetFilters = () => {
    const resetFilters = {
      metalVariantId: "",
      gemstoneVariantId: "",
      minWeight: "",
      maxWeight: "",
      minPrice: "",
      maxPrice: "",
      isActive: "",
      isFeatured: "",
      isNewArrival: "",
      productSizeId: "",
      globalDiscountId: "",
      makingChargeWeightRangeId: "",
      makingChargeCategorySetId: "",
      globalMakingChargesId: "",
      karigarId: "",
      sortBy: "",
      gridView: "",
      sortOrder: "",
      occasionId: "",
      productStyleId: "",
      collectionId: "",
      startDate: "",
      endDate: "",
      jewelryTypeId: "",
    };
    clearFilters();
    setLocalFilters(resetFilters);
    setWeightSliderValues([0, 500]);
    setPriceSliderValues([0, 100000]);
    Object.entries(resetFilters).forEach(([name, value]) => {
      handleFilterChangeHook({ target: { name, value } });
    });
    setOpen(false);
  };

  const sortOptions = [
    { value: "createdAt", label: "Creation Date" },
    { value: "updatedAt", label: "Updated Date" },
  ];

  const gridOptions = [
    { value: "true", label: "True" },
    { value: "false", label: "False" },
  ];

  const sortOrderOptions = [
    { value: "asc", label: "Ascending" },
    { value: "desc", label: "Descending" },
  ];

  const hasActiveFilters = Object.values(filters).some(
    (filter) =>
      filter && filter !== "" && filter !== "createdAt" && filter !== "desc"
  );

  const handleMakingChargeCategoryChange = async (categoryId) => {
    handleFilterChange("makingChargeCategorySetId", categoryId || "");

    if (categoryId) {
      try {
        const response = await fetchMakingWeightByCategoryId(categoryId);
        
        setFilterOptions((prev) => ({
          ...prev,
          makingChargeWeightRangeOptions: response.data?.data || [],
        }));
      } catch (error) {
        console.log("Error fetching making charge weight ranges:", error);
        setFilterOptions((prev) => ({
          ...prev,
          makingChargeWeightRangeOptions: [],
        }));
      }
    } else {
      setFilterOptions((prev) => ({
        ...prev,
        makingChargeWeightRangeOptions: [],
      }));
    }
  };

  if (loading) {
    return (
      <div>
        <Skeleton className="relative h-10 rounded-full">
          <div className="flex items-center px-4 py-2 opacity-0">
            <div className="mr-2 h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <div className="ml-2 flex h-5 w-5 items-center justify-center rounded-full p-0">
                !
              </div>
            )}
          </div>
        </Skeleton>
      </div>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="relative rounded-full"
      >
        <Filter className="mr-2 h-4 w-4" />
        Filters
        {hasActiveFilters && (
          <Badge
            variant="default"
            className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
          >
            !
          </Badge>
        )}
      </Button>

      {open && (
        <div
          className="fixed inset-0 bg-black/20 z-50 transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[350px] bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full flex flex-col px-2">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Basic Filters */}
            <div className="space-y-4">
              <h3 className="font-medium">Basic Filters</h3>

              <div className="space-y-2">
                <Label>Metal Variant</Label>
                <Select
                  value={localFilters.metalVariantId || ""}
                  onValueChange={(value) =>
                    handleFilterChange("metalVariantId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select metal variant" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.metalVariant.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.metalType?.name} - {option?.purityLabel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Gemstone Variant</Label>
                <Select
                  value={localFilters.gemstoneVariantId || ""}
                  onValueChange={(value) =>
                    handleFilterChange("gemstoneVariantId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gemstone variant" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.gemstoneVariant.map((option, index) => (
                      <SelectItem key={index + 1} value={option.id}>
                        {option.gemstoneType?.name} - {option.clarity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Making Charge Category</Label>
                <Select
                  value={localFilters.makingChargeCategorySetId}
                  onValueChange={handleMakingChargeCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select making charge category" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.makingCharge.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Making Charge Weight Range</Label>
                <Select
                  value={localFilters.makingChargeWeightRangeId || ""}
                  onValueChange={(value) =>
                    handleFilterChange("makingChargeWeightRangeId", value)
                  }
                  disabled={!localFilters.makingChargeCategorySetId}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        localFilters.makingChargeCategorySetId
                          ? "Select weight range"
                          : "Select a category first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.makingChargeWeightRangeOptions.map(
                      (option) => (
                        <SelectItem key={option.id} value={option.id}>
                          Weight Min-{option.minWeight} - Weight Max-
                          {option.maxWeight}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Jewelry Type</Label>
                <Select
                  value={localFilters.jewelryTypeId || ""}
                  onValueChange={(value) =>
                    handleFilterChange("jewelryTypeId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select jewelry type" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.jewelleryType.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Range Filters */}
            <div className="space-y-4">
              <h3 className="font-medium">Range Filters</h3>

              <div className="space-y-2">
                <Label>Weight Range (grams)</Label>
                <div className="relative">
                  <Slider
                    value={weightSliderValues}
                    onValueChange={handleWeightSliderChange}
                    min={0}
                    max={500}
                    step={1}
                    minStepsBetweenThumbs={1}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-sm text-muted-foreground">
                          {weightSliderValues[0]}g
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Minimum weight</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-sm text-muted-foreground">
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

              <div className="space-y-2">
                <Label>Price Range</Label>
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
                        <span className="text-sm text-muted-foreground">
                          ₹{priceSliderValues[0]}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Minimum price</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-sm text-muted-foreground">
                          ₹{priceSliderValues[1]}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Maximum price</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Filters */}
            <div className="space-y-4">
              <h3 className="font-medium">Status Filters</h3>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={localFilters.isActive === "true"}
                  onCheckedChange={(checked) =>
                    handleFilterChange("isActive", checked.toString())
                  }
                />
                <Label htmlFor="isActive">Active Products</Label>
              </div>

              {/* <div className="flex items-center space-x-2">
                <Switch
                  id="isFeatured"
                  checked={localFilters.isFeatured === "true"}
                  onCheckedChange={(checked) =>
                    handleFilterChange("isFeatured", checked.toString())
                  }
                />
                <Label htmlFor="isFeatured">Featured Products</Label>
              </div> */}

              {/* <div className="flex items-center space-x-2">
                <Switch
                  id="isNewArrival"
                  checked={localFilters.isNewArrival === "true"}
                  onCheckedChange={(checked) =>
                    handleFilterChange("isNewArrival", checked.toString())
                  }
                />
                <Label htmlFor="isNewArrival">New Arrivals</Label>
              </div> */}
            </div>

            {/* Additional Filters */}
            <div className="space-y-4">
              <h3 className="font-medium">Additional Filters</h3>

              <div className="space-y-2">
                <Label>Karigar</Label>
                <Select
                  value={localFilters.karigarId || ""}
                  onValueChange={(value) =>
                    handleFilterChange("karigarId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select karigar" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.karigarOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Product Size</Label>
                <Select
                  value={localFilters.productSizeId || ""}
                  onValueChange={(value) =>
                    handleFilterChange("productSizeId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product size" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.productSize.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label || option.labelSize} - {option.unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Global Discount</Label>
                <Select
                  value={localFilters.globalDiscountId || ""}
                  onValueChange={(value) =>
                    handleFilterChange("globalDiscountId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select global discount" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.globalDiscounts.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Category Filters */}
            <div className="space-y-4">
              <h3 className="font-medium">Category Filters</h3>

              <div className="space-y-2">
                <Label>Occasion</Label>
                <Select
                  value={localFilters.occasionId || ""}
                  onValueChange={(value) =>
                    handleFilterChange("occasionId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select occasion" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.occasion.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Product Style</Label>
                <Select
                  value={localFilters.productStyleId || ""}
                  onValueChange={(value) =>
                    handleFilterChange("productStyleId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product style" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.productStyle.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Collection</Label>
                <Select
                  value={localFilters.collectionId || ""}
                  onValueChange={(value) =>
                    handleFilterChange("collectionId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select collection" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.collection.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name} - {option.gender}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Date Range</h3>

              <div className="space-y-2">
                <Label>Start Date</Label>
                <DatePicker
                  selected={
                    localFilters.startDate
                      ? new Date(localFilters.startDate)
                      : null
                  }
                  onChange={(date) =>
                    handleFilterChange("startDate", date?.toISOString() || "")
                  }
                  placeholderText="Select start date"
                  className=" border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive  flex w-[150%] items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                />
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <DatePicker
                  selected={
                    localFilters.endDate ? new Date(localFilters.endDate) : null
                  }
                  onChange={(date) =>
                    handleFilterChange("endDate", date?.toISOString() || "")
                  }
                  placeholderText="Select end date"
                  className="border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-[150%] items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                />
              </div>
            </div>

            {/* Sorting */}
            <div className="space-y-4">
              <h3 className="font-medium">Sorting</h3>

              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select
                  value={localFilters.sortBy}
                  onValueChange={(value) => handleFilterChange("sortBy", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sort field" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sort Order</Label>
                <Select
                  value={localFilters.sortOrder}
                  onValueChange={(value) =>
                    handleFilterChange("sortOrder", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sort order" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOrderOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t flex justify-end gap-2">
            <Button variant="outline" onClick={handleResetFilters}>
              Reset
            </Button>
            <Button onClick={handleApplyFilters}>Apply</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductVariantFilters;
