import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

import useFiltration from "../../../Hooks/useFilteration";
import PaginationComponent from "../../../components/PaginationComponent/PaginationComponent";
import DataLoading from "../../../components/Loaders/DataLoading";
import { toast } from "sonner";
import { FiPhoneCall, FiSearch, FiUser, FiX } from "react-icons/fi";
import { delivertTime, getAllOrders } from "../../../api/Admin/OrderApi";
import { Link } from "react-router-dom";
import OrderFilters from "./OrderFilters";
import { format, formatISO } from "date-fns";
import { OrderStatusDialog } from "./OrderStatusDialog";
import { IoPersonCircleOutline } from "react-icons/io5";

const Orders = () => {
  const {
    clearFilters,
    filters,
    handleFilterChangeHook,
    handlePaginationChange,
    debouncedSearch,
  } = useFiltration();

  const [pagination, setPagination] = useState({});
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editingDeliveryId, setEditingDeliveryId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  const currentPage = pagination.page;

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAllOrders({
        page: filters.page || 1,
        search: debouncedSearch,
        limit: filters.pageSize || 10,

        status: filters.status,
        paymentStatus: filters.paymentStatus,
        paymentMethod: filters.paymentMethod,
        minAmount: filters.minAmount,
        maxAmount: filters.maxAmount,
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
      setOrder(response.data.data.order || []);
      console.log(response.data.data.order);

      setPagination(response.data.data.pagination || {});
    } catch (err) {
      console.log(err.message);
      setPagination({});
    } finally {
      setLoading(false);
    }
  };

  const updateExpectedDate = async (orderId) => {
    try {
      if (!selectedDate) {
        toast.warning("Please select a valid date.");
        return;
      }

      const selected = new Date(selectedDate);

      if (isNaN(selected.getTime())) {
        toast.error("Invalid date format.");
        return;
      }

      const now = new Date();
      if (selected <= now) {
        toast.warning("Please select a future date/time.");
        return;
      }

      // Convert to ISO string in Indian timezone
      const indiaISO = formatISO(selected, {
        representation: "complete",
        timeZone: "Asia/Kolkata",
      });

      const data = {
        date: indiaISO,
      };

      const res = await delivertTime(orderId, data);

      if (res?.data?.data) {
        toast.success("Expected delivery date updated successfully!");
        fetchData();
        setEditingDeliveryId(null);
        setSelectedDate("");
      } else {
        toast.error("Failed to update. Please try again.");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchData(filters.page);
  }, [
    debouncedSearch,
    filters.limit,
    filters.page,
    filters.status,
    filters.paymentStatus,
    filters.paymentMethod,
    filters.minAmount,
    filters.maxAmount,
    filters.startDate,
    filters.endDate,
  ]);

  const handlePageChange = (page) => {
    handlePaginationChange(page, filters.pageSize);
  };

  return (
    <div className=" w-full ">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-4">Orders</h2>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-md font-semibold">Orders</p>
          <div className="flex items-center gap-2">
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
              <OrderFilters
                filters={filters}
                handleFilterChangeHook={handleFilterChangeHook}
                clearFilters={clearFilters}
                onApplyFilters={() => fetchData(1)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border ">
        <div className="relative mb-4">
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  "Order Id",
                  "Customer",
                  "Address",
                  "Items",
                  "Coupon",
                  "Pay Method",
                  "Pay Status",
                  "Paid",
                  "Discount Amt",
                  "Total Amt",
                  "Status",
                  "Date",
                  "DELIVERY TIME",
                  "Action",
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
                  <TableCell colSpan={14} className="h-20 text-center">
                    <DataLoading />
                  </TableCell>
                </TableRow>
              ) : order?.length > 0 ? (
                order.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className=" text-center min-w-[190px]">
                      <Link
                        to={`/admin/orders/order-details/${item.id}`}
                        className={` font-medium  cp hover:font-semibold ${
                          item.status === "PENDING" ||
                          item.status === "CONFIRMED" ||
                          item.status === "SHIPPED" ||
                          item.status === "DELIVERED"
                            ? " text-emerald-500"
                            : item.status === "RETURNED"
                            ? " text-yellow-800"
                            : " text-red-500"
                        }`}
                      >
                        {item.orderNumber || "N/A"}
                      </Link>
                    </TableCell>

                    <TableCell className="text-center min-w-[140px]">
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1">
                          <IoPersonCircleOutline />
                          <span>
                            {item.customer?.firstName || "N/A"}{" "}
                            {item.customer?.lastName || "N/A"}
                          </span>
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <FiPhoneCall />
                          {item.customer?.phone || "N/A"}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="min-w-[160px] ">
                      <div className="flex flex-col text-left">
                        {item.addressSnapshot?.houseNo || "N/A"}{" "}
                        {item.addressSnapshot?.street || "N/A"}
                        <span className="text-xs">
                          {item.addressSnapshot?.city || "N/A"},{" "}
                          {item.addressSnapshot?.state || "N/A"} -{" "}
                          {item.addressSnapshot?.postalCode || "N/A"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col">
                        {item.orderItems?.length}
                      </div>
                    </TableCell>
                    <TableCell className="text-center min-w-[180px]">
                      {item?.code ? (
                        <span className="text-sm font-medium">
                          {item?.code || "N/A"}{" "}
                          <span className="text-emerald-500">
                            ( {item?.discountType === "FIXED" && "₹"}
                            {item?.discountValue?.toLocaleString("en-IN")}
                            {item?.discountType === "PERCENTAGE" && "%"})
                          </span>
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">N/A</span>
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          item.paymentMethod === "RAZORPAY"
                            ? "bg-purple-100 text-purple-800"
                            : item.paymentMethod === "PAYPAL"
                            ? "bg-blue-100 text-blue-800"
                            : item.paymentMethod === "COD"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.paymentMethod || "N/A"}
                      </span>
                    </TableCell>

                    <TableCell className="text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          item.paymentStatus === "SUCCESS"
                            ? "bg-green-100 text-green-800"
                            : item.paymentStatus === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : item.paymentStatus === "FAILED"
                            ? "bg-red-100 text-red-800"
                            : item.paymentStatus === "REFUNDED"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.paymentStatus || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          item.isPaid
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.isPaid ? "Yes" : "No"}
                      </span>
                    </TableCell>

                    <TableCell className="text-center">
                      {item.discountAmount
                        ? `₹${item.discountAmount.toFixed(2)}`
                        : "N/A"}
                    </TableCell>

                    <TableCell className="text-center font-medium">
                      {item.paymentStatus === "SUCCESS" ? (
                        <span className="text-green-500">
                          {item.finalAmount
                            ? `${
                                item.orderCurrency === "USD" ? "$" : "₹"
                              }${item.finalAmount.toFixed(2)}`
                            : "N/A"}
                        </span>
                      ) : item.finalAmount ? (
                        `${
                          item.orderCurrency === "USD" ? "$" : "₹"
                        }${item.finalAmount.toFixed(2)}`
                      ) : (
                        "N/A"
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            item.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : item.status === "CONFIRMED"
                              ? "bg-blue-100 text-blue-800"
                              : item.status === "SHIPPED"
                              ? "bg-indigo-100 text-indigo-800"
                              : item.status === "DELIVERED"
                              ? "bg-green-100 text-green-800"
                              : item.status === "CANCELLED"
                              ? "bg-red-100 text-red-800"
                              : item.status === "RETURN_REQUESTED"
                              ? "bg-orange-100 text-orange-800"
                              : item.status === "RETURN_APPROVED"
                              ? "bg-green-100 text-green-800"
                              : item.status === "RETURNED"
                              ? "bg-purple-100 text-purple-800"
                              : item.status === "REFUNDED"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {item.status || "N/A"}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-center min-w-[120px]">
                      {item.createdAt
                        ? format(
                            new Date(item.createdAt),
                            "dd MMMM yyyy hh:mm a"
                          )
                        : "N/A"}
                    </TableCell>

                    {/* Expected delivery time */}
                    <TableCell className="text-center min-w-[180px]">
                      {item?.expectedDeliveryDate ? (
                        // ✅ Always show if already set
                        format(
                          new Date(item.expectedDeliveryDate),
                          "dd MMMM yyyy hh:mm a"
                        )
                      ) : ["PENDING", "CONFIRMED", "SHIPPED"].includes(
                          item.status
                        ) ? (
                        editingDeliveryId === item.id ? (
                          <div className="flex flex-col items-center gap-1">
                            <input
                              type="datetime-local"
                              className="border rounded px-2 py-1 text-sm"
                              onChange={(e) => {
                                const selected = new Date(e.target.value);
                                const now = new Date();
                                if (selected > now) {
                                  setSelectedDate(e.target.value);
                                } else {
                                  toast.error("Please select a future date.");
                                  setSelectedDate("");
                                }
                              }}
                            />
                            <div className="flex gap-2">
                              <button
                                className="bg-blue-500 text-white px-2 py-1 text-xs rounded"
                                disabled={!selectedDate}
                                onClick={() => updateExpectedDate(item.id)}
                              >
                                Update
                              </button>
                              <button
                                className="bg-gray-300 text-gray-800 px-2 py-1 text-xs rounded"
                                onClick={() => {
                                  setEditingDeliveryId(null);
                                  setSelectedDate("");
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-1 text-sm">
                            <span className="text-red-600">Not set</span>
                            <button
                              className="text-blue-500 underline"
                              onClick={() => {
                                setEditingDeliveryId(item.id);
                                setSelectedDate("");
                              }}
                            >
                              Set Expected Delivery
                            </button>
                          </div>
                        )
                      ) : (
                        <span className="text-gray-500 text-sm">--</span>
                      )}
                    </TableCell>

                    <TableCell className="text-center min-w-[120px]">
                      <OrderStatusDialog
                        orderId={item.id}
                        currentStatus={item.status}
                        onStatusUpdate={fetchData}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={13} className="h-24 text-center">
                    <div className="flex justify-center items-center">
                      <span className="text-gray-500">No Orders Available</span>
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

export default Orders;
