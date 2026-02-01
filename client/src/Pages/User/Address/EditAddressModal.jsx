import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  getUserAddressById,
  updateUserAddress,
} from "../../../api/User/AddressApi";
import ButtonLoading from "../../../components/Loaders/ButtonLoading";
import { Skeleton } from "../../../components/ui/skeleton";
import Select from "react-select";
import { Country, State, City } from "country-state-city";

const addressTypes = [
  { value: "HOME", label: "Home" },
  { value: "OFFICE", label: "Office" },
];

export default function EditAddressModal({
  isOpen,
  onClose,
  addressId,
  onUpdateSuccess,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // Get all countries
  const countryOptions = Country.getAllCountries().map((country) => ({
    label: country.name,
    value: country.name,
    isoCode: country.isoCode,
  }));

  const [formData, setFormData] = useState({
    houseNo: "",
    landMark: "",
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    isBilling: false,
    addressType: "HOME",
    panNumber: "",
    gstNumber: "",
  });

  useEffect(() => {
    if (isOpen && addressId) {
      fetchAddressData();
    }
  }, [isOpen, addressId]);

  // Update states when country changes
  useEffect(() => {
    if (formData.country) {
      const selectedCountry = Country.getAllCountries().find(
        (c) => c.name === formData.country
      );
      if (selectedCountry) {
        const countryStates = State.getStatesOfCountry(selectedCountry.isoCode);
        setStates(
          countryStates.map((state) => ({
            label: state.name,
            value: state.name,
            isoCode: state.isoCode,
          }))
        );
      }
    } else {
      setStates([]);
    }
    setCities([]);
    setFormData((prev) => ({ ...prev, state: "", city: "" }));
  }, [formData.country]);

  // Update cities when state changes
  useEffect(() => {
    if (formData.state && formData.country) {
      const selectedCountry = Country.getAllCountries().find(
        (c) => c.name === formData.country
      );
      const selectedState = State.getStatesOfCountry(
        selectedCountry.isoCode
      ).find((s) => s.name === formData.state);
      if (selectedState) {
        const stateCities = City.getCitiesOfState(
          selectedCountry.isoCode,
          selectedState.isoCode
        );
        setCities(
          stateCities.map((city) => ({
            label: city.name,
            value: city.name,
          }))
        );
      }
    } else {
      setCities([]);
    }
    setFormData((prev) => ({ ...prev, city: "" }));
  }, [formData.state, formData.country]);

  const fetchAddressData = async () => {
    setIsFetching(true);
    try {
      const response = await getUserAddressById(addressId);
      const addressData = response.data.data;

      setFormData((prev) => ({
        ...prev,
        country: addressData.country,
        state: "", 
        city: "", 
      }));

      setTimeout(() => {
        setFormData((prev) => ({
          ...prev,
          state: addressData.state,
          city: "", 
        }));

        setTimeout(() => {
          setFormData((prev) => ({
            ...prev,
            ...addressData, 
          }));
        }, 100);
      }, 100);
    } catch (error) {
      console.error("Error fetching address:", error);
      toast.error("Failed to load address data");
    } finally {
      setIsFetching(false);
    }
  };

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
      country: selectedOption?.value || "",
      state: "",
      city: "",
    }));
  };

  const handleStateChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      state: selectedOption?.value || "",
      city: "",
    }));
  };

  const handleCityChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      city: selectedOption?.value || "",
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

      const res = await updateUserAddress(addressId, formData);
      toast.success("Address updated successfully");
      onUpdateSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("Error updating address");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 pb-0">
          <h3 className="text-lg font-medium">Edit Address</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>
        {isFetching ? (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="space-y-3">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} autoComplete="off" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="space-y-2 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    House No./Building
                  </label>
                  <input
                    type="text"
                    name="houseNo"
                    value={formData.houseNo}
                    onChange={handleChange}
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
                    placeholder="Enter PAN Number"
                    onChange={handleChange}
                    className="w-full px-2 sm:px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#c98d73]"
                  />
                </div>
              </div>
              <div className="space-y-2 sm:space-y-4 grid sm:block grid-cols-2 gap-2">
                <div>
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
                    options={states}
                    value={states.find((opt) => opt.value === formData.state)}
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
                    options={cities}
                    value={cities.find((opt) => opt.value === formData.city)}
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
                    type="tel"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full px-2 sm:px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#c98d73]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    GST Number
                  </label>
                  <input
                    type="tel"
                    name="gstNumber"
                    value={formData?.gstNumber}
                    onChange={handleChange}
                    placeholder="Enter GST Number"
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
                className="h-4 w-4 text-[#c98d73] focus:ring-[#c98d73] border-gray-300 rounded"
              />
              <label
                htmlFor="isBilling"
                className="ml-2 block text-xs sm:text-sm cp text-gray-700"
              >
                Use as billing address
              </label>
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 cp border border-gray-300 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-[#c98d73] cp text-white text-xs sm:text-sm font-medium hover:bg-[#b57d63]"
              >
                {isLoading ? <ButtonLoading /> : "Update Address"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
