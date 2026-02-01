import { useEffect, useRef, useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

import { Switch } from "../../../components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { PiUserDuotone } from "react-icons/pi";
import useFiltration from "../../../Hooks/useFilteration";
import PaginationComponent from "../../../components/PaginationComponent/PaginationComponent";
import DataLoading from "../../../components/Loaders/DataLoading";
import { toast } from "sonner";
import { fetchUser } from "../../../api/Admin/UserApi";
import { FiSearch, FiUser, FiX } from "react-icons/fi";
import UserFilters from "../../../components/UserFilters/UserFilters";

const UserManagement = () => {
  const {
    clearFilters,
    filters,
    handleFilterChangeHook,
    handlePaginationChange,
    debouncedSearch,
  } = useFiltration();
  // Add this at the top of your component
  const scrollContainerRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300; // Adjust this value as needed
      if (direction === "left") {
        scrollContainerRef.current.scrollLeft -= scrollAmount;
      } else {
        scrollContainerRef.current.scrollLeft += scrollAmount;
      }
    }
  };

  const [pagination, setPagination] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentPage = pagination.page;

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetchUser({
        page: filters.page || 1,
        limit: 10,
        search: debouncedSearch,
        startDate: filters.startDate,
        endDate: filters.endDate,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        status: filters.status,
        role: filters.role,
      });
      setUsers(response.data.customer || []);
      setPagination(response.data.pagination || {});
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to fetch user");
      setUsers([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(filters.page);
  }, [
    debouncedSearch,
    filters.page,
    filters.limit,
    filters.startDate,
    filters.endDate,
    filters.sortBy,
    filters.sortOrder,
    filters.status,
    filters.role,
  ]);

  const handlePageChange = (page) => {
    handlePaginationChange(page, filters.pageSize);
  };

  return (
    <div className=" w-full ">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-4">User Management</h2>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-md font-semibold">Users</p>
          <div className="flex items-center gap-2">
            <div className="relative flex items-center w-full max-w-[250px]">
              <div className="absolute left-3 text-gray-400">
                <FiSearch className="w-5 h-5" />
              </div>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChangeHook}
                placeholder="Search ..."
                autoComplete="off"
                className="w-full py-2 pl-10 text-sm pr-10 text-gray-700 bg-white shadow-md rounded-full focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500"
              />
              {filters.search && (
                <button
                  onClick={clearFilters}
                  className="absolute right-3 text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}
            </div>

            <UserFilters
              filters={filters}
              handleFilterChangeHook={handleFilterChangeHook}
              onApplyFilters={() => fetchData(1)} // Reset to page 1 when applying new filters
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border ">
        <div className="relative mb-4">
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  "Profile",
                  "Number",
                  "Email",
                  "Gender",
                  "Role",
                  "Status",
                  "Actions",
                ].map((header) => (
                  <TableHead
                    key={header}
                    className="whitespace-nowrap text-center"
                  >
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-20 text-center">
                    <DataLoading />
                  </TableCell>
                </TableRow>
              ) : users?.length > 0 ? (
                users.map((item, index) => (
                  <TableRow key={index} className="">
                    <TableCell className="min-w-[160px] ">
                      <div className="flex items-center gap-2">
                        {item.profileImage ? (
                          <img
                            src={item.profileImage}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => (e.target.style.display = "none")}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-700 font-medium">
                              {item.firstName?.[0]?.toUpperCase()}
                              {item.lastName?.[0]?.toUpperCase()}
                            </span>
                          </div>
                        )}
                        {item.firstName} {item.lastName || ""}
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      {item.phone || "N/A"}
                    </TableCell>
                    <TableCell className="min-w-[100px] ">
                      {item.email || "N/A"}
                    </TableCell>
                    <TableCell className="min-w-[120px] text-center">
                      {item.gender || "N/A"}
                    </TableCell>
                    <TableCell className=" flex flex-col items-center justify-center">
                      {item.role}
                    </TableCell>

                    <TableCell className="text-center">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                          item.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : item.status === "INACTIVE"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status === "ACTIVE"
                          ? "Active"
                          : item.status === "INACTIVE"
                          ? "Inactive"
                          : "Banned"}
                      </span>
                    </TableCell>

                    <TableCell className=" flex items-center justify-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="text-[10px] md:text-xs "
                            variant="edit"
                          >
                            View
                          </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[750px] p-4 bg-gradient-to-b from-gray-50 to-white rounded-xl shadow-lg">
                          <DialogHeader className="mb-4">
                            <DialogTitle className="text-lg font-semibold text-gray-800">
                              User Profile
                            </DialogTitle>
                            <DialogDescription className="text-xs text-gray-500">
                              Detailed user information
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                              {item.profileImage ? (
                                <img
                                  src={item.profileImage}
                                  alt="Profile"
                                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-300 transition-transform hover:scale-105 focus:scale-105"
                                  onError={(e) =>
                                    (e.target.style.display = "none")
                                  }
                                />
                              ) : (
                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-300">
                                  <PiUserDuotone className="w-10 h-10 text-gray-400" />
                                </div>
                              )}
                              <div className="flex-1">
                                <h3 className="text-base font-semibold text-gray-800">
                                  {item.firstName} {item.lastName}
                                </h3>
                                <p className="text-xs text-gray-500">
                                  {item.email}
                                </p>
                                <div className="flex gap-2 mt-1">
                                  <span
                                    className={`text-xs px-2 py-1 font-medium tracking-wide rounded-full ${
                                      item.status === "ACTIVE"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                                  >
                                    {item.status}
                                  </span>
                                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                                    {item.role}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="w-28 text-xs font-semibold text-gray-700">
                                    Phone:
                                  </span>
                                  <span className="text-xs text-gray-600">
                                    {item.phone}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="w-28 text-xs font-semibold text-gray-700">
                                    Alternate Phone:
                                  </span>
                                  <span className="text-xs text-gray-600">
                                    {item.alternatePhone || "N/A"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="w-28 text-xs font-semibold text-gray-700">
                                    Gender:
                                  </span>
                                  <span className="text-xs text-gray-600">
                                    {item.gender || "N/A"}
                                  </span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="w-28 text-xs font-semibold text-gray-700">
                                    Date of Birth:
                                  </span>
                                  <span className="text-xs text-gray-600">
                                    {item.dob
                                      ? new Date(item.dob)
                                          .toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                          })
                                          .replace(/ /g, "-")
                                      : "N/A"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="w-28 text-xs font-semibold text-gray-700">
                                    Bio:
                                  </span>
                                  <span className="text-xs text-gray-600 truncate">
                                    {item.bio || "N/A"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="border-t border-gray-200 pt-3">
                              <h4 className="text-sm font-semibold text-gray-800 mb-3">
                                Addresses
                              </h4>
                              {item.address && item.address.length > 0 ? (
                                <div className="relative w-auto max-w-[300px] sm:max-w-[700px]">
                                  <div
                                    ref={scrollContainerRef}
                                    className="flex gap-3 overflow-x-auto pb-2 snap-x hide-scrollbar"
                                    style={{ scrollBehavior: "smooth" }}
                                  >
                                    {item.address.map((addr, idx) => (
                                      <div
                                        key={addr.id}
                                        className="p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all focus-within:border-gray-300 snap-start min-w-[250px] max-w-[300px] flex-shrink-0"
                                        tabIndex={0}
                                      >
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                          <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold text-gray-700">
                                              Address {idx + 1}
                                            </span>
                                            <span
                                              className={`text-xs px-1.5 py-0.5 rounded-full ${
                                                addr.isBilling
                                                  ? "bg-yellow-100 text-yellow-700"
                                                  : "bg-gray-100 text-gray-700"
                                              }`}
                                            >
                                              {addr.isBilling
                                                ? "Billing"
                                                : "Non-Billing"}
                                            </span>
                                          </div>
                                          <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-black">
                                            {addr.addressType}
                                          </span>
                                        </div>
                                        <p className="text-xs text-gray-600">
                                          {addr.houseNo}, {addr.street},{" "}
                                          {addr.city}, {addr.state},{" "}
                                          {addr.country}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                          <strong>Postal Code:</strong>{" "}
                                          {addr.postalCode}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          <strong>Landmark:</strong>{" "}
                                          {addr.landMark || "N/A"}
                                        </p>
                                      </div>
                                    ))}
                                  </div>

                                  {item.address.length > 2 && (
                                    <div className="flex justify-between mt-2">
                                      <button
                                        onClick={() => handleScroll("left")}
                                        className="p-1 bg-gray-100 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                        aria-label="Scroll left"
                                      >
                                        <svg
                                          className="w-4 h-4 text-gray-600"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15 19l-7-7 7-7"
                                          />
                                        </svg>
                                      </button>
                                      <button
                                        onClick={() => handleScroll("right")}
                                        className="p-1 bg-gray-100 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                                        aria-label="Scroll right"
                                      >
                                        <svg
                                          className="w-4 h-4 text-gray-600"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 5l7 7-7 7"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <p className="text-xs text-gray-500">
                                  No addresses available
                                </p>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <div className="flex justify-center items-center">
                      <span className="text-gray-500">No Data Available</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="p-2 md:p-4 border-t">
          <PaginationComponent
            currentPage={Number(pagination.currentPage || filters.page)}
            totalPages={Number(pagination.totalPages)}
            onPageChange={handlePageChange}
            pageSize={Number(filters.pageSize)}
          />
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
