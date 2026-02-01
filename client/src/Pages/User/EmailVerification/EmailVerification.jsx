import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { userEmailVerification } from "../../../api/User/AuthApi";
import ButtonLoading from "../../../components/Loaders/ButtonLoading";
import { toast } from "sonner";

const EmailVerification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get token and role from URL query parameters
  const token = searchParams.get("token");
  const role = searchParams.get("role");

  const verifyLink = async () => {
    if (!token || !role) {
      toast.error("Invalid verification link - missing parameters");
      return;
    }

    setIsLoading(true);
    try {
      const res = await userEmailVerification(token, role);
      if (res.status === 200) {
        toast.success(res.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Email verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Optional: Auto-verify when component mounts
  //   useEffect(() => {
  //     verifyLink();
  //   }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="h-[80vh] bg-[#fff] flex items-center justify-center px-4 sm:px-6 lg:px-8 tracking-wide">
      <div className="max-w-xs sm:max-w-sm xl:max-w-lg 2xl:max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-xl  2xl:text-3xl font-semibold tracking-wide text-black">
            Email Verification
          </h2>
          <p className="mt-2 text-center text-xs xl:text-sm font-medium text-black">
            {isLoading
              ? "Verifying your email..."
              : "Click below to verify your email."}
          </p>
        </div>
        {!isLoading && (
          <div className="mt-8 space-y-6">
            <div>
              <button
                onClick={verifyLink}
                disabled={isLoading}
                className="w-full flex font-medium cp justify-center py-2 px-4 border border-transparent text-xs xl:text-sm text-white hover:scale-105 transition-transform ease-in-out duration-300 bg-brown focus:outline-none focus:ring-none focus:ring-offset-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <ButtonLoading /> : "Verify Email"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
