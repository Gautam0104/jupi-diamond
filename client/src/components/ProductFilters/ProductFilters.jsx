import React from "react";

import { Filter, X } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
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

// Add this at the top of your ProductFilters component file
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

const ProductFilters = ({
  filters,
  handleFilterChangeHook,
  onApplyFilters,
  metalVariant,
  gemstoneVariant,
  makingCharge,
}) => {
  
  const [open, setOpen] = React.useState(false);
  const [localFilters, setLocalFilters] = React.useState(filters);
  const [sliderValues, setSliderValues] = React.useState([0, 500]); // Default range

  // Sync local filters when props change
  React.useEffect(() => {
    setLocalFilters(filters);
    // Initialize slider values from filters if they exist
    if (filters.minWeight || filters.maxWeight) {
      setSliderValues([
        Number(filters.minWeight) || 0,
        Number(filters.maxWeight) || 500,
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

  const handleSliderChange = (values) => {
    setSliderValues(values);
    setLocalFilters((prev) => ({
      ...prev,
      minWeight: values[0].toString(),
      maxWeight: values[1].toString(),
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
      minWeight: "",
      maxWeight: "",
      chargeType: "",
      chargeCategory: "",
      metalVariantId: "",
      gemstoneVariantId: "",
      makingChargeCategorySetId: "",
    };
    setLocalFilters(resetFilters);
    setSliderValues([0, 500]);
    Object.entries(resetFilters).forEach(([name, value]) => {
      handleFilterChangeHook({ target: { name, value } });
    });
    setOpen(false);
  };

  const chargeTypeOptions = [
    { value: "FIXED", label: "Fixed" },
    { value: "PERCENTAGE", label: "Percentage" },
    { value: "PER_GRAM_WEIGHT", label: "Per Gram Weight" },
  ];

  const chargeCategoryOptions = [
    { value: "METAL", label: "Metal" },
    { value: "GEMSTONE", label: "Gemstone" },
    { value: "COMBINED", label: "Combined" },
  ];

  const makingChargeCategoryOptions = [
    { value: "basic", label: "Basic" },
    { value: "premium", label: "Premium" },
    { value: "luxury", label: "Luxury" },
  ];

  const hasActiveFilters = Object.values(filters).some(
    (filter) => filter && filter !== ""
  );

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
          className="fixed inset-0 bg-black/20  z-50  transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
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

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
           

            <div className="space-y-2">
              <Label>Charge Type</Label>
              <Select
                value={localFilters.chargeType || ""}
                onValueChange={(value) =>
                  handleFilterChange("chargeType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select charge type" />
                </SelectTrigger>
                <SelectContent>
                  {chargeTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Charge Category</Label>
              <Select
                value={localFilters.chargeCategory || ""}
                onValueChange={(value) =>
                  handleFilterChange("chargeCategory", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select charge category" />
                </SelectTrigger>
                <SelectContent>
                  {chargeCategoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
                  {metalVariant.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.metalType?.name} - {option.purityLabel} 
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
                  {gemstoneVariant.map((option, index) => (
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
                value={localFilters.makingChargeCategorySetId || ""}
                onValueChange={(value) =>
                  handleFilterChange("makingChargeCategorySetId", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select making charge category" />
                </SelectTrigger>
                <SelectContent>
                  {makingCharge.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

             <div className="space-y-4">
              <Label>Weight Range</Label>
              <div className="relative">
                <Slider
                  value={sliderValues}
                  onValueChange={handleSliderChange}
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
                        {sliderValues[0]}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Minimum weight</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-sm text-muted-foreground">
                        {sliderValues[1]}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Maximum weight</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
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

export default ProductFilters;
