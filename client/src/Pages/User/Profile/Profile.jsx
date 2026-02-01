import React, { useState, useEffect } from "react";
import {
  getUserProfile,
  updateUserProfile,
} from "../../../api/User/ProfileApi";
import { toast } from "sonner";
import useAuth from "../../../Hooks/useAuth";
import ButtonLoading from "../../../components/Loaders/ButtonLoading";
import { Skeleton } from "../../../components/ui/skeleton";
import * as yup from "yup";
import countryData from "country-telephone-data";
import Select from "react-select";
import ReactCountryFlag from "react-country-flag";


export default function Profile() {

  const allCountries = countryData.allCountries;
  
   
  
    const countryOptions = allCountries.map((country) => ({
      label: (
        <div className="flex items-center gap-2">
          <ReactCountryFlag
            countryCode={country.iso2}
            svg
            loading="lazy"
            style={{ width: "1.5em", height: "1.5em" }}
          />
          <span>+{country.dialCode}</span>
        </div>
      ),
        value: `+${country.dialCode}`, 
      name: country.name,
      iso2: country.iso2,
    }));

  const initialFormState = {
    firstName: "",
    lastName: "",
    phone: "",
    countryCode: "+91", 
    alternatePhone: "",
    email: "",
    dob: "",
    gender: "",
    bio: "",
  };

  // Validation schema with optional fields
  const profileSchema = yup.object().shape({
    firstName: yup.string().optional(),
    lastName: yup.string().optional(),
    phone: yup
      .string()
      .optional()
      .matches(/^[0-9]+$/, "Phone number must contain only digits")
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number can't be longer than 15 digits"),
    alternatePhone: yup
      .string()
      .optional()
      .matches(/^[0-9]+$/, "Alternate phone must contain only digits")
      .min(10, "Alternate phone must be at least 10 digits")
      .max(15, "Alternate phone can't be longer than 15 digits"),
    email: yup.string().email("Invalid email").optional(),
    dob: yup
      .date()
      .optional()
      .max(new Date(), "Date of birth cannot be in the future"),
    gender: yup.string().optional(),
    bio: yup.string().optional().max(200, "Bio cannot exceed 200 characters"),
  });

  const [formData, setFormData] = useState(initialFormState);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsProfileLoading(true);
        const response = await getUserProfile();
        const customerData = response.data;

        const formattedData = {
          firstName: customerData.firstName || "",
          lastName: customerData.lastName || "",
          phone: customerData.phone || "",
          countryCode: customerData.countryCode || "",
          alternatePhone: customerData.alternatePhone || "",
          email: customerData.email || "",
          dob: customerData.dob ? formatDate(customerData.dob) : "",
          gender: customerData.gender || "",
          bio: customerData.bio || "",
        };

        setFormData(formattedData);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile");
        toast.error("Failed to load profile data");
      } finally {
        setIsProfileLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = async () => {
    try {
      await profileSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const validationErrors = {};
      err.inner.forEach((error) => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    const isValid = await validateForm();
    if (!isValid) return;

    try {
      setIsLoading(true);
      const response = await updateUserProfile(formData);
      toast.success(response.data.message || "Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update profile";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isProfileLoading) {
    return (
      <div className="max-w-4xl tracking-wider">
        <h2 className="text-lg font-medium mb-6">My Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
          <div className="col-span-1 md:col-span-2">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div className="col-span-1 md:col-span-2 mt-4">
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl tracking-wider text-xs sm:text-sm">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-lg font-medium">My Profile</h2>
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-xs sm:text-sm text-white cp  button-brown px-4 py-2  transition duration-200"
          >
            Edit Profile
          </button>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6"
      >
        <div>
          <label className="block text-sm text-gray-400 mb-1">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            placeholder="Enter your first name"
            onChange={handleChange}
            className="w-full border border-gray-800 px-3 py-2 outline-none"
            disabled={!isEditing}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            placeholder="Enter your last name"
            onChange={handleChange}
            className="w-full border border-gray-800 px-3 py-2 outline-none"
            disabled={!isEditing}
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Phone</label>
          <div className="flex gap-1">
            <div className="min-w-[120px] lg:min-w-[125px] xl:min-w-[125px] ">
              <Select
                options={countryOptions}
                value={countryOptions.find(
                  (opt) => opt.value === formData.countryCode
                )}
                onChange={(selected) =>
                  setFormData({
                    ...formData,
                    countryCode: selected.value,
                  })
                }
                formatOptionLabel={(option) => option.label}
                styles={{
                  control: (base) => ({
                    ...base,
                    border: "1px solid #d1d5db",
                    borderRadius: "0.25rem 0 0 0.25rem",
                    boxShadow: "none",
                    "&:hover": {
                      borderColor: "#d1d5db",
                    },
                  }),
                }}
                 isDisabled={!isEditing}
              />
            </div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full border border-gray-800 px-3 py-2 outline-none"
              disabled={!isEditing}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Alternate Phone
          </label>
          <input
            type="tel"
            name="alternatePhone"
            value={formData.alternatePhone}
            onChange={handleChange}
            placeholder="Enter your alternate phone number"
            className="w-full border border-gray-800 px-3 py-2 outline-none"
            disabled={!isEditing}
          />
          {errors.alternatePhone && (
            <p className="text-red-500 text-xs mt-1">{errors.alternatePhone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            className="w-full border border-gray-800 px-3 py-2 outline-none bg-gray-100"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            placeholder="Select your date of birth"
            className="w-full border border-gray-800 px-3 py-2 outline-none"
            max={new Date().toISOString().split("T")[0]}
            disabled={!isEditing}
          />
          {errors.dob && (
            <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border border-gray-800 px-3 py-2 outline-none"
            disabled={!isEditing}
          >
            <option value="">Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
          )}
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm text-gray-400 mb-1">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself"
            className="w-full border border-gray-800 px-3 py-2 outline-none"
            rows={3}
            maxLength={200}
            disabled={!isEditing}
          />
          <div className="text-xs text-gray-500 mt-1">
            {formData.bio.length}/200 characters
          </div>
          {errors.bio && (
            <p className="text-red-500 text-xs mt-1">{errors.bio}</p>
          )}
        </div>

        {isEditing && (
          <div className="col-span-1 md:col-span-2 flex gap-4">
            <button
              type="submit"
              className="button-brown font-medium tracking-wide text-white w-full py-2 mt-4"
              disabled={isLoading}
            >
              {isLoading ? <ButtonLoading /> : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="border-2 border-gray-800 text-black cp font-medium tracking-wide w-full py-2 mt-4"
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
