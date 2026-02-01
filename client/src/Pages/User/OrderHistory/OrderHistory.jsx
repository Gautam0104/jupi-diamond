import React, { useContext, useEffect, useState } from "react";
import { fetchOrdersByUser } from "../../../api/Public/publicApi";
import useAuth from "../../../Hooks/useAuth";
import ReviewDialog from "./ReviewDialog";
import { IoStar } from "react-icons/io5";
import useFiltration from "../../../Hooks/useFilteration";
import { CurrencyContext } from "../../../Context/CurrencyContext";
import OrderHistorySkeleton from "./OrderHistorySkeleton";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import { FaRegImage } from "react-icons/fa6";
import ReturnOrderDialog from "./OrderReturnDialog";
import { customerOrderReturn } from "../../../api/User/returnOrderApi";

const OrderCard = ({ order, displayPrice, fetchOrders  }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const orderStatusOptions = [
    { value: "PENDING", label: "Pending", color: "text-yellow-600" },
    { value: "CONFIRMED", label: "Confirmed", color: "text-blue-600" },
    { value: "SHIPPED", label: "Shipped", color: "text-purple-600" },
    { value: "DELIVERED", label: "Delivered", color: "text-green-600" },
    { value: "CANCELLED", label: "Cancelled", color: "text-red-600" },
    {
      value: "RETURN_REQUESTED",
      label: "Return Requested",
      color: "text-orange-600",
    },
    {
      value: "RETURN_APPROVED",
      label: "Return Approved",
      color: "text-blue-400",
    },
    { value: "RETURNED", label: "Returned", color: "text-yellow-600" },
    { value: "REFUNDED", label: "Refunded", color: "text-teal-600" },
  ];

  const getStatusText = (status) => {
    const option = orderStatusOptions.find((opt) => opt.value === status);
    return option ? option.label : status;
  };

  const getStatusColor = (status) => {
    const option = orderStatusOptions.find((opt) => opt.value === status);
    return option ? option.color : "text-gray-600";
  };
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [selectedOrderItem, setSelectedOrderItem] = useState(null);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);

  const handleReviewClick = (orderItem) => {
    setSelectedOrderItem(orderItem);
    setIsReviewDialogOpen(true);
  };




  return (
    <>
      <div className="hidden lg:block mx-auto border-b border-brown shadow  bg-white text-[#1c1e22] mb-4">
        {/* Top Summary Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 py-3 border-b bg-[#F1EEEE] text-xs md:text-[8px] lg:text-xs xl:text-sm gap-4 sm:gap-0">
          <div>
            <p className="text-gray-500">ORDER PLACED</p>
            <p className="font-medium">{formatDate(order.createdAt)}</p>
          </div>
          <div>
            <p className="text-gray-500">TOTAL</p>
            <p className="font-medium">{displayPrice(order.finalAmount)}</p>
          </div>
          <div>
            <p className="text-gray-500">SHIP TO</p>
            <p className="font-medium">
              {order.customer?.firstName} {order.customer?.lastName}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-500">ORDER #{order.orderNumber}</p>
            <p
              className={`${getStatusColor(
                order.status
              )} font-medium text-start sm:text-center`}
            >
              {getStatusText(order.status)}
            </p>
          </div>
        </div>

        {/* Product Items */}
        {order.orderItems.map((item, index) => (
          <Link
            to={`/user/order-history/${order.id}`}
            key={index}
            className="flex flex-col md:flex-row  gap-4 p-4 border-b last:border-b-0"
          >
            {item.imageUrl === null ? (
              <div className="flex items-center bg-gray-200 w-20 h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 justify-center  border-2 border-dashed border-gray-300  aspect-square">
                <span className="text-gray-400 font-semibold text-lg sm:text-xl">
                  <FaRegImage />
                </span>
              </div>
            ) : item?.imageUrl?.toLowerCase().endsWith(".mp4") ||
              item?.imageUrl?.toLowerCase().endsWith(".mov") ? (
              <video
                src={item?.imageUrl}
                className="w-20 h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 object-fill bg-gray-100"
                muted
                autoPlay
                loop
                playsInline
              />
            ) : (
              <img
                src={item?.imageUrl || "/placeholder-product.png"}
                alt={item?.productName || "Product"}
                className="w-20 h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 object-fill bg-gray-100"
              />
            )}

            <div className="flex-1 ">
              <h2 className="font-normal text-xs md:text-sm xl:text-sm max-w-xs ">
                {item?.productName}
              </h2>

              <div className="flex flex-row sm:flex-row items-start sm:items-center justify-between gap-2 mt-2">
                <div>
                  <div className="mt-2 text-xs text-gray-500">
                    Quantity: {item.quantity}
                  </div>
                  <div className="text-xs md:text-sm xl:text-sm font-medium mt-1">
                    Price: {displayPrice(item.total)}
                  </div>
                </div>

                {/* <div>
                  <p
                    className={`${getStatusColor(
                      item.status
                    )} font-medium text-start sm:text-center`}
                  >
                    {getStatusText(item.status)}
                  </p>
                </div> */}

                {/* Rating */}
                {item.ProductReview ? (
                  <div className="flex flex-col items-center gap-1 mt-3">
                    <div className="flex items-center gap-1">
                      {[...Array(item.ProductReview?.rating || 0)].map(
                        (_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 fill-yellow-400 text-yellow-400"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 .587l3.668 7.431L24 9.748l-6 5.848L19.335 24 12 19.897 4.665 24 6 15.596 0 9.748l8.332-1.73z" />
                          </svg>
                        )
                      )}
                    </div>
                    <span className="text-xs text-gray-500">Your Review</span>
                  </div>
                ) : (
                  order.status === "DELIVERED" && (
                    <div className="flex flex-col items-center gap-1 mt-3 text-gray-400">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 fill-current"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M12 .587l3.668 7.431L24 9.748l-6 5.848L19.335 24 12 19.897 4.665 24 6 15.596 0 9.748l8.332-1.73z" />
                          </svg>
                        ))}
                      </div>
                      <button
                        className="text-xs text-gray-500 hover:text-gray-700 cp"
                        onClick={(e) => {
                          e.preventDefault();
                          handleReviewClick(item);
                        }}
                      >
                        Rate & Review
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          </Link>
        ))}

        {order.status === "DELIVERED" && !order.returnStatus && (
          <div className="px-4 py-2 text-right">
            <button
              onClick={() => setIsReturnDialogOpen(true)}
              className="bg-red-100 text-red-600 hover:bg-red-200 text-sm px-4 py-2 rounded"
            >
              Return this Order
            </button>
          </div>
        )}


      </div>





      {/* Mobile */}
      <div className="block lg:hidden mx-auto border-b border-brown  shadow overflow-hidden bg-white mb-4">
        {/* Order Header */}
        <div className="bg-[#F1EEEE] p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500">
              ORDER #{order.orderNumber}
            </span>

            <span
              className={`${getStatusColor(
                order.status
              )} text-xs  rounded-full`}
            >
              {getStatusText(order.status)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <div>
              <p className="text-gray-500 text-xs">Date</p>
              <p className="font-medium text-xs">
                {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-xs">Total</p>
              <p className="font-medium text-xs">
                {displayPrice(order.finalAmount)}
              </p>
            </div>
          </div>
        </div>

        {/* Product Items */}
        <Link
          to={`/user/order-history/${order.id}`}
          className="divide-y divide-gray-100"
        >
          {order.orderItems.map((item, index) => (
            <div key={index} className="p-4 flex gap-3">
              <div className="flex-shrink-0">
                {item.imageUrl === null ? (
                  <div className="flex items-center bg-gray-200 w-20 h-20 justify-center rounded-md border-2 border-dashed border-gray-300  aspect-square">
                    <span className="text-gray-400 font-semibold text-lg sm:text-xl">
                      <FaRegImage />
                    </span>
                  </div>
                ) : item?.imageUrl?.toLowerCase().endsWith(".mp4") ||
                  item?.imageUrl?.toLowerCase().endsWith(".mov") ? (
                  <video
                    src={item?.imageUrl}
                    className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                    muted
                    autoPlay
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src={item?.imageUrl || "/placeholder-product.png"}
                    alt={item?.productVariant?.productVariantTitle || "Product"}
                    className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                  />
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-medium text-xs sm:text-sm line-clamp-2">
                  {item?.productName}
                </h3>
                <div className="mt-1 text-[10px] sm:text-xs text-gray-500">
                  Qty: {item.quantity}
                </div>
                <div className="mt-1 text-xs sm:text-sm font-medium">
                  {displayPrice(item.total)}
                </div>

                {item.ProductReview ? (
                  <div className="mt-2 flex items-center">
                    <div className="flex">
                      {[...Array(item.ProductReview?.rating || 0)].map(
                        (_, i) => (
                          <StarIcon
                            key={i}
                            className="h-4 w-4 text-yellow-400"
                          />
                        )
                      )}
                    </div>
                    <span className="ml-1 text-xs text-gray-500">Reviewed</span>
                  </div>
                ) : (
                  order.paymentStatus === "SUCCESS" && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleReviewClick(item);
                      }}
                      className="mt-2 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-full flex items-center"
                    >
                      <StarIcon className="h-3 w-3 mr-1" />
                      Rate Product
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
        </Link>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            <span className="font-medium text-black">Shipped to:</span>{" "}
            {order.customer?.firstName} {order.customer?.lastName}
          </div>
        </div>
      </div>

      {selectedOrderItem && (
        <ReviewDialog
          open={isReviewDialogOpen}
          onOpenChange={setIsReviewDialogOpen}
          orderItemId={selectedOrderItem.id}
   
          customerId={order.customerId}
          productVariantId={selectedOrderItem.productVariantId}
        />
      )}

      <ReturnOrderDialog
        open={isReturnDialogOpen}
        onClose={() => setIsReturnDialogOpen(false)}
      onSuccess={fetchOrders} 
        orderId={order.id}
      />

    </>
  );
};

const StarIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 .587l3.668 7.431L24 9.748l-6 5.848L19.335 24 12 19.897 4.665 24 6 15.596 0 9.748l8.332-1.73z" />
  </svg>
);

export default function OrderHistory() {
  const { convertPrice, currency, getCurrencySymbol } =
    useContext(CurrencyContext);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const {
    clearFilters,
    filters,
    handleFilterChangeHook,
    handlePaginationChange,
    debouncedSearch,
  } = useFiltration({
    initialFilters: {
      status: "ALL",
    },
  });

  const displayPrice = (price) => {
    return `${getCurrencySymbol(currency)}${convertPrice(price).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  const orderStatusOptions = [
    { value: "ALL", label: "All Orders" },
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

  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchOrdersByUser({
        status: filters.status === "ALL" ? undefined : filters.status,
        search: debouncedSearch,
      });

      
      setOrderHistory(response.data.data);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [debouncedSearch, filters.status]);

  const handleStatusChange = (e) => {
    handleFilterChangeHook({
      target: {
        name: "status",
        value: e.target.value,
      },
    });
  };

  const handleSearchClick = () => {
    fetchData();
  };





  return (
    <div className="max-w-4xl ">
      <div className="flex justify-between items-center mb-4  ">
        <h2 className="text-lg font-medium">Orders</h2>
        <div className="relative">
          <select
            name="status"
            value={filters.status}
            onChange={handleStatusChange}
            className="appearance-none bg-white text-black border border-gray-300  pl-3 pr-8 py-2 text-xs sm:text-sm focus:outline-none "
          >
            {orderStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className=" h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="#000"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="w-full mx-auto shadow-md mb-4">
        <div className="flex items-center bg-white ">
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChangeHook}
            autoComplete="off"
            placeholder="Search your orders here"
            className="w-full px-4 py-2 text-xs sm:text-base text-black placeholder-[#C68B73] focus:outline-none rounded-l-lg"
          />
          <button
            onClick={handleSearchClick}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 text-xs sm:text-base text-[#C68B73] border-2 border-[#C68B73] hover:bg-[#C68B73] hover:text-white transition-colors duration-300 ease-in-out "
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {loading ? (
        <OrderHistorySkeleton />
      ) : orderHistory.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p>No orders found for this status</p>
        </div>
      ) : (
        orderHistory.map((order) => (
          <OrderCard displayPrice={displayPrice} key={order.id} order={order} fetchOrders={fetchData} />
        ))
      )}






    </div>
  );
}
