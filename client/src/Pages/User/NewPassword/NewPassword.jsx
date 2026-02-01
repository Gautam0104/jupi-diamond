import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import * as Yup from "yup";
import { useFormik } from "formik";
import ButtonLoading from "../../../components/Loaders/ButtonLoading";
import { userCreateNewPassword } from "../../../api/User/AuthApi";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const passwordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
});

export default function NewPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const id = searchParams.get("id");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: passwordSchema,
    onSubmit: async (values) => {
      if (!token) {
        toast.error("Invalid token. Please try the password reset link again.");
        return;
      }

      if (!id) {
        toast.error("Invalid Id. Please try the password reset link again.");
        return;
      }

      setIsLoading(true);

      try {
        const response = await userCreateNewPassword(
          token,
          id,
          values.newPassword
        );

        toast.success("Your password has been reset successfully!");
        formik.resetForm();
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (error) {
        let errorMessage = "Failed to reset password. Please try again.";

        if (error.response) {
          errorMessage = error.response.data.message || errorMessage;
        }

        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      <div className="relative 2xl:container mx-auto">
        <Link to="/" className="absolute top-4 md:top-6 left-4 md:left-6">
          <img
            src="/jupi-logo.png"
            loading="lazy"
            alt="Jupi Logo"
            className="h-14 sm:h-14"
          />
        </Link>
        <div className="min-h-screen text-xs xl:text-sm flex justify-between">
          <div className="sm:pt-10 w-full lg:w-1/2 bg-white flex flex-col justify-center px-6 sm:px-10 md:px-20">
            <h1 className="text-2xl font-medium mb-6">Create New Password</h1>
            <p className="text-gray-600 mb-6">
              Please create a new password for your account.
            </p>

            <form className="space-y-4" onSubmit={formik.handleSubmit}>
              <div>
                <label className="block text-xs xl:text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters "
                    className={`w-full border ${
                      formik.touched.newPassword && formik.errors.newPassword
                        ? "border-red-300"
                        : "border-gray-300"
                    } rounded px-2 md:px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#C38F7A] focus:border-transparent transition`}
                    name="newPassword"
                    value={formik.values.newPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="size-4 md:size-5" />
                    ) : (
                      <FaEye className="size-4 md:size-5" />
                    )}
                  </button>
                </div>
                {formik.touched.newPassword && formik.errors.newPassword && (
                  <p className="mt-1 text-xs xl:text-sm text-red-600">
                    {formik.errors.newPassword}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs xl:text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    className={`w-full border ${
                      formik.touched.confirmPassword &&
                      formik.errors.confirmPassword
                        ? "border-red-300"
                        : "border-gray-300"
                    } rounded px-2 md:px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#C38F7A] focus:border-transparent transition`}
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="size-4 md:size-5" />
                    ) : (
                      <FaEye className="size-4 md:size-5" />
                    )}
                  </button>
                </div>
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <p className="mt-1 text-xs xl:text-sm text-red-600">
                      {formik.errors.confirmPassword}
                    </p>
                  )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#C38F7A] text-white py-2 rounded shadow-md hover:bg-[#b07863] transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <ButtonLoading /> : "Update Password"}
              </button>

              <div className="mt-2 text-center text-xs xl:text-sm text-gray-600">
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
