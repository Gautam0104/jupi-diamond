import { useEffect, useState } from "react";
import { useDashboard } from "../../../Context/DashboardContext";
import { fetchSalesReport } from "../../../api/Admin/ReportApi";
import { format } from "date-fns";
import DataLoading from "../../../components/Loaders/DataLoading";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { Link } from "react-router-dom";

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

const SalesReport = () => {
  const { dateRange } = useDashboard();
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState({
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });

  const fetchData = async () => {
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

      const res = await fetchSalesReport(params);
      setReport(res?.data?.data?.report || []);
      setDates(res?.data?.data?.dateRange || params);
    } catch (error) {
      console.log("Sales Report Fetch Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const totalSales = report.reduce((acc, item) => acc + item.totalSalesAmount, 0);
  const totalPaid = report.reduce((acc, item) => acc + item.totalPaidAmount, 0);
  const totalOrders = report.reduce((acc, item) => acc + item.totalOrders, 0);
  const totalQuantity = report.reduce((acc, item) => acc + item.totalQuantity, 0);

  // Chart Data
  const barData = {
    labels: report.map((item) => item.productName),
    datasets: [
      {
        label: "Total Sales (₹)",
        data: report.map((item) => item.totalSalesAmount),
        backgroundColor: "#3b82f6",
        borderRadius: 6,
      },
    ],
  };

  const pieData = {
    labels: ["Paid Quantity", "Pending Quantity"],
    datasets: [
      {
        data: [
          report.reduce((acc, item) => acc + item.paidQuantity, 0),
          report.reduce((acc, item) => acc + item.pendingQuantity, 0),
        ],
        backgroundColor: ["#10b981", "#f59e0b"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Sales Report</h2>
        <p className="text-gray-500 text-sm">
          {dates.startDate} to {dates.endDate}
        </p>
      </div>

      {loading ? (
        <DataLoading />
      ) : report.length === 0 ? (
        <p className="text-center text-gray-500">No sales data available</p>
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow border p-4">
              <h4 className="text-sm text-gray-500">Total Sales</h4>
              <p className="text-2xl font-bold mt-1">₹{totalSales.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl shadow border p-4">
              <h4 className="text-sm text-gray-500">Total Paid</h4>
              <p className="text-2xl font-bold mt-1">₹{totalPaid.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl shadow border p-4">
              <Link to={"/admin/orders"}>
                <h4 className="text-sm text-gray-500">Total Orders</h4>
                <p className="text-2xl font-bold mt-1">{totalOrders}</p>
              </Link>
            </div>
            <div className="bg-white rounded-xl shadow border p-4">
              <h4 className="text-sm text-gray-500">Total Quantity</h4>
              <p className="text-2xl font-bold mt-1">{totalQuantity}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow border p-4">
              <h3 className="text-lg font-medium mb-2">Top Selling Products</h3>
              <div className="h-64">
                <Bar data={barData} options={chartOptions} />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow border p-4">
              <h3 className="text-lg font-medium mb-2">Quantity Distribution</h3>
              <div className="h-64">
                <Pie data={pieData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Product-wise Report List */}
          <div className="grid grid-cols-1 gap-4">

            <div className="bg-white rounded-xl p-4 shadow border">
              <h3 className="font-medium mb-4">Top Products</h3>
              {report.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
                >
                  <span className="text-sm truncate max-w-[70%]">
                    {item?.productName}
                  </span>
                  <span className="font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {item?.quantity} sold
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesReport;
