import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { useEffect } from "react";
import DataLoading from "../../../components/Loaders/DataLoading";
import { toast } from "sonner";
import useFiltration from "../../../Hooks/useFilteration";
import { fetchOrderReport } from "../../../api/Admin/ReportApi";
import { useDashboard } from "../../../Context/DashboardContext";
import { format } from "date-fns";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Doughnut, Pie, Bar } from "react-chartjs-2";
import { Link } from "react-router-dom";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const OrderStatusEnum = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURN_REQUESTED",
  "RETURN_APPROVED",
  "RETURNED",
  "REFUNDED",
];

const OrderReport = () => {
  const {
    clearFilters,
    filters,
    handleFilterChangeHook,
    handlePaginationChange,
    debouncedSearch,
  } = useFiltration({
    status: "PENDING",
  });
  const [data, setData] = useState({
    totalOrders: 0,
    paginatedOrders: 0,
    totalItemsOrdered: 0,
    orderStatusCount: {},
    paymentStatusCount: {},
    totalAmount: 0,
    discountGiven: 0,
    refundAmount: 0,
    usedCoupons: 0,
    giftCardUsage: 0,
    topProducts: [],
    paymentMethodStats: {},
    finalRevenueInInr: 0,
    finalRevenueInUsd: 0,
    fallbackRevenue: 0,
    inrOrderCount: 0,
    usdOrderCount: 0,
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });
  const [loading, setLoading] = useState(false);
  const { dateRange } = useDashboard();

  const handleStatusChange = (status) => {
    handleFilterChangeHook({
      target: {
        name: "status",
        value: status,
      },
    });
  };

  useEffect(() => {
    if (!filters.status) {
      handleFilterChangeHook({
        target: {
          name: "status",
          value: "PENDING",
        },
      });
    }
  }, []);

  const formatLargeNumber = (num) => {
    if (num === 0) return "0";
    if (Math.abs(num) >= 1e12) return "∞";
    if (Math.abs(num) >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (Math.abs(num) >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        startDate: dateRange.startDate
          ? format(dateRange.startDate, "yyyy-MM-dd")
          : format(new Date(), "yyyy-MM-dd"),
        endDate: dateRange.endDate
          ? format(dateRange.endDate, "yyyy-MM-dd")
          : format(new Date(), "yyyy-MM-dd"),
      };

      const response = await fetchOrderReport({
        ...params,
      });
      setData(
        response?.data?.data || {
          totalOrders: 0,
          paginatedOrders: 0,
          totalItemsOrdered: 0,
          orderStatusCount: {},
          paymentStatusCount: {},
          totalAmount: 0,
          discountGiven: 0,
          refundAmount: 0,
          usedCoupons: 0,
          giftCardUsage: 0,
          topProducts: [],
          paymentMethodStats: {},
          finalRevenueInInr: 0,
          finalRevenueInUsd: 0,
          fallbackRevenue: 0,
          inrOrderCount: 0,
          usdOrderCount: 0,
          startDate: params.startDate,
          endDate: params.endDate,
        }
      );
      console.log(response?.data?.data);
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to fetch order report");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange.startDate, dateRange.endDate]);

  const handlePageChange = (page) => {
    handlePaginationChange(page);
    fetchData(page);
  };

  const clearStatusFilter = () => {
    handleFilterChangeHook("status", "");
  };

  const PaymentStatusChart = ({ data }) => {
    const chartData = {
      labels: Object.keys(data).map((key) => key.split("_").join(" ")),
      datasets: [
        {
          data: Object.values(data),
          backgroundColor: [
            "#10b981", // SUCCESS - green
            "#f59e0b", // PENDING - amber
            "#64748b", // REFUNDED - slate
          ],
          borderWidth: 1,
        },
      ],
    };

    const options = {
      plugins: {
        legend: {
          position: "right",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label || "";
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${value} (${percentage}%)`;
            },
          },
        },
      },
      maintainAspectRatio: false,
    };

    return <Pie data={chartData} options={options} />;
  };

  const PaymentMethodChart = ({ data }) => {
    if (!data || Object.keys(data).length === 0) {
      return (
        <div className="h-full flex items-center justify-center text-gray-500">
          No payment method data available
        </div>
      );
    }

    const labels = Object.keys(data);
    const counts = labels.map((method) => data[method]?.count || 0);
    const amounts = labels.map((method) => data[method]?.amount || 0);

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: "Count",
          data: counts,
          backgroundColor: "#3b82f6",
          borderColor: "#2563eb",
          borderWidth: 1,
        },
        {
          label: "Amount (₹)",
          data: amounts,
          backgroundColor: "#10b981",
          borderColor: "#059669",
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || "";
              if (label) {
                label += ": ";
              }
              if (context.dataset.label === "Amount (₹)") {
                label +=
                  Math.abs(context.raw) > 1e12
                    ? "∞"
                    : "₹" + context.raw.toLocaleString();
              } else {
                label += context.raw;
              }
              return label;
            },
          },
        },
      },
      maintainAspectRatio: false,
    };

    return <Bar data={chartData} options={options} />;
  };

  const OrderStatusCards = ({ data }) => {
    if (!data || Object.keys(data).length === 0) {
      return (
        <div className="text-gray-500 text-center py-4">
          No order status data available
        </div>
      );
    }

    const statusColors = {
      CONFIRMED: "bg-blue-100 text-blue-800",
      PENDING: "bg-amber-100 text-amber-800",
      CANCELLED: "bg-red-100 text-red-800",
      REFUNDED: "bg-slate-100 text-slate-800",
      RETURN_REQUESTED: "bg-orange-100 text-orange-800",
      RETURN_APPROVED: "bg-purple-100 text-purple-800",
    };

    const statusIcons = {
      CONFIRMED: "✓",
      PENDING: "⏳",
      CANCELLED: "✕",
      REFUNDED: "↩",
      RETURN_REQUESTED: "🔄",
      RETURN_APPROVED: "✓🔄",
    };

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(data).map(([status, count]) => (
          <div key={status} className="bg-white rounded-lg p-4 shadow border">
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  statusColors[status] || "bg-gray-100 text-gray-800"
                }`}
              >
                {statusIcons[status] || "•"} {status.split("_").join(" ")}
              </span>
              <span className="text-lg font-bold">{count}</span>
            </div>
            <div className="mt-2 h-2 w-full bg-gray-200 rounded-full">
              <div
                className={`h-2 rounded-full ${
                  statusColors[status] || "bg-gray-400"
                }`}
                style={{ width: `${(count / data.totalOrders) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-semibold">
            Report & Analytics
          </h2>
          <p className="text-sm text-gray-500">
            {data.dateRange?.startDate} to {data.dateRange?.endDate}
          </p>
        </div>
      </div>

      {loading ? (
        <DataLoading />
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               <Link to={"/admin/orders"}>
       
            <div className="bg-white rounded-xl p-4 shadow border">
              <h3 className="text-sm font-medium text-gray-500">
                Total Orders
              </h3>
              <p className="text-2xl font-bold mt-1">{data.totalOrders}</p>
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <span>Since {data.startDate}</span>
              </div>
            </div>
                 </Link>

            <div className="bg-white rounded-xl p-4 shadow border">
              <h3 className="text-sm font-medium text-gray-500">
                Items Ordered
              </h3>
              <p className="text-2xl font-bold mt-1">
                {data.totalItemsOrdered}
              </p>
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <span>Across all orders</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow border">
              <h3 className="text-sm font-medium text-gray-500">
                Final Revenue
              </h3>
              <p className="text-2xl font-bold mt-1">
                $
                {Math.abs(data.finalRevenueInUsd) > 1e12
                  ? "∞"
                  : data.finalRevenueInUsd.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 font-bold mt-2">In Usd</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow border">
              <h3 className="text-sm font-medium text-gray-500">
                Final Revenue
              </h3>
              <p className="text-2xl font-bold mt-1">
                ₹
                {Math.abs(data.finalRevenueInInr) > 1e12
                  ? "∞"
                  : data.finalRevenueInInr.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 font-bold mt-2">In Inr</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow border">
              <h3 className="text-sm font-medium text-gray-500">
                Refund Amount
              </h3>
              <p className="text-2xl font-bold mt-1">
                ₹{data.refundAmount.toLocaleString()}
              </p>
              <div className="flex items-center text-sm text-gray-500 mt-2">
                <span>
                  {data.orderStatusCount?.REFUNDED || 0} refunds processed
                </span>
              </div>
            </div>
          </div>

          {/* Order Status Cards */}
          <div className="bg-white rounded-xl p-4 shadow border">
            <h3 className="font-medium mb-4">Order Status Distribution</h3>
            <OrderStatusCards data={data.orderStatusCount} />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Status Pie Chart */}
            <div className="bg-white rounded-xl p-4 shadow border">
              <h3 className="font-medium mb-4">Payment Status</h3>
              <div className="h-64">
                <PaymentStatusChart data={data.paymentStatusCount} />
              </div>
            </div>

            {/* Payment Methods Bar Chart */}
            <div className="bg-white rounded-xl p-4 shadow border">
              <h3 className="font-medium mb-4">Payment Methods</h3>
              <div className="h-64">
                <PaymentMethodChart data={data.paymentMethodStats} />
              </div>
            </div>
          </div>

          {/* Secondary Data Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Products */}
            <div className="bg-white rounded-xl p-4 shadow border">
              <h3 className="font-medium mb-4">Top Products</h3>
              <div className="space-y-3">
                {data?.topProducts?.length > 0 ? (
                  data.topProducts.map((product, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
                    >
                      <span className="text-sm truncate max-w-[70%]">
                        {product.productName}
                      </span>
                      <span className="font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {product.quantity} sold
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-center py-4">
                    No top products data available
                  </div>
                )}
              </div>
            </div>

            {/* Promotions */}
            <div className="bg-white rounded-xl p-4 shadow border">
              <h3 className="font-medium mb-4">Promotions Used</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <h4 className="text-xs text-blue-600">Coupons Used</h4>
                  <p className="text-xl font-bold mt-1">{data.usedCoupons}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <h4 className="text-xs text-purple-600">Gift Cards Used</h4>
                  <p className="text-xl font-bold mt-1">{data.giftCardUsage}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <h4 className="text-xs text-green-600">Discount Given</h4>
                  <p className="text-xl font-bold mt-1">
                    {Math.abs(data.discountGiven) > 1e12
                      ? "∞"
                      : `₹${formatLargeNumber(data.discountGiven)}`}
                  </p>
                </div>
                <div className="bg-orange-50 rounded-lg p-3">
                  <h4 className="text-xs text-orange-600">Currency Split</h4>
                  <p className="text-sm mt-1">
                    {data.inrOrderCount} INR / {data.usdOrderCount} USD
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderReport;
