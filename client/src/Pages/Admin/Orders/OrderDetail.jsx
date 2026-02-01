import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById, orderRefunded, orderRequestApproved } from "../../../api/Admin/OrderApi";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import {
  ArrowLeft,
  Package,
  CreditCard,
  User,
  MapPin,
  Hash,
  Currency,
  ShieldCheck,
  RefreshCw,
  CheckCircle,
  Clock,
  Gift,
  Tag,
  Gem,
  Scale,
  Award,
  Layers,
  Scissors,
  Palette,
  Box,
  Calendar,
  AlertCircle,
  FileText,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import AdminRefundDialog from "./AdminRefundDialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { toast } from "sonner";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [itemToRefund, setItemToRefund] = useState(null);
  const [refundAmount, setRefundAmount] = useState(
    orderDetail?.paymentHistory?.amountPaid || 0
  );
  const [refundReason, setRefundReason] = useState("");


  const handleOpenRefundDialog = (order) => {
    setItemToRefund(order); // Store selected item
    setIsRefundDialogOpen(true);
    setRefundAmount(order.paymentHistory?.amountPaid || 0);

  };

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await getOrderById(id);
      setOrderDetail(response.data.data);
    } catch (error) {
      console.log("Error fetching order details:", error);
      navigate("/admin/orders");
    } finally {
      setLoading(false);
    }
  };




  const handleRefundConfirm = async () => {
    try {
      setLoading(true)
      const result = await orderRefunded(orderDetail.id, { refundAmount, refundReason })
      if (result?.data?.data?.success) {
        toast.success("Refund initiated successfully");
        setIsRefundDialogOpen(false);
        setLoading(false)
        fetchOrderDetails()
      }
    } catch (error) {


      toast.error(error?.response?.data?.message || "Refund failed");
    } finally {
      setLoading(false)
    }
  };




  useEffect(() => {


    if (id) {
      fetchOrderDetails();
    }
  }, [id, navigate]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary">Pending</Badge>;
      case "CONFIRMED":
        return <Badge className="bg-blue-500">Confirmed</Badge>;
      case "SHIPPED":
        return <Badge className="bg-purple-500">Shipped</Badge>;
      case "DELIVERED":
        return <Badge className="bg-green-500">Delivered</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "RETURN_REQUESTED":
        return <Badge className="bg-orange-500">Return Requested</Badge>;
      case "RETURNED":
        return <Badge className="bg-amber-500">Returned</Badge>;
      case "REFUNDED":
        return <Badge className="bg-teal-500">Refunded</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary">Pending</Badge>;
      case "SUCCESS":
        return <Badge className="bg-green-500">Success</Badge>;
      case "FAILED":
        return <Badge variant="destructive">Failed</Badge>;
      case "REFUNDED":
        return <Badge className="bg-teal-500">Refunded</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPaymentMethodBadge = (method) => {
    switch (method) {
      case "RAZORPAY":
        return <Badge className="bg-indigo-500">Razorpay</Badge>;
      case "PAYPAL":
        return <Badge className="bg-blue-500">PayPal</Badge>;
      case "COD":
        return <Badge className="bg-gray-500">Cash on Delivery</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleRequestApproved = async (id, orderID) => {
    const result = window.confirm("Do you want to approve this return request?");


    if (result) {
      try {
        const data = { orderId: orderID };
        const response = await orderRequestApproved(id, data);

        toast.success("Request approved successfully!");
        console.log(response);
        if (response?.data?.data) {
          fetchOrderDetails()
        }
      } catch (error) {
        toast.error("Failed to approve request");
        console.error(error);
      }
    } else {
      toast("Approval cancelled");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col gap-6">
          <Skeleton className="h-10 w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!orderDetail) {
    return <div className="container mx-auto px-4 py-8">Order not found</div>;
  }


  const orderSteps = [
    { label: "Order received", date: "Sun, 11th Aug", completed: true },
    { label: "Confirmed", date: "Mon, 12th Aug", completed: true },
    { label: "Packed", date: "Wed, 14th Aug", completed: true },
    { label: "Delivered", date: "Sun, 18th Aug", completed: true },
    { label: "Returned", date: "Sun, 18th Sep", completed: false },
  ];


  return (
    <div className="container mx-auto py-8 text-xs sm:text-sm">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col md:flex-row items-center gap-2 sm:gap-4">
            <h1 className="text-xl sm:text-2xl font-bold">Order Details</h1>
            <Badge
              variant="outline"
              className="bg-white rounded-full shadow-md border-none"
            >
              {orderDetail.orderNumber}
            </Badge>
          </div>
          <Button
            variant="edit"
            size="sm"
            className="rounded-full text-xs sm:text-sm "
            onClick={() => navigate("/admin/orders")}
          >
            <ArrowLeft className=" mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  <CardTitle>Order Items</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader className="text-xs ">
                    <TableRow>
                      <TableHead className="pl-4">Product</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Metal</TableHead>
                      <TableHead>Gemstone</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-xs">
                    {orderDetail.orderItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium min-w-[160px] ">
                          <div className="flex items-center gap-4">
                            {item.imageUrl ? (
                              item.imageUrl.endsWith(".mp4") ? (
                                <video
                                  className="w-16 h-16 object-cover rounded"
                                  autoPlay
                                  loop
                                  muted
                                  playsInline
                                >
                                  <source
                                    src={item.imageUrl}
                                    type="video/mp4"
                                  />
                                  Your browser does not support the video tag.
                                </video>
                              ) : (
                                <img
                                  src={item.imageUrl}
                                  alt={item.productName}
                                  className="w-16 h-16 object-cover rounded"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "path-to-no-image-icon.png"; // or use a placeholder component
                                  }}
                                />
                              )
                            ) : (
                              <div className="w-16 h-16 rounded bg-gray-200 flex items-center justify-center">
                                <svg
                                  className="w-8 h-8 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                            )}
                            <div className=" ">
                              <p className="font-medium text-balance">
                                {item.productName}
                              </p>

                              <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                                <Scale className="h-3 w-3" />
                                <span>Gross Weight: {item.grossWeight}g</span>
                              </div>
                              <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                                <Hash className="h-3 w-3" />
                                <span>Size: {item.size}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[140px]">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Award className="h-3 w-3" />
                              <span>Certification: {item.certification}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Layers className="h-3 w-3" />
                              <span>
                                Origin: {item.origin.replace("_", " ")}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Scissors className="h-3 w-3" />
                              <span>Cut: {item.gemstoneCut}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Palette className="h-3 w-3" />
                              <span>Shape: {item.gemstoneShape}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[120px]">
                          <div className="space-y-1">
                            <div>
                              <span className="font-medium">
                                {item.metalType}
                              </span>{" "}
                              <span>{item.purityLabel}</span>
                            </div>
                            <div>{item.metalColorName}</div>
                            <div className="text-muted-foreground">
                              {item.metalWeight}g × ₹{item.metalPrice}/g
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[140px]">
                          <div className="space-y-1">
                            <div className="font-medium">
                              {item.gemstoneType}
                            </div>
                            <div>{item.gemstoneColor}</div>
                            <div className="text-muted-foreground">
                              {item.gemstoneClarity}
                            </div>
                            <div className="text-muted-foreground">
                              Center: {item.gemstoneCenterCaratWeight}ct
                            </div>
                            <div className="text-muted-foreground">
                              Side: {item.gemstoneSideCaratWeight}ct
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="min-w-[120px]">
                          ₹{item.priceAtPurchase.toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell className="min-w-[120px]">
                          <span> {item.quantity}</span>
                        </TableCell>
                        <TableCell className="text-right max-w-[120px]">
                          <div className="font-bold text-sm">
                            ₹{item.total.toLocaleString("en-IN")}
                          </div>
                          <div className="text-muted-foreground text-xs mt-1">
                            (incl. {item.gstValue}% GST)
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6 lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {/* Payment History */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      <CardTitle>Payment Details</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Hash className="h-4 w-4" />
                            Transaction ID
                          </p>
                          <p className="font-medium ml-6">
                            {orderDetail?.paymentHistory?.transactionId ||
                              "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Currency className="h-4 w-4" />
                            Amount Paid
                          </p>
                          <p className="font-medium ml-6">

                            {orderDetail.paymentHistory?.amountPaid.toLocaleString(
                              "en-IN"
                            )}{" "}
                            {orderDetail.paymentHistory?.currency}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4" />
                            Payment Status
                          </p>
                          <div className="mt-1 ml-6">
                            {getPaymentStatusBadge(
                              orderDetail.paymentHistory?.status
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <RefreshCw className="h-4 w-4" />
                            Attempt Number
                          </p>
                          <p className="font-medium ml-6">
                            {orderDetail.paymentHistory?.attemptNumber}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Refund Status
                          </p>
                          <p className="font-medium ml-6">
                            {orderDetail.paymentHistory?.refunded ? (
                              <Badge className="bg-teal-500">Refunded</Badge>
                            ) : (
                              <Badge variant="secondary">Not Refunded</Badge>
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Paid At
                          </p>
                          <p className="font-medium ml-6 text-sm">
                            {format(
                              new Date(
                                orderDetail?.paymentHistory?.paidAt || "0"
                              ),
                              "dd MMM yyyy, h:mm a"
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Created At
                          </p>
                          <p className="font-medium ml-6 text-sm">
                            {format(
                              new Date(
                                orderDetail?.paymentHistory?.createdAt || "0"
                              ),
                              "dd MMM yyyy, h:mm a"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="grid grid-cols-1  w-full gap-6">
                      <div className="">
                        <h3 className="text-sm font-medium  mb-2 flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Razorpay Details
                        </h3>
                        <div className="bg-gray-50  rounded-lg p-4  flex flex-col md:flex-row gap-4 w-full justify-between ">
                          <div className="w-full md:w-1/2">
                            <p className="text-sm text-muted-foreground">
                              Order ID
                            </p>
                            <p className="font-medium  text-sm">
                              {orderDetail.paymentHistory?.razorpayOrderId ||
                                "N/A"}
                            </p>
                          </div>
                          <div className="w-full md:w-1/2">
                            <p className="text-sm text-muted-foreground">
                              Payment ID
                            </p>
                            <p className="font-medium  text-sm">
                              {orderDetail.paymentHistory?.razorpayPaymentId ||
                                "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Status
                    </span>
                    <span>{getStatusBadge(orderDetail.status)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Payment Status
                    </span>
                    <span>
                      {getPaymentStatusBadge(orderDetail.paymentStatus)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Payment Method
                    </span>
                    <span>
                      {getPaymentMethodBadge(orderDetail.paymentMethod)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Is Paid
                    </span>
                    <span>
                      {orderDetail.isPaid ? (
                        <Badge className="bg-green-500">Yes</Badge>
                      ) : (
                        <Badge variant="secondary">No</Badge>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Paid At
                    </span>
                    <span className="font-medium">
                      {orderDetail.paidAt
                        ? format(
                          new Date(orderDetail.paidAt),
                          "dd MMM yyyy, h:mm a"
                        )
                        : "N/A"}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      GST Value
                    </span>
                    <span>
                      ₹{orderDetail.gstAmount.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>
                      {orderDetail.orderCurrency === "USD" ? "$" : "₹"}
                      {orderDetail.finalAmount.toLocaleString(
                        orderDetail.orderCurrency === "USD" ? "en-US" : "en-IN"
                      )}
                    </span>
                  </div>


                  <Separator />
                  {orderDetail.couponId && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Gift className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Coupon Applied
                        </span>
                      </div>
                      {orderDetail.couponId ? (
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                          <div className="flex justify-between">
                            <span className="font-medium">
                              {orderDetail.code}
                            </span>
                            <div className=" text-sm">
                              Discount:{""}
                              {orderDetail.discountType === "FIXED" && "₹"}
                              {orderDetail.discountValue.toLocaleString(
                                "en-IN"
                              )}
                              {orderDetail.discountType === "PERCENTAGE" && "%"}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No coupon applied
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-2">
                  <div className="text-xs text-muted-foreground font-medium">
                    Ordered:{" "}
                    {format(
                      new Date(orderDetail.createdAt),
                      "dd MMM yyyy, h:mm a"
                    )}
                  </div>
                </CardFooter>
              </Card>
            </div>

            {/* Customer Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <CardTitle>Customer Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">
                      {orderDetail.customer.firstName}{" "}
                      {orderDetail.customer.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{orderDetail.customer.phone}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping addressSnapshot */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <CardTitle>Shipping Address</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium">
                      {orderDetail?.addressSnapshot?.houseNo},{" "}
                      {orderDetail?.addressSnapshot?.street}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {orderDetail?.addressSnapshot?.landMark}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {orderDetail?.addressSnapshot?.city}, {orderDetail?.addressSnapshot?.state} -{" "}
                      {orderDetail?.addressSnapshot?.postalCode}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {orderDetail?.addressSnapshot?.country}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Billing addressSnapshot
                    </p>
                    <p className="font-medium">
                      {orderDetail?.addressSnapshot?.isBilling ? "Yes" : "No"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          {orderDetail?.OrderStatusHistory &&
            orderDetail.OrderStatusHistory.length > 0 && (
              <div className="lg:col-span-3 space-y-3 sm:space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      <CardTitle>Order History</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-3 pb-4 relative overflow-x-auto scrollbarWidthThinAdmin">
                      <div className="flex w-full min-w-[600px] ">
                        {orderDetail?.OrderStatusHistory.map((step, index) => {
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

                          const isCompleted =
                            index <= orderDetail.OrderStatusHistory.length - 1;

                          return (
                            <div
                              key={step.id}
                              className="text-center flex-1 relative px-2"
                            >
                              <div
                                className={`w-4 h-4 mx-auto rounded-full z-10 ${isCompleted ? statusColor : "bg-gray-300"
                                  }`}
                              ></div>
                              {index <
                                orderDetail.OrderStatusHistory.length - 1 && (
                                  <div
                                    className={`absolute top-2 left-1/2 w-full h-[2px] z-0 ${isCompleted ? statusColor : "bg-gray-300"
                                      }`}
                                  ></div>
                                )}
                              <div className="text-xs mt-1 text-gray-500 truncate">
                                {step.status.replace(/_/g, " ")}
                              </div>
                              <div className="text-xs text-gray-400 truncate">
                                {format(step.updatedAt, "dd MMM yyyy, hh:mm a")}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}



            {Array.isArray(orderDetail?.returnRequest) && orderDetail?.returnRequest.length > 0 && orderDetail.returnRequest.map((val, idx) => (
                <CardContent>
              <div className="bg-gray-50 p-2 rounded-md shadow-sm mt-2 text-sm">
                <div key={idx} className="mb-2 border-l-2 border-yellow-400 pl-2">
                  <p className="font-semibold text-gray-700 mb-1">🔁 Return Request</p>
                  <p className="text-gray-600 mb-0.5">
                    <span className="font-medium">Reason:</span> {val?.reason}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Status:</span>{" "}
                    <span className={val?.isApproved ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                      {val?.isApproved ? "Approved" : "Pending"}
                    </span>
                  </p>
                  {Array.isArray(val.photos) && val.photos.length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {val.photos.map((photo, i) => (
                        <a
                          key={i}
                          href={photo}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Click to view full size"
                        >
                          <img
                            src={photo}
                            alt={`Return photo ${i + 1}`}
                            className="w-16 h-16 object-cover rounded border border-gray-300 hover:scale-105 transition"
                          />
                        </a>
                      ))}
                    </div>
                  )}

                  {!val?.isApproved && (
                    <button onClick={() => handleRequestApproved(val.id, orderDetail.id)} className="flex items-center gap-1 mt-2 px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition">
                      <span className="text-green-600">✔</span> Approve
                    </button>
                  )}

                </div>
              </div>
                   </CardContent>
            ))}
  



        </div>
        <div>
          {(orderDetail.status !== "REFUNDED") &&
            <Button
              variant="outline"
              className="text-xs sm:text-sm text-white bg-red-500 w-fit"
              onClick={() => handleOpenRefundDialog(orderDetail)}
            >
              {loading ? "Processing....." : "Initiate Refund"}
            </Button>
          }


        </div>

      </div>


      <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refund Item</DialogTitle>
            <DialogDescription>
              You can edit the refund amount or reason before confirming.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm font-medium">{itemToRefund?.productName}</p>

            <Input
              type="number"
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              placeholder="Refund Amount"
            />

            <Textarea
              placeholder="Reason for refund..."
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsRefundDialogOpen(false);
                setRefundAmount("");
                setRefundReason("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleRefundConfirm}>
              Confirm Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default OrderDetail;
