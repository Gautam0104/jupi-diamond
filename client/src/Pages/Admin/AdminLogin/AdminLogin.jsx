import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ButtonLoading from "../../../components/Loaders/ButtonLoading";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { adminLogin } from "../../../api/Admin/AuthApi";
import Slider from "../../../components/Slider/Slider";
import useAuth from "../../../Hooks/useAuth";

export default function AdminLogin() {
  const { setIsAdmin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error("Email is required");
      return;
    }

    if (!formData.password) {
      toast.error("Password is required");
      return;
    }

    setLoading(true);

    try {
      const response = await adminLogin(formData);
      
      if (response.status === 200) {
        toast.success("Login successful!", {
          description: "You are now being redirected...",
        });
        setIsAdmin(response.data.data);
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 2000);
      }
    } catch (err) {
      console.log("Login error:", err);
      if (err.response) {
        const errorMessage =
          err.response.data?.message || "Login failed. Please try again.";
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="2xl:container mx-auto relative min-h-screen bg-gradient-to-br from-lime-50 to-gray-100">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-lime-400 to-emerald-500"></div>
      <Link
        to="/"
        className="absolute top-4 left-3 sm:top-6 sm:left-6 lg:top-8 lg:left-8 z-10"
      >
        <img
          src="/jupi-logo-transparent.png"
          alt="Jupi Logo"
          loading="lazy"
          className="h-14 sm:h-14 lg:h-20"
        />
      </Link>

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col xl:flex-row items-center justify-center min-h-screen">
        <div className="w-full  xl:w-1/2 flex flex-col items-center justify-center lg:pr-8 xl:pr-16 mb-8 lg:mb-0">
          <div className="hidden sm:block w-full max-w-md xl:max-w-none">
            <Slider />
          </div>
        </div>

        <div className="w-full sm:max-w-md xl:w-1/2 xl:max-w-md">
          <div className="bg-white text-xs xl:text-sm rounded-xl shadow-lg p-4 sm:p-8 md:p-10 border border-gray-100">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Admin Login
              </h2>
              <p className="text-gray-500 mt-1 sm:mt-2 text-xs xl:text-sm">
                Enter your credentials to continue
              </p>
            </div>

            <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs xl:text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="email"
                    placeholder="your@email.com"
                    className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-xs xl:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs xl:text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    className="w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2 sm:py-2.5 text-xs xl:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <span
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <FaEye className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </span>
                </div>
              </div>

              {/* <div className="flex items-center justify-end">
                <div className="text-xs xl:text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-lime-600 hover:text-lime-500"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div> */}

              <button
                type="submit"
                className={`w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent rounded-lg shadow-sm font-medium text-white bg-lime-500 hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-400 transition ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? <ButtonLoading /> : "Sign in"}
              </button>
            </form>
          </div>

          <div className="mt-4 sm:mt-6 text-center text-xs xl:text-sm text-gray-500">
            <p>
              © {new Date().getFullYear()} Jupi Diamons. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
