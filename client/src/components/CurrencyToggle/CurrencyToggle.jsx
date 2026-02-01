import React, { useState, useContext, useEffect, useRef } from "react";
import { FaDollarSign } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { LuIndianRupee } from "react-icons/lu";
import { CurrencyContext } from "../../Context/CurrencyContext";

const CurrencyToggle = ({ currencyList }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { currency: selectedCurrency, switchCurrency } = useContext(CurrencyContext);
  const dropdownRef = useRef(null);

  // Map currency codes to their corresponding icons
  const currencyIcons = {
    INR: <LuIndianRupee />,
    USD: <FaDollarSign />,
    EUR: <>€</>, 
    GBP: <>£</>  
  };

  const toggleDropdown = () => setIsOpen(!isOpen);
  const selectCurrency = (currencyCode) => {
    switchCurrency(currencyCode);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Return null after all hooks if currencyList is empty
  if (!currencyList || currencyList.length === 0) {
    return null; 
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-1 focus:outline-none hover:opacity-80 transition-opacity cursor-pointer"
      >
        <span className="hidden sm:block">({selectedCurrency})</span>
        <span className="-mt-0.5 text-[17px] xl:text-md">
          {currencyIcons[selectedCurrency] || currencyList.find(c => c.code === selectedCurrency)?.symbol}
        </span>
        <IoIosArrowDown
          size={14}
          className={`transition-transform hidden sm:block ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute text-xs xl:text-md -right-20 sm:right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50 cursor-pointer">
          {currencyList.map((currency) => (
            <div
              key={currency.code}
              onClick={() => selectCurrency(currency.code)}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                selectedCurrency === currency.code
                  ? "bg-gray-100 text-[#C68B73]"
                  : "text-gray-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{currencyIcons[currency.code] || currency.symbol}</span>
                <span>{currency.code}</span>
                <span className="text-xs text-gray-500">{currency.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrencyToggle;