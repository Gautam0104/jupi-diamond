import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { userForgetPassword } from "../../../api/User/AuthApi";
import ButtonLoading from "../../../components/Loaders/ButtonLoading";

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier) {
      toast.error("Email is required");
      return;
    }

    setIsLoading(true);

    try {
      const response = await userForgetPassword({ identifier });

      if (response.data) {
        toast.success("Check Email. We've sent a password reset link.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.log("Forgot password error:", error);
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="relative 2xl:container mx-auto">
        <Link to="/" className="absolute top-4 md:top-6 left-4 md:left-6  ">
          <img
            src="/jupi-logo.png"
            loading="lazy"
            alt="Jupi Logo"
            className="h-14 sm:h-14  "
          />
        </Link>
        <div className="min-h-screen text-xs xl:text-sm flex justify-between">
          <div className="sm:pt-10 w-full lg:w-1/2 bg-white flex flex-col justify-center px-6 sm:px-10 md:px-20 ">
            <h1 className="text-2xl font-medium mb-4 sm:mb-6">
              Forgot Password
            </h1>
            <p className="text-gray-600 mb-6">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block  font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email "
                  className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#ce967e]"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#C38F7A] text-white py-2 rounded shadow-md hover:bg-[#b07863] transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <ButtonLoading /> : "Send Reset Link"}
              </button>

              <div className="mt-2 text-center  text-gray-600">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="font-medium text-[#C38F7A] hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </form>
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
