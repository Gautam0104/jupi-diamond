import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { userLogin } from "../../../api/User/AuthApi";
import ButtonLoading from "../../../components/Loaders/ButtonLoading";
import { AuthContext } from "../../../Context/Auth";
import useAuth from "../../../Hooks/useAuth";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import {
  addItemToCart,
  fetchCartByCustomer,
} from "../../../api/Public/publicApi";
import { useCart } from "../../../Context/CartContext";

export default function Login() {
  const { setUser } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setCartData, setCartCount } = useCart();

  // Get the previous path from state or default to home
  const from =
    (location.state && location.state.from && location.state.from.pathname) ||
    "/";
  console.log("Redirecting from:", from);

  // Function to migrate guest cart to user cart
  const migrateGuestCart = async () => {
    if (typeof window === "undefined") return false;

    const guestCart = JSON.parse(
      localStorage.getItem("guestCart") || { items: [] }
    );

    if (!guestCart?.items || guestCart.items.length === 0) {
      return true;
    }

    try {
      // Process each item with proper error handling
      const migrationResults = await Promise.allSettled(
        guestCart.items.map(async (item) => {
          const payload = {
            productVariantId: item.productVariantId,
            quantity: item.quantity.toString(),
            optionType: item.optionType,
            optionId: item.optionId,
          };

          try {
            const response = await addItemToCart(payload);

            // Check if response status is 200 (success)
            if (response.status === 200) {
              return { success: true, data: response.data };
            } else {
              throw new Error(`Failed to add item: ${response.status.message}`);
            }
          } catch (error) {
            console.error(
              `Failed to migrate item ${item.productVariantId}:`,
              error
            );
            throw error;
          }
        })
      );

      const successfulMigrations = migrationResults.filter(
        (result) => result.status === "fulfilled"
      );

      const failedMigrations = migrationResults.filter(
        (result) => result.status === "rejected"
      );

      if (failedMigrations.length > 0) {
        console.error("Failed migrations:", failedMigrations);
        toast.error(
          `${failedMigrations.length} of ${guestCart.items.length} items couldn't be migrated`
        );
      }

      if (successfulMigrations.length > 0) {
        console.log(
          `${successfulMigrations.length} items migrated successfully`
        );
        // Only update cart if at least some items were successful
        try {
          const response = await fetchCartByCustomer();
          setCartData(response.data.data);
          setCartCount(response.data.data?.cartSummery?.cartItemsCount || 0);
        } catch (error) {
          console.error("Failed to fetch updated cart:", error);
        }
      }

      return failedMigrations.length === 0;
    } catch (error) {
      console.error("Unexpected error during guest cart migration:", error);
      toast.error("An unexpected error occurred during cart migration");
      return false;
    } finally {
      // Clear guest cart regardless of success/failure
      localStorage.removeItem("guestCart");
    }
  };

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
      toast.error("Email or phone number is required");
      return;
    }

    if (!formData.password) {
      toast.error("Password is required");
      return;
    }

    setLoading(true);

    try {
      const response = await userLogin(formData);
      if (response.status === 200) {
        toast.success("Login successful!", {
          description: "You are now being redirected...",
        });
        setUser(response.data.data.data);
        const isBuyNow = location.state?.from?.isBuyNow;
        const productData = location.state?.productData;

        
        if (isBuyNow && productData) {
          // Add the buy now item to the user's cart
          const payload = {
            productVariantId: productData.productVariantId,
            quantity: productData.quantity.toString(),
            optionType: productData.optionType,
            optionId: productData.optionId,
          };

          await addItemToCart(payload);
          
          const response = await fetchCartByCustomer();
          setCartData(response.data.data);
          setCartCount(response.data.data?.cartSummery?.cartItemsCount || 0);

          // Clear any existing guest cart
          localStorage.removeItem("guestCart");

          // Redirect to checkout
          navigate("/checkout", { replace: true });
        } else {
          const migrationSuccess = await migrateGuestCart();
          if (migrationSuccess) {
            localStorage.removeItem("guestCart");
          }
          setTimeout(() => {
            if (from === "/checkout") {
              navigate("/checkout", { replace: true });
            } else {
              navigate(from, { replace: true });
            }
          }, 2000);
        }
      } else if (response.status === 401) {
        toast.error("Invalid email or password. Please try again.");
      } else {
        toast.error(response.data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.log("Login error:", err);
      if (err.response && err.response.data) {
        toast.error(
          err.response.data.message || "Login failed. Please try again."
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative 2xl:container mx-auto">
      <Link to="/" className="absolute top-4 md:top-6 left-4 md:left-6 z-10">
        <img
          src="/jupi-logo.png"
          loading="lazy"
          alt="Jupi Logo"
          className="h-14 sm:h-14"
        />
      </Link>

      <div className="min-h-screen text-xs xl:text-sm flex flex-col lg:flex-row justify-center lg:justify-between gap-10">
        <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-6 sm:px-10 md:px-20 py-20 lg:py-0">
          <div className=" mx-auto w-full">
            {" "}
            <h1 className="text-2xl font-medium mb-6">Login</h1>
            <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block  font-medium text-gray-700 mb-1">
                  Email Address or Phone
                </label>
                <input
                  type="text"
                  name="email"
                  placeholder="Email or Phone Number"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#ce967e]"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block  font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-2 border border-gray-300 rounded pr-10 focus:outline-none focus:ring-1 focus:ring-[#ce967e]"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <span
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="size-4 md:size-5" />
                    ) : (
                      <FaEye className="size-4 md:size-5" />
                    )}
                  </span>
                </div>
              </div>

              <div className="flex justify-end  text-gray-600 items-center">
                <Link to="/forgot-password" className="hover:underline">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className={`${
                  loading ? "cursor-not-allowed" : "cp"
                } w-full bg-brown text-white font-medium py-2 rounded  shadow transition disabled:opacity-70`}
                disabled={loading}
              >
                {loading ? <ButtonLoading /> : "Login"}
              </button>

              <div className="text-center  text-gray-600 mt-2">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-brown hover:underline font-medium"
                >
                  Sign up
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
  );
}
