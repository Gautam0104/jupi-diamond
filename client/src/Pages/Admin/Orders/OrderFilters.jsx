import React from "react";
import { Filter, X } from "lucide-react";

import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Input } from "../../../components/ui/input";
import DatePicker from "react-datepicker";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";

const disableBodyScroll = (disable) => {
  if (disable) {
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${
      window.innerWidth - document.documentElement.clientWidth
    }px`;
  } else {
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  }
};

const OrderFilters = ({ filters, handleFilterChangeHook, onApplyFilters,clearFilters }) => {
  const [open, setOpen] = React.useState(false);
  const [localFilters, setLocalFilters] = React.useState(filters);

  // Sync local filters when props change
  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  React.useEffect(() => {
    disableBodyScroll(open);
    return () => disableBodyScroll(false);
  }, [open]);

  const handleFilterChange = (name, value) => {
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name, date) => {
    setLocalFilters((prev) => ({ ...prev, [name]: date }));
  };

  const handleApplyFilters = () => {
    Object.entries(localFilters).forEach(([key, value]) => {
      handleFilterChangeHook({ target: { name: key, value: value || "" } });
    });
    setOpen(false);
    if (onApplyFilters) onApplyFilters();
  };

  const handleResetFilters = () => {
    const resetFilters = {
      status: "",
      paymentStatus: "",
      paymentMethod: "",
      minAmount: "",
      maxAmount: "",
      startDate: "",
      endDate: "",
      clearFilters: "",
    };
    setLocalFilters(resetFilters);
    Object.entries(resetFilters).forEach(([name, value]) => {
      handleFilterChangeHook({ target: { name, value } });
    });
    setOpen(false);
  };

  const statusOptions = [
    { value: "PENDING", label: "Pending" },
    { value: "CONFIRMED", label: "Confirmed" },
    { value: "SHIPPED", label: "Shipped" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "CANCELLED", label: "Cancelled" },
    { value: "RETURN_REQUESTED", label: "Return Requested" },
    { value: "RETURN_APPROVED", label: "Return Approved" },
    { value: "RETURNED", label: "Returned" },
    { value: "REFUNDED", label: "Refunded" },
  ];

  const paymentStatusOptions = [
    { value: "PENDING", label: "Pending" },
    { value: "SUCCESS", label: "Success" },
    { value: "FAILED", label: "Failed" },
    { value: "REFUNDED", label: "Refunded" },
  ];

  const paymentMethodOptions = [
    { value: "RAZORPAY", label: "Razorpay" },
    { value: "PAYPAL", label: "PayPal" },
    { value: "COD", label: "Cash on Delivery" },
  ];

  const hasActiveFilters = Object.values(filters).some(
    (filter) => filter && filter !== ""
  );

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="relative rounded-full"
      >
        <Filter className="mr-2 h-4 w-4" />
        Filters
        {hasActiveFilters && (
          <Badge
            variant="default"
            className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
          >
            !
          </Badge>
        )}
      </Button>

      {open && (
        <div
          className="fixed inset-0 bg-black/20 z-50 transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full flex flex-col px-2">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Order Filters</h2>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="space-y-2">
              <Label>Order Status</Label>
              <Select
                value={localFilters.status || ""}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select order status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Payment Status</Label>
              <Select
                value={localFilters.paymentStatus || ""}
                onValueChange={(value) =>
                  handleFilterChange("paymentStatus", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent>
                  {paymentStatusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select
                value={localFilters.paymentMethod || ""}
                onValueChange={(value) =>
                  handleFilterChange("paymentMethod", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethodOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Min Amount (₹)</Label>
                <Input
                  type="number"
                  placeholder="Min amount"
                  value={localFilters.minAmount || ""}
                  onChange={(e) =>
                    handleFilterChange("minAmount", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Max Amount (₹)</Label>
                <Input
                  type="number"
                  placeholder="Max amount"
                  value={localFilters.maxAmount || ""}
                  onChange={(e) =>
                    handleFilterChange("maxAmount", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <div className="[&>.react-datepicker-wrapper]:w-full">
                  <DatePicker
                    selected={localFilters.startDate}
                    onChange={(date) => handleDateChange("startDate", date)}
                    placeholderText="Select start date"
                    className="w-full h-10 px-3 py-2 text-sm border rounded-md border-input bg-background"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <div className="[&>.react-datepicker-wrapper]:w-full">
                  <DatePicker
                    selected={localFilters.endDate}
                    onChange={(date) => handleDateChange("endDate", date)}
                    placeholderText="Select end date"
                    popperPlacement="bottom-start"
                    className="w-full h-10 px-3 py-2 text-sm border rounded-md border-input bg-background"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t flex justify-end gap-2">
            <Button variant="outline" onClick={handleResetFilters}>
              Reset
            </Button>
            <Button onClick={handleApplyFilters}>Apply</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderFilters;
