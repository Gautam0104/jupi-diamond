import React, { useContext, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getOrderById } from "../../../api/Admin/OrderApi";
import { Link, useNavigate, useParams } from "react-router-dom";
import OrderStatusTracker from "./OrderStatusTracker";
import { format } from "date-fns";
import { Skeleton } from "../../../components/ui/skeleton";
import { CurrencyContext } from "../../../Context/CurrencyContext";
import { cancelCustomerOrder } from "../../../api/Public/publicApi";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Textarea } from "../../../components/ui/textarea";
import { FaRegImage } from "react-icons/fa6";

const OrderHistoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const { convertPrice, currency, getCurrencySymbol } =
    useContext(CurrencyContext);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelledReason, setCancelledReason] = useState("");
  const [currentItemToCancel, setCurrentItemToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const displayPrice = (price) => {
    return `${getCurrencySymbol(currency)}${convertPrice(price).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const response = await getOrderById(id);
        console.log(response);

        setOrderDetail(response.data.data);
      } catch (error) {
        console.log("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
    window.scrollTo(0, 0);
  }, [id, navigate]);

  const handleCancelClick = (orderItem) => {
    setCurrentItemToCancel(orderItem);
    setIsCancelModalOpen(true);
  };

  const handleCancelOrder = async () => {
    if (!cancelledReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }

    setIsCancelling(true);
    try {
      console.log(currentItemToCancel);

      await cancelCustomerOrder(currentItemToCancel.id, cancelledReason);
      toast.success("Order item cancelled successfully");
      // Refresh order details
      const response = await getOrderById(id);
      setOrderDetail(response.data.data);
      setIsCancelModalOpen(false);
      setCancelledReason("");
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error(error.response?.data?.message || "Failed to cancel order");
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading || !orderDetail) {
    return (
      <div className="p-4 sm:p-6 shadow-md rounded-sm max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-10 !px-0">
          <div className="w-full flex flex-col gap-6 md:w-2/3">
            {[...Array(2)].map((_, index) => (
              <div key={index} className="flex items-start gap-4">
                <Skeleton className="w-20 sm:w-24 h-20 sm:h-24 rounded-md" />
                <div className="space-y-2 w-full">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-3 w-1/4 mt-2" />
                </div>
              </div>
            ))}
          </div>

          <div className="w-full md:w-1/3 sm:border-l-2 sm:pl-6">
            <Skeleton className="h-6 w-1/3 mb-4" />
            <div className="space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>

              <Skeleton className="h-px w-full my-2" />

              <div className="flex justify-between">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-5 w-1/4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const OrderStatusCard = () => {
    return (
      <div className="p-4 sm:p-6 shadow-md rounded-sm max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="w-full md:w-1/2 border-r-2">
            <h2 className="text-md sm:text-lg font-semibold mb-2">
              Delivery Address
            </h2>
            <p className="font-bold">{`${orderDetail.customer.firstName} ${orderDetail.customer.lastName}`}</p>
            {orderDetail?.address && (
              <>
                <p className="text-xs sm:text-sm my-1 sm:mt-1 font-semibold">
                  Shipping Address
                </p>

                <p className="text-xs sm:text-sm">
                  {`${orderDetail?.address?.houseNo}, ${orderDetail?.address?.street}, ${orderDetail?.address?.landMark}, ${orderDetail?.address?.city}, ${orderDetail?.address?.state}, ${orderDetail?.address?.country}`}
                </p>
              </>
            )}
            <p className="text-xs sm:text-sm mt-2 font-semibold">
              Phone number -{" "}
              <span className="font-normal">
                {orderDetail?.customer?.phone}
              </span>
            </p>
          </div>

          {/* Right Section: Progress Tracker */}
          <div className="w-full md:w-1/2 ">
            <OrderStatusTracker
              historyStatus={orderDetail?.OrderStatusHistory}
            />

            {/* Status Message */}
            <p className="text-xs sm:text-sm lg:text-xs xl:text-sm text-center mb-4 text-muted-foreground mt-2">
              {orderDetail.status === "REFUNDED"
                ? "Your refund has been processed."
                : `Your order is currently ${orderDetail.status.toLowerCase()}.`}
            </p>

            {/* Buttons */}
            <div className="flex justify-end ">
              <>
                <Link to={`/track-order/${orderDetail.orderNumber}`}>
                  <Button
                    variant="edit"
                    className="text-xs border-2 border-gray-300 hover:bg-gray-100"
                  >
                    Track your Order
                  </Button>
                </Link>
              </>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const OrderDetailsCard = () => {
    return (
      <div className="p-4 sm:p-6 shadow-md rounded-sm max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-10 !px-0">
          {/* Left: Order Items */}
          <div className="w-full flex flex-col gap-6 md:w-2/3">
            {orderDetail.orderItems.map((item, index) => (
              <div key={index} className="flex items-start gap-4 w-full">
                {item.imageUrl.length === 0 ? (
                  <div className="flex items-center bg-gray-200 justify-center w-20 sm:w-24 h-20 sm:h-24  border-2 border-dashed border-gray-300 ">
                    <span className="text-gray-400 font-semibold text-lg sm:text-xl">
                      <FaRegImage />
                    </span>
                  </div>
                ) : item.imageUrl.endsWith(".mp4") ? (
                  <video
                    src={item.imageUrl}
                    className="w-20 sm:w-24 h-20 sm:h-24 object-cover rounded-md border"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-20 sm:w-24 h-20 sm:h-24 object-cover rounded-md border"
                  />
                )}
                <div className="w-full">
                  <div className="flex flex-row items-start justify-between w-full">
                    <h3 className="text-xs sm:text-sm font-medium max-w-xs ">
                      {item.productName}
                    </h3>
                    {/* <p>
                      <span className="text-xs bg-sky-100  px-2 py-1 rounded-sm text-sky-800">
                        {item.status}
                      </span>
                    </p> */}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Gross weight - {item.grossWeight}g
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Qty. - {item.quantity}
                  </p>
                  <div className="flex flex-col md:flex-row gap-2 items-start justify-between w-full">
                    <p className="text-xs sm:text-sm font-semibold mt-2">
                      Price - {displayPrice(item.priceAtPurchase)}
                    </p>
                    {/* {item.status === "PENDING" ||
                      item.status === "CANCELLED" ? (
                      <Button
                        className="bg-red-200 w-full sm:w-auto rounded text-red-800 hover:bg-red-500 hover:text-white text-xs transition-colors duration-300 ease-in-out"
                        size="sm"
                        onClick={() => handleCancelClick(item)}
                      >
                        Cancel Order
                      </Button>
                    ) : null} */}
                  </div>
                </div>
              </div>
            ))}

            {Array.isArray(orderDetail?.returnRequest) &&
              orderDetail?.returnRequest.length > 0 &&
              orderDetail.returnRequest.map((val, idx) => (
                <div className="bg-gray-50 p-2 rounded-md shadow-sm mt-2 text-sm">
                  <div
                    key={idx}
                    className="mb-2 border-l-2 border-yellow-400 pl-2"
                  >
                    <p className="font-semibold text-gray-700 mb-1">
                      🔁 Return Request
                    </p>
                    <p className="text-gray-600 mb-0.5">
                      <span className="font-medium">Reason:</span> {val?.reason}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Status:</span>{" "}
                      <span
                        className={
                          val?.isApproved
                            ? "text-green-600 font-semibold"
                            : "text-red-600 font-semibold"
                        }
                      >
                        {val?.isApproved ? "Approved" : "Pending"}
                      </span>
                    </p>
                    {Array.isArray(val.photos) && val.photos.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {val.photos.map((photo, i) => (
                          <img
                            key={i}
                            src={photo}
                            alt={`Return photo ${i + 1}`}
                            className="w-16 h-16 object-cover rounded border border-gray-300"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>

          <p>
            <span className="text-xs bg-sky-100  px-2 py-1 rounded-sm text-sky-800">
              {orderDetail.status}
            </span>
          </p>

          {(orderDetail.status === "PENDING" ||
            orderDetail.status === "CONFIRMED") && (
            <Button
              className="bg-red-200 w-full sm:w-auto rounded text-red-800 hover:bg-red-500 hover:text-white text-xs transition-colors duration-300 ease-in-out"
              size="sm"
              onClick={() => handleCancelClick(orderDetail)}
            >
              Cancel Order
            </Button>
          )}

          {/* Right: Order Summary */}
          <div className="w-full md:w-1/3 sm:border-l-2 sm:pl-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between font-semibold">
                <span>Order Status</span>
                <span className="">{orderDetail.status}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Status</span>
                <span className="font-medium">{orderDetail.paymentStatus}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method</span>
                <span className="font-medium">{orderDetail.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Paid At</span>
                <span className="font-medium">
                  {orderDetail?.paymentHistory?.paidAt
                    ? format(
                        new Date(orderDetail.paymentHistory.paidAt),
                        "dd MMM yyyy, hh:mm a"
                      )
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span> {displayPrice(orderDetail.finalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST</span>
                <span>{displayPrice(orderDetail.gstAmount)}</span>
              </div>
              {orderDetail?.discountValue && (
                <div className="flex justify-between font-semibold">
                  <span>Coupon Discount</span>
                  <span>-{displayPrice(orderDetail.discountValue)}</span>
                </div>
              )}

              {orderDetail?.giftCard?.value && (
                <div className="flex justify-between font-semibold">
                  <span>Gift Discount</span>
                  <span>-{displayPrice(orderDetail.giftCard.value)}</span>
                </div>
              )}

              <div className="flex justify-between font-semibold">
                <span>Discount</span>
                <span>- {displayPrice(orderDetail.discountAmount)}</span>
              </div>

              <hr className="my-2" />
              <div className="flex justify-between text-sm sm:text-base font-bold">
                <span>Total Amount</span>
                <span>{displayPrice(orderDetail.finalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="p-4 md:p-10 space-y-4">
      <OrderStatusCard />
      <OrderDetailsCard />

      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={"text-md sm:text-lg"}>
              Cancel Order Item
            </DialogTitle>
            <DialogDescription
              className={"text-xs sm:text-sm lg:text-xs xl:text-sm"}
            >
              Are you sure you want to cancel this order item? Please provide a
              reason for cancellation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {currentItemToCancel?.orderItems?.length > 0 &&
              currentItemToCancel.orderItems.map((item, index) => (
                <div key={index} className="flex items-center gap-3 mb-3">
                  {item?.imageUrl?.length === 0 || !item?.imageUrl ? (
                    <div className="flex items-center bg-gray-200 justify-center w-12 h-12 border-2 border-dashed border-gray-300">
                      <span className="text-gray-400 font-semibold text-lg sm:text-xl">
                        <FaRegImage />
                      </span>
                    </div>
                  ) : item.imageUrl.endsWith(".mp4") ? (
                    <video
                      src={item.imageUrl}
                      className="w-12 h-12 object-cover rounded-md border"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={item.imageUrl}
                      alt={item.productName || "Product Image"}
                      className="w-12 h-12 object-cover rounded-md border"
                    />
                  )}
                  <div>
                    <p className="font-medium text-xs sm:text-sm lg:text-xs xl:text-sm">
                      {item.productName || "Unnamed Product"}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      Qty: {item.quantity || 1}
                    </p>
                  </div>
                </div>
              ))}

            <Textarea
              placeholder="Reason for cancellation..."
              value={cancelledReason}
              onChange={(e) => setCancelledReason(e.target.value)}
              className="min-h-[100px] text-xs sm:text-sm lg:text-xs xl:text-sm"
            />
          </div>
          <DialogFooter
            className={"flex flex-row justify-between items-center"}
          >
            <Button
              variant="outline"
              onClick={() => {
                setIsCancelModalOpen(false);
                setCancelledReason("");
              }}
              className="text-xs sm:text-sm lg:text-xs xl:text-sm"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelOrder}
              disabled={isCancelling}
              className="text-xs sm:text-sm lg:text-xs xl:text-sm"
            >
              {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default OrderHistoryDetail;
