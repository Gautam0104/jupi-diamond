import { format } from "date-fns";
import React from "react";

const StatusTracking = ({ historyStatus }) => {
  console.log("History Status:", historyStatus);

  // Default statuses to always show
  const defaultStatuses = [
    { status: "PENDING", id: "pending-default", updatedAt: new Date() },
    { status: "CONFIRMED", id: "confirmed-default", updatedAt: new Date() },
    { status: "SHIPPED", id: "shipped-default", updatedAt: new Date() },
    { status: "DELIVERED", id: "delivered-default", updatedAt: new Date() },
  ];

  // Check if we have any cancelled/return-related statuses
  const hasCancelledStatus = historyStatus?.some((step) =>
    [
      "CANCELLED",
      "RETURN_REQUESTED",
      "RETURN_APPROVED",
      "RETURNED",
      "REFUNDED",
    ].includes(step.status)
  );

  // Additional statuses to show when cancelled/returned
  const additionalStatuses = [
    { status: "CANCELLED", id: "cancelled-default", updatedAt: new Date() },
    {
      status: "RETURN_REQUESTED",
      id: "return-requested-default",
      updatedAt: new Date(),
    },
    {
      status: "RETURN_APPROVED",
      id: "return-approved-default",
      updatedAt: new Date(),
    },
    { status: "RETURNED", id: "returned-default", updatedAt: new Date() },
    { status: "REFUNDED", id: "refunded-default", updatedAt: new Date() },
  ];

  // Combine statuses based on condition
  let statusesToShow = [...defaultStatuses];
  if (hasCancelledStatus) {
    statusesToShow = [...defaultStatuses, ...additionalStatuses];
  }

  // Merge with actual history status to get real timestamps and active states
  const mergedStatuses = statusesToShow.map((statusItem) => {
    const realStatus = historyStatus?.find(
      (s) => s.status === statusItem.status
    );
    return realStatus || statusItem;
  });

  // Determine which statuses are active
  const activeStatuses = historyStatus?.map((s) => s.status) || [];

  return (
    <>
      <div className="ml-2">
        {mergedStatuses.map((step, index) => {
          let statusColor;
          if (
            [
              "CANCELLED",
              "RETURN_REQUESTED",
              "RETURN_APPROVED",
              "REFUNDED",
            ].includes(step.status)
          ) {
            statusColor = "bg-red-600";
          } else if (step.status === "RETURNED") {
            statusColor = "bg-yellow-500";
          } else {
            statusColor = "bg-green-600";
          }

          const isActive = activeStatuses.includes(step.status);
          const isCompleted =
            index <
            mergedStatuses.findIndex((s) => activeStatuses.includes(s.status));

          return (
            <div key={`mobile-${step.id}`} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-4 h-4 rounded-full flex-shrink-0 ${
                    isActive
                      ? statusColor
                      : isCompleted
                      ? statusColor
                      : "bg-gray-300"
                  }`}
                ></div>
                {index < mergedStatuses.length - 1 && (
                  <div
                    className={`w-[2px] h-8 my-1 ${
                      isCompleted ? statusColor : "bg-gray-300"
                    }`}
                  ></div>
                )}
              </div>
              <div className="flex-1">
                <div
                  className={`text-sm ${
                    isActive ? "text-gray-800 font-medium" : "text-gray-500"
                  }`}
                >
                  {step.status.replace(/_/g, " ")}
                </div>
                {isActive && (
                  <div className="text-xs text-gray-400">
                    {format(new Date(step.updatedAt), "dd MMM yyyy, hh:mm a")}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default StatusTracking;
