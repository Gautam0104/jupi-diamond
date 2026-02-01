import React from "react";
import { Skeleton } from "../../../components/ui/skeleton";

const OrderHistorySkeleton = () => {
  return (
    <>
      {" "}
      <>
        <div className="hidden lg:block mx-auto border-b border-brown shadow bg-white mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 py-3 border-b bg-[#F1EEEE] gap-4 sm:gap-0">
            <div className="space-y-2">
              <Skeleton className="h-3 w-[80px]" />
              <Skeleton className="h-4 w-[120px]" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-[60px]" />
              <Skeleton className="h-4 w-[80px]" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-[60px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-[80px]" />
              <Skeleton className="h-4 w-[70px]" />
            </div>
          </div>

          {[...Array(2)].map((_, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row gap-4 p-4 border-b last:border-b-0"
            >
              <Skeleton className="w-20 h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28" />

              <div className="flex-1 space-y-3">
                <Skeleton className="h-4 w-[200px]" />

                <div className="flex flex-row sm:flex-row items-start sm:items-center justify-between gap-2 mt-2">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-[80px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>

                  <div className="flex flex-col items-center gap-1 mt-3">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-5 w-5 rounded-full" />
                      ))}
                    </div>
                    <Skeleton className="h-3 w-[80px]" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="block lg:hidden mx-auto border-b border-brown shadow bg-white mb-4">
          {/* Order Header */}
          <div className="bg-[#F1EEEE] p-4 space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[60px]" />
            </div>
            <div className="flex justify-between">
              <div className="space-y-1">
                <Skeleton className="h-3 w-[40px]" />
                <Skeleton className="h-4 w-[80px]" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3 w-[40px]" />
                <Skeleton className="h-4 w-[60px]" />
              </div>
            </div>
          </div>

          {/* Product Items */}
          <div className="divide-y divide-gray-100">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="p-4 flex gap-3">
                <Skeleton className="w-20 h-20 rounded-lg" />

                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-[160px]" />
                  <Skeleton className="h-3 w-[60px]" />
                  <Skeleton className="h-4 w-[80px]" />

                  {/* Rating Skeleton */}
                  <div className="flex items-center mt-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-4 w-4 rounded-full" />
                      ))}
                    </div>
                    <Skeleton className="h-3 w-[60px] ml-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3">
            <Skeleton className="h-4 w-[180px]" />
          </div>
        </div>
      </>
    </>
  );
};

export default OrderHistorySkeleton;
