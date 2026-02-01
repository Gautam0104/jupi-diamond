import { useState, useEffect } from "react";
import { toast } from "sonner";
import ButtonLoading from "../../../components/Loaders/ButtonLoading";
import Select from "react-select";
import countryList from "country-list";
import { City, State, Country } from "country-state-city";

const addressTypes = [
  { value: "HOME", label: "Home" },
  { value: "OFFICE", label: "Office" },
];

export default function AddressModal({
  isOpen,
  onClose,
  onSave,
  isFirstAddress,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const countryOptions = Country.getAllCountries().map((country) => ({
    label: country.name,
    value: country.isoCode,
    name: country.name,
  }));

  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);

  const [formData, setFormData] = useState({
    houseNo: "",
    landMark: "",
    street: "",
    city: "",
    cityName: "",
    state: "",
    stateName: "",
    country: "",
    countryName: "",
    postalCode: "",
    isBilling: isFirstAddress,
    addressType: "HOME",
    panNumber: "",
    gstNumber: "",
  });

  // Load states when country changes
  useEffect(() => {
    if (formData.country) {
      const states = State.getStatesOfCountry(formData.country);
      setStateOptions(
        states.map((state) => ({
          label: state.name,
          value: state.isoCode,
          name: state.name,
        }))
      );
      // Reset state and city when country changes
      setFormData((prev) => ({
        ...prev,
        state: "",
        stateName: "",
        city: "",
        cityName: "",
      }));
      setCityOptions([]);
    }
  }, [formData.country]);

  // Load cities when state changes
  useEffect(() => {
    if (formData.country && formData.state) {
      const cities = City.getCitiesOfState(formData.country, formData.state);
      setCityOptions(
        cities.map((city) => ({
          label: city.name,
          value: city.name,
          name: city.name,
        }))
      );
      // Reset city when state changes
      setFormData((prev) => ({
        ...prev,
        city: "",
        cityName: "",
      }));
    }
  }, [formData.country, formData.state]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCountryChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      country: selectedOption.value,
      countryName: selectedOption.name,
      state: "",
      stateName: "",
      city: "",
      cityName: "",
    }));
  };

  const handleStateChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      state: selectedOption.value,
      stateName: selectedOption.name,
      city: "",
      cityName: "",
    }));
  };

  const handleCityChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      city: selectedOption.value,
      cityName: selectedOption.name,
    }));
  };

  const handleAddressTypeChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      addressType: selectedOption.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Prepare the data to send with full names
      const dataToSend = {
        ...formData,
        // Use the name fields for display purposes
        countryDisplay: formData.countryName,
        stateDisplay: formData.stateName,
        cityDisplay: formData.cityName,
      };

      console.log("Form Data:", dataToSend);
      await onSave(dataToSend);
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Error saving address");
    }
    setIsLoading(false);
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded w-full max-w-2xl">
        <div className="flex justify-between items-center p-3 sm:p-6 pb-0">
          <h3 className="text-lg font-medium">Add New Address</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} autoComplete="off" className="p-3 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="space-y-2 sm:space-y-4 ">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  House No./Building
                </label>
                <input
                  type="text"
                  name="houseNo"
                  value={formData.houseNo}
                  onChange={handleChange}
                  placeholder="Enter your house no. or building name"
                  className="w-full px-2 sm:px-3 py-2 border text-xs sm:text-sm border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#c98d73]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Address Type
                </label>
                <Select
                  name="addressType"
                  options={addressTypes}
                  value={addressTypes.find(
                    (opt) => opt.value === formData.addressType
                  )}
                  onChange={handleAddressTypeChange}
                  placeholder="Select address type"
                  className="address-type-select"
                  classNamePrefix="select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      border: "1px solid #d1d5db",
                      padding: "0px 4px",
                      minHeight: "38px",
                      "@media (max-width: 640px)": {
                        padding: "0px 1px",
                        fontSize: "12px",
                        minHeight: "34px",
                      },
                      borderRadius: "0",
                      boxShadow: "none",
                      "&:hover": {
                        borderColor: "#d1d5db",
                      },
                      "&:focus-within": {
                        borderColor: "#c98d73",
                        boxShadow: "0 0 0 1px #c98d73",
                      },
                    }),
                    dropdownIndicator: (base) => ({
                      ...base,
                      padding: "4px",
                      "@media (min-width: 640px)": {
                        padding: "2px",
                      },
                      color: "#6b7280",
                    }),
                    indicatorSeparator: () => ({}),
                    option: (base, { isSelected }) => ({
                      ...base,
                      backgroundColor: isSelected ? "#f3f4f6" : "white",
                      color: "#111827",
                      "&:hover": {
                        backgroundColor: "#f3f4f6",
                      },
                    }),
                  }}
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Landmark
                </label>
                <input
                  type="text"
                  name="landMark"
                  value={formData.landMark}
                  onChange={handleChange}
                  placeholder="Enter a landmark"
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#c98d73]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Street
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="Enter your street"
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#c98d73]"
                  required
                />
              </div>

               <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  PAN Number
                </label>
                <input
                  type="text"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleChange}
                  placeholder="Enter your pan number"
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#c98d73]"
                  
                />
              </div>
            </div>
            <div className="space-y-2 sm:space-y-4 grid sm:block grid-cols-2 gap-2">
              <div className="">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <Select
                  name="country"
                  options={countryOptions}
                  value={countryOptions.find(
                    (opt) => opt.value === formData.country
                  )}
                  onChange={handleCountryChange}
                  placeholder="Select country"
                  className="country-select"
                  classNamePrefix="select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      border: "1px solid #d1d5db",
                      padding: "0px 4px",
                      minHeight: "38px",
                      "@media (max-width: 640px)": {
                        padding: "0px 1px",
                        fontSize: "12px",
                        minHeight: "34px",
                      },
                      borderRadius: "0",
                      boxShadow: "none",
                      "&:hover": {
                        borderColor: "#d1d5db",
                      },
                      "&:focus-within": {
                        borderColor: "#c98d73",
                        boxShadow: "0 0 0 1px #c98d73",
                      },
                    }),
                    dropdownIndicator: (base) => ({
                      ...base,
                      padding: "4px",
                      "@media (min-width: 640px)": {
                        padding: "2px",
                      },
                      color: "#6b7280",
                    }),
                    indicatorSeparator: () => ({}),
                    option: (base, { isSelected }) => ({
                      ...base,
                      backgroundColor: isSelected ? "#f3f4f6" : "white",
                      color: "#111827",
                      "&:hover": {
                        backgroundColor: "#f3f4f6",
                      },
                    }),
                  }}
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <Select
                  name="state"
                  options={stateOptions}
                  value={stateOptions.find(
                    (opt) => opt.value === formData.state
                  )}
                  onChange={handleStateChange}
                  placeholder="Select state"
                  isDisabled={!formData.country}
                  className="state-select"
                  classNamePrefix="select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      border: "1px solid #d1d5db",
                      padding: "0px 4px",
                      minHeight: "38px",
                      "@media (max-width: 640px)": {
                        padding: "0px 1px",
                        fontSize: "12px",
                        minHeight: "34px",
                      },
                      borderRadius: "0",
                      boxShadow: "none",
                      "&:hover": {
                        borderColor: "#d1d5db",
                      },
                      "&:focus-within": {
                        borderColor: "#c98d73",
                        boxShadow: "0 0 0 1px #c98d73",
                      },
                    }),
                    dropdownIndicator: (base) => ({
                      ...base,
                      padding: "4px",
                      "@media (min-width: 640px)": {
                        padding: "2px",
                      },
                      color: "#6b7280",
                    }),
                    indicatorSeparator: () => ({}),
                    option: (base, { isSelected }) => ({
                      ...base,
                      backgroundColor: isSelected ? "#f3f4f6" : "white",
                      color: "#111827",
                      "&:hover": {
                        backgroundColor: "#f3f4f6",
                      },
                    }),
                  }}
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <Select
                  name="city"
                  options={cityOptions}
                  value={cityOptions.find((opt) => opt.value === formData.city)}
                  onChange={handleCityChange}
                  placeholder="Select city"
                  isDisabled={!formData.state}
                  className="city-select"
                  classNamePrefix="select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      border: "1px solid #d1d5db",
                      padding: "0px 4px",
                      minHeight: "38px",
                      "@media (max-width: 640px)": {
                        padding: "0px 1px",
                        fontSize: "12px",
                        minHeight: "34px",
                      },
                      borderRadius: "0",
                      boxShadow: "none",
                      "&:hover": {
                        borderColor: "#d1d5db",
                      },
                      "&:focus-within": {
                        borderColor: "#c98d73",
                        boxShadow: "0 0 0 1px #c98d73",
                      },
                    }),
                    dropdownIndicator: (base) => ({
                      ...base,
                      padding: "4px",
                      "@media (min-width: 640px)": {
                        padding: "2px",
                      },
                      color: "#6b7280",
                    }),
                    indicatorSeparator: () => ({}),
                    option: (base, { isSelected }) => ({
                      ...base,
                      backgroundColor: isSelected ? "#f3f4f6" : "white",
                      color: "#111827",
                      "&:hover": {
                        backgroundColor: "#f3f4f6",
                      },
                    }),
                  }}
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="Enter your postal code"
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#c98d73]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  GST Number
                </label>
                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  placeholder="Enter your gst number"
                  className="w-full px-2 sm:px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#c98d73]"
                  
                />
              </div>
              
            </div>
          </div>

          <div className="mt-6 flex items-center">
            <input
              type="checkbox"
              name="isBilling"
              id="isBilling"
              checked={formData.isBilling}
              onChange={handleChange}
              disabled={isFirstAddress}
              className="h-4 w-4 text-[#c98d73] focus:ring-[#c98d73] border-gray-300 rounded"
            />
            <label
              htmlFor="isBilling"
              className="ml-2 block text-xs sm:text-sm text-gray-700"
            >
              Use as billing address
            </label>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-[#c98d73] text-white text-xs sm:text-sm font-medium hover:bg-[#b57d63]"
            >
              {isLoading ? <ButtonLoading /> : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
