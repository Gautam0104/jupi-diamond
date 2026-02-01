import React, { useState } from "react";
import { FaFilter, FaChevronDown } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
  DrawerHeaderFilter,
} from "../../components/ui/drawer";

const MobileFilterDrawer = ({
  filters,
  handleFilterChangeHook,
  handleFilterMultipleChangeHook,
  sort,
  handleSortChange,
  filterValues,
  clearFilters,
  sideFilterData,
  handlePriceSliderChange,
  priceSliderValues,
  getCurrencySymbol,
  convertPrice,
  currency,
  activeFilterCount,
  isDrawerOpen,
  setIsDrawerOpen,
}) => {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const [isSortDrawerOpen, setIsSortDrawerOpen] = useState(false);
  const [isShowDrawerOpen, setIsShowDrawerOpen] = useState(false);

  
  const validSortFields = {
    "A-Z": { sortBy: "productVariantTitle", sortOrder: "asc" },
    "Z-A": { sortBy: "productVariantTitle", sortOrder: "desc" },
    "Low-High": { sortBy: "finalPrice", sortOrder: "asc" },
    "High-Low": { sortBy: "finalPrice", sortOrder: "desc" },
    Newest: { sortBy: "createdAt", sortOrder: "desc" },
    Oldest: { sortBy: "createdAt", sortOrder: "asc" },
  };

  const handleOptionSelect = (filterName, optionSlug) => {
    handleFilterMultipleChangeHook({
      target: {
        name: filterName,
        value: optionSlug,
        type: "checkbox",
        checked: !filterValues[filterName]?.includes(optionSlug),
      },
    });
  };

  const isOptionSelected = (filterName, optionSlug) => {
    return filterValues[filterName]?.includes(optionSlug);
  };

  // Add diamond color filter to the filters array
  const allFilters = [
    ...filters,
    {
      title: "gemstoneVariantSlug",
      displayTitle: "DIAMOND COLOR",
      options:
        sideFilterData.diamondColor?.map((color) => ({
          slug: color.gemstoneVariantSlug,
          label: color.color,
          count: color._count?.productVariant || 0,
        })) || [],
    },
  ];

  return (
    <>
      <div
        className={`fixed ${
          isDrawerOpen ? "block" : "hidden"
        } bottom-0 text-sm left-0 right-0 bg-[#C28F77] poppins text-white text-md font-medium py-4 px-6 flex justify-between items-center md:hidden z-40 transition-all duration-300 ease-in-out `}
      >
        <Drawer open={isShowDrawerOpen} onOpenChange={setIsShowDrawerOpen}>
          <DrawerTrigger asChild>
            <button className="flex items-center text-xs space-x-1">
              <span>({filterValues.limit || 12})</span>
              <span>Show</span>
              <FaChevronDown className="h-3 w-3 ml-1" />
            </button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[80vh] text-center">
            <DrawerHeaderFilter className="text-center">
              <DrawerTitle className={"text-md font-medium"}>
                Show Products
              </DrawerTitle>
            </DrawerHeaderFilter>
            <div className="px-2 py-4 space-y-2 poppins">
              {[12, 16, 32].map((value) => (
                <Button
                  key={value}
                  variant="ghost"
                  className={`w-full justify-center ${
                    filterValues.limit == value
                      ? "bg-brown rounded-none text-white"
                      : ""
                  }`}
                  onClick={() => {
                    handleFilterChangeHook({
                      target: {
                        name: "limit",
                        value: value.toString(),
                      },
                    });
                    setIsShowDrawerOpen(false);
                    // setIsDrawerOpen(false);
                  }}
                >
                  Show {value}
                </Button>
              ))}
            </div>
          </DrawerContent>
        </Drawer>

        <div className="h-8 w-[2px] bg-white opacity-50 mx-2" />

        {/* Sort Drawer Trigger */}
        <Drawer open={isSortDrawerOpen} onOpenChange={setIsSortDrawerOpen}>
          <DrawerTrigger asChild>
            <button className="flex items-center text-xs space-x-1">
              <span>({sort})</span>
              <span>Sort</span>
              <FaChevronDown className="h-3 w-3 ml-1" />
            </button>
          </DrawerTrigger>
          <DrawerContent className="max-h-[80vh]">
            <DrawerHeaderFilter className="text-center">
              <DrawerTitle className={"poppins text-md font-medium"}>
                Sort By
              </DrawerTitle>
            </DrawerHeaderFilter>
            <div className="px-2 py-4 space-y-2 poppins">
              {Object.keys(validSortFields).map((sortOption) => (
                <Button
                  key={sortOption}
                  variant="ghost"
                  className={`w-full justify-center  ${
                    sort === sortOption
                      ? "bg-brown rounded-none text-white"
                      : ""
                  }`}
                  onClick={() => {
                    handleSortChange(sortOption);
                    setIsSortDrawerOpen(false);
                    // setIsDrawerOpen(false);
                  }}
                >
                  {sortOption === "A-Z" && "Alphabetically, A-Z"}
                  {sortOption === "Z-A" && "Alphabetically, Z-A"}
                  {sortOption === "Low-High" && "Price: Low to High"}
                  {sortOption === "High-Low" && "Price: High to Low"}
                  {sortOption === "Newest" && "Newest"}
                  {sortOption === "Oldest" && "Oldest"}
                </Button>
              ))}
            </div>
          </DrawerContent>
        </Drawer>

        <div className="h-8 w-[2px] bg-white opacity-50 mx-2" />

        <button
          onClick={() => setIsFilterDrawerOpen(true)}
          className="flex items-center space-x-2 text-xs  tracking-wider "
        >
          <FaFilter className="h-4 w-4" />
          <span>Filter</span>
          
        </button>
      </div>

      {isFilterDrawerOpen && (
        <div className="fixed inset-0 text-xs bg-white z-50 flex flex-col h-full">
          <div className="flex items-center p-4 border-b gap-2">
            <button onClick={() => setIsFilterDrawerOpen(false)} className="">
              <RxCross2 className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-medium tracking-wider">Filters</h2>
          </div>

          <div className="flex flex-1 overflow-hidden">
            <div className="w-[35%] bg-[#D49A7B] text-white  ">
              {/* Render all filters first */}
              {allFilters.map((filter, idx) => (
                <div
                  key={idx}
                  className={`px-3 py-3 tracking-wide font-normal uppercase cursor-pointer border-b text-xs border-[#d28d6d] ${
                    selectedTab === idx ? "text-black font-semibold" : ""
                  }`}
                  onClick={() => setSelectedTab(idx)}
                >
                  {filter.displayTitle.replace("SHOP BY ", "")}
                </div>
              ))}

              {/* Add Price Range as the last tab */}
              <div
                className={`px-3 py-3 tracking-wide font-normal cursor-pointer border-b text-xs border-[#d28d6d] ${
                  selectedTab === allFilters.length
                    ? "text-black font-semibold"
                    : ""
                }`}
                onClick={() => setSelectedTab(allFilters.length)}
              >
                PRICE RANGE
              </div>
            </div>

            <div className="w-[65%] py-3 px-2 text-xs overflow-y-auto">
              {selectedTab === allFilters.length ? (
                // Price Range Slider
                <div className="px-4 py-6">
                  <Slider
                    value={priceSliderValues}
                    onValueChange={handlePriceSliderChange}
                    min={0}
                    max={100000}
                    step={100}
                    minStepsBetweenThumbs={100}
                    className="w-full mb-4"
                  />
                  <div className="flex justify-between text-sm">
                    <span>
                      {getCurrencySymbol(currency)}
                      {convertPrice(priceSliderValues[0]).toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </span>
                    <span>
                      {getCurrencySymbol(currency)}
                      {convertPrice(priceSliderValues[1]).toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </span>
                  </div>
                </div>
              ) : allFilters[selectedTab]?.options?.length > 0 ? (
                // Regular filter options
                allFilters[selectedTab]?.options?.map((option, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    onClick={() =>
                      handleOptionSelect(
                        allFilters[selectedTab].title,
                        option.slug
                      )
                    }
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`flex items-center justify-center h-5 w-5 rounded border-2 ${
                          isOptionSelected(
                            allFilters[selectedTab].title,
                            option.slug
                          )
                            ? "border-[#C28F77] bg-[#C28F77]"
                            : "border-gray-300"
                        }`}
                      >
                        {isOptionSelected(
                          allFilters[selectedTab].title,
                          option.slug
                        ) && (
                          <svg
                            className="h-3 w-3 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>

                      <label className="text-md font-medium text-gray-800 cursor-pointer">
                        {option.label}
                      </label>
                    </div>

                    <span className="text-md font-medium text-gray-500">
                      ({option.count})
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No options available
                </div>
              )}
            </div>
          </div>

          <div className="py-4 px-6 text-xs sm:text-sm border-t flex justify-between items-center bg-white">
            <button
              onClick={() => {
                clearFilters();
                setIsFilterDrawerOpen(false);
                setIsDrawerOpen(false);
              }}
              className="px-6 py-3 w-full bg-white rounded-lg shadow-sm shadow-black/14 text-[#000] font-normal"
            >
              Clear All
            </button>
            <div className="h-8 w-[2px] bg-black opacity-50 mx-6" />

            <button
              onClick={() => {
                setIsFilterDrawerOpen(false);
                setIsDrawerOpen(false);
              }}
              className="px-6 py-3 w-full bg-brown text-white rounded-lg shadow-sm shadow-black/14 font-medium"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileFilterDrawer;
