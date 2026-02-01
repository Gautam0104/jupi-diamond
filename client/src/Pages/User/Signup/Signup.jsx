import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { userRegister } from "../../../api/User/AuthApi";
import ButtonLoading from "../../../components/Loaders/ButtonLoading";
import { toast } from "sonner";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import countryData from "country-telephone-data";
import Select from "react-select";
import ReactCountryFlag from "react-country-flag";

export default function Signup() {
  const allCountries = countryData.allCountries;

  const defaultCountryIndex = allCountries.findIndex(
    (country) => country.iso2 === "in"
  );

  const defaultCountry =
    allCountries[defaultCountryIndex >= 0 ? defaultCountryIndex : 0];

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
    value: country.dialCode,
    name: country.name,
    iso2: country.iso2,
  }));


  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: defaultCountry.dialCode,
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validationSchema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup
      .string()
      .email("Please provide a valid email address")
      .required("Email is required"),
    phone: yup
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .required("Phone number is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(
        /[!@#$%^&*]/,
        "Password must contain at least one special character (!@#$%^&*)"
      )
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Please confirm your password"),
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});

      const { confirmPassword, ...userData } = formData;

       const payload = {
      ...userData,
      countryCode: `+${userData.countryCode}`
    };

      const response = await userRegister(payload);
      

      if (response.status === 201) {
        toast.success(
          "Registration successful! Please check your email for verification."
        );

        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          countryCode: "",
          terms: false,
        });
      } else if (response.status === 200) {
        toast.error(response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      } else if (error.response?.data) {
        const { statusCode, message } = error.response.data;

        if (statusCode === 409) {
          setErrors({ api: message });
          toast.error(message);
        } else {
          setErrors({ api: message || "Something went wrong" });
          toast.error(message || "Something went wrong");
        }
      } else {
        const errorMessage = error.message || "An unexpected error occurred";
        setErrors({ api: errorMessage });
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="relative 2xl:container mx-auto">
        <Link to="/" className="absolute top-4 md:top-6 left-4 md:left-6 z-10">
          <img
            src="/jupi-logo.png"
            loading="lazy"
            alt="Jupi Logo"
            className="h-14 sm:h-14"
          />
        </Link>

        <div className="min-h-screen text-xs  xl:text-sm flex flex-col lg:flex-row justify-center lg:justify-between">
          <div className="w-full md:mt-16 lg:w-1/2 bg-white flex flex-col justify-center px-6 sm:px-6 md:px-20 py-24 lg:py-10">
            <div className=" mx-auto w-full">
              {" "}
              <h1 className="text-2xl font-medium mb-6">Register</h1>
              <form
                className="space-y-4"
                autoComplete="off"
                onSubmit={handleSubmit}
              >
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block  font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ce967e] ${
                        errors.firstName ? "border-red-500" : ""
                      }`}
                    />
                    {errors.firstName && (
                      <p className="mt-1  text-red-600">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block  font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ce967e] ${
                        errors.lastName ? "border-red-500" : ""
                      }`}
                    />
                    {errors.lastName && (
                      <p className="mt-1  text-red-600">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block  font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ce967e] ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1  text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block  font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="flex gap-1">
                    <div className="min-w-[120px] sm:min-w-[130px] xl:w-[140px]">
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
                      />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full border rounded-r px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ce967e] ${
                        errors.phone ? "border-red-500" : ""
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block  font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="At least 8 characters"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full border border-gray-300 rounded px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#C38F7A] ${
                        errors.password ? "border-red-500" : ""
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="size-4 md:size-5" />
                      ) : (
                        <FaEye className="size-4 md:size-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1  text-red-600">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block  font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full border border-gray-300 rounded px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#C38F7A] ${
                        errors.confirmPassword ? "border-red-500" : ""
                      }`}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash className="size-4 md:size-5" />
                      ) : (
                        <FaEye className="size-4 md:size-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1  text-red-600">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Terms checkbox */}
                <div className="flex items-start">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={formData.terms}
                    onChange={handleChange}
                    className={`h-4 w-4 mt-0 sm:mt-0.5 rounded border-2 border-gray-300 ${
                      errors.terms ? "border-red-500" : ""
                    }`}
                  />
                  <label
                    htmlFor="terms"
                    className="ml-2 block text-xs sm: text-gray-700"
                  >
                    I agree to the{" "}
                    <a
                      href="/terms-and-conditions"
                      className="text-[#C38F7A] hover:underline"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy-policy"
                      className="text-[#C38F7A] hover:underline"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={!formData.terms || isSubmitting}
                  className={`w-full bg-[#C38F7A] text-white  py-2 rounded shadow-md hover:bg-[#b07863] transition ${
                    isSubmitting || !formData.terms
                      ? "opacity-70 cursor-not-allowed"
                      : "cp"
                  }`}
                >
                  {isSubmitting ? <ButtonLoading /> : "Create Account"}
                </button>

                {/* Login link */}
                <div className="text-center  text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-brown hover:underline"
                  >
                    Sign in
                  </Link>
                </div>
              </form>
            </div>
          </div>

          <div className="hidden lg:flex md:w-[350px] lg:w-[300px] xl:w-[450px] 2xl:w-[500px] bg-brown items-center relative">
            <div className="w-[110%] h-[85%] overflow-hidden rounded-lg absolute sm:-left-30 md:-left-40 lg:w-[140%] lg:-left-50 xl:w-[110%] xl:-left-50 2xl:w-[110%] 2xl:-left-60">
              <img
                src="/home/LoginBanner.jpg"
                alt="Jewelry"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
