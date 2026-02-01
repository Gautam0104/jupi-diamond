import React from "react";
import { CalendarIcon, Filter, X } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";

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

const UserFilters = ({ filters, handleFilterChangeHook, onApplyFilters }) => {
  const [open, setOpen] = React.useState(false);
  const [localFilters, setLocalFilters] = React.useState({
    startDate: "",
    endDate: "",
    sortBy: "",
    sortOrder: "",
    status: "",
    role: "",
    ...filters,
  });

  React.useEffect(() => {
    setLocalFilters((prev) => ({
      ...prev,
      ...filters,
    }));
  }, [filters]);

  React.useEffect(() => {
    disableBodyScroll(open);
    return () => disableBodyScroll(false);
  }, [open]);

  const handleFilterChange = (name, value) => {
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    const formattedFilters = {
      ...localFilters,
      startDate: localFilters.startDate
        ? new Date(localFilters.startDate).toISOString()
        : "",
      endDate: localFilters.endDate
        ? new Date(localFilters.endDate).toISOString()
        : "",
    };

    Object.entries(formattedFilters).forEach(([key, value]) => {
      handleFilterChangeHook({ target: { name: key, value: value || "" } });
    });

    setOpen(false);
    if (onApplyFilters) onApplyFilters();
  };

  const handleResetFilters = () => {
    const resetFilters = {
      startDate: "",
      endDate: "",
      sortBy: "",
      sortOrder: "",
      status: "",
      role: "",
    };
    setLocalFilters(resetFilters);
    Object.entries(resetFilters).forEach(([name, value]) => {
      handleFilterChangeHook({ target: { name, value } });
    });
    setOpen(false);
  };

  const statusOptions = [
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
    { value: "BANNED", label: "Banned" },
  ];

  const roleOptions = [
    { value: "CUSTOMER", label: "Customer" },
    { value: "RETAILER", label: "Retailer" },
  ];

  const sortByOptions = [
    { value: "createdAt", label: "Created Date" },
    { value: "firstName", label: "First Name" },
    { value: "lastName", label: "Last Name" },
    { value: "email", label: "Email" },
  ];

  const sortOrderOptions = [
    { value: "asc", label: "Ascending" },
    { value: "desc", label: "Descending" },
  ];

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => value && value !== "" && key !== "page"
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
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">User Filters</h2>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="space-y-2">
              <Label>Date Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {localFilters.startDate ? (
                        format(new Date(localFilters.startDate), "PPP")
                      ) : (
                        <span>Start date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        localFilters.startDate
                          ? new Date(localFilters.startDate)
                          : undefined
                      }
                      onSelect={(date) =>
                        handleFilterChange(
                          "startDate",
                          date ? date.toISOString() : ""
                        )
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {localFilters.endDate ? (
                        format(new Date(localFilters.endDate), "PPP")
                      ) : (
                        <span>End date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        localFilters.endDate
                          ? new Date(localFilters.endDate)
                          : undefined
                      }
                      onSelect={(date) =>
                        handleFilterChange(
                          "endDate",
                          date ? date.toISOString() : ""
                        )
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={localFilters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
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
              <Label>Role</Label>
              <Select
                value={localFilters.role}
                onValueChange={(value) => handleFilterChange("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sort By</Label>
              <Select
                value={localFilters.sortBy}
                onValueChange={(value) => handleFilterChange("sortBy", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sort field" />
                </SelectTrigger>
                <SelectContent>
                  {sortByOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sort Order</Label>
              <Select
                value={localFilters.sortOrder}
                onValueChange={(value) =>
                  handleFilterChange("sortOrder", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sort order" />
                </SelectTrigger>
                <SelectContent>
                  {sortOrderOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

export default UserFilters;
