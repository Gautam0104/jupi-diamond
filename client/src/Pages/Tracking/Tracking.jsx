import { FaSearch, FaPhone, FaCommentDots } from "react-icons/fa";
import { useEffect, useState } from "react";
import { trackCustomerOrder } from "../../api/Public/publicApi";
import { toast } from "sonner";
import useFiltration from "../../Hooks/useFilteration";
import { BsTruck } from "react-icons/bs";
import { FiPhone } from "react-icons/fi";
import StatusTracking from "./StatusTracking";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { addDays, format } from "date-fns";
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import { useParams } from "react-router-dom";

const Tracking = () => {
  const [loading, setLoading] = useState(false);
  const [trackingData, setTrackingData] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const { id } = useParams(); // This should be the orderNumber from the URL

  const {
    clearFilters,
    filters,
    handleFilterChangeHook,
    handlePaginationChange,
    debouncedSearch,
  } = useFiltration();

  const fetchData = async (orderNumber) => {
    setLoading(true);
    try {
      const response = await trackCustomerOrder(orderNumber);




      if (response.status === 200) {
        setTrackingData(response.data.data);
      } else {
        toast.error(response.message || "Error fetching tracking data");
        setTrackingData(null);
      }
      if (response.status === 400) {
        toast.error(response.message);
      }
    } catch (err) {
      console.error("API Error:", err.response?.data?.message);
      toast.error(err.response?.data?.message || "Failed to fetch tracking data");
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      setSearchInput(id);
      fetchData(id);
    }
  }, [id]);

  const handleSearch = () => {
    if (!searchInput.trim()) {
      toast.error("Please enter a tracking number");
      return;
    }
    fetchData(searchInput.trim());
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-14 xl:px-6 py-4 sm:py-8 bg-white">
      <div className="flex flex-col lg:flex-row items-center justify-between">
        <h2 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-6">Tracking</h2>
        <div className="flex items-center w-full sm:max-w-md border rounded shadow-sm">
          <input
            type="text"
            placeholder="Enter Order ID"
            className="flex-1 px-2 sm:px-4 py-2 text-xs sm:text-sm text-purple-700 placeholder-purple-400 outline-none"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            className="flex items-center px-2  sm:px-4 py-2 border text-xs sm:text-sm text-[#C68B73] border-brown hover:bg-[#C68B73] hover:text-white transition duration-300 ease-in-out"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? (
              "Searching..."
            ) : (
              <>
                <FaSearch className="mr-2" />
                Search Orders
              </>
            )}
          </button>
        </div>
      </div>

      {trackingData ? (
        <div className="flex flex-col lg:flex-row h-full sm:h-full gap-4 mt-4 bg-gray-50 w-full ">
          <TrackingSidebar trackingData={trackingData} />
          <TrackingMap trackingData={trackingData} />
        </div>
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 text-xs sm:text-sm">
            {loading
              ? "Loading..."
              : "Enter an order number to track your package"}
          </p>
        </div>
      )}
    </div>
  );
};

const TrackingSidebar = ({ trackingData }) => {
  return (
    <div className="lg:w-[350px] xl:w-[400px] border-r  bg-white p-4 overflow-y-auto border border-gray-200">
      {/* Tracking ID */}
      <div className="mb-4">
        <div className="flex items-center ">
          <div className="trackbox p-2 rounded-sm border-2 border-[#F0DFD8] bg-brown text-white shadow-sm">
            <BsTruck />
          </div>
          <div className="flex-1 flex justify-between items-center ml-4">
            <div className="flex items-start flex-col ">
              <div className="text-xs text-gray-500">Order ID</div>
              <span className="font-medium text-gray-700 text-xs sm:text-sm">
                #{trackingData.orderNumber}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-sm">
              {trackingData.status}
            </span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4 mt-6">
        <div className="mb-6">
          <StatusTracking historyStatus={trackingData?.OrderStatusHistory} />
        </div>
      </div>

      {/* Address Info */}
      <div className="mt-6 p-2 border bg-gray-100 flex items-center justify-between">
        <div className="flex items-center  gap-2">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-700 font-medium">
              {trackingData.customer.firstName?.[0]?.toUpperCase()}
              {trackingData.customer.lastName?.[0]?.toUpperCase()}
            </span>
          </div>

          <div className="flex flex-col items-start">
            <div className="text-xs  text-gray-600">Customer</div>
            <div className="text-sm text-gray-900">
              {trackingData.customer.firstName} {trackingData.customer.lastName}
            </div>
          </div>
        </div>
        <a
          href={`tel:${trackingData.customer.phone}`}
          title="Call Customer"
          aria-label={`Call Customer at ${trackingData.customer.phone}`}
          className="text-xs flex items-center gap-1 text-gray-600 p-3 bg-white rounded-sm shadow"
        >
          <FiPhone />{trackingData.customer.phone}
        </a>
      </div>
    </div>
  );
};

const TrackingMap = ({ trackingData }) => {

  return (
    <div className="flex-1 relative bg-gray-200">
      <img
        src="/tracking.png"
        alt="Warehouse"
        className="w-full h-full object-cover"
      />
      <div className="sm:absolute bottom-4 left-4 right-4">
        <div className="bg-white shadow-lg sm:rounded-lg p-4 ">
          <div className="">
            <div className="flex items-center gap-2 mb-2">
              <div className="trackbox p-2 rounded-sm border-2 border-[#F0DFD8] bg-brown text-white shadow-sm">
                <HiOutlineLocationMarker />
              </div>
              <h3 className="text-md text-black font-medium ">
                Live shipment tracking
              </h3>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-2">
              <div className="flex items-center gap-2 ">
                <div className="text-xs text-gray-500">Order ID:</div>
                <div className="text-xs sm:text-sm text-brown font-medium ">
                  #{trackingData.orderNumber}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(trackingData.orderNumber);
                    toast.success("Order number copied to clipboard!");
                  }}
                  className="p-1 text-brown hover:text-brown transition-colors"
                  title="Copy order number"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="9"
                      y="9"
                      width="13"
                      height="13"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </button>
              </div>
              <div>
                <span className="text-xs text-gray-500">Shipping Status :</span>{" "}
                <span className="text-[10px] sm:text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-sm">
                  {trackingData.status}
                </span>
              </div>
            </div>
            <div className="text-xs sm:text-sm text-gray-700 flex items-center justify-between mb-4 sm:mb-2">
              <span>
                From <br /> <strong>Warehouse, Gurugram , Haryana,  India</strong>
              </span>
              <span className="mx-6"><HiOutlineArrowLongRight className="size-5" /></span>
              <span>
                To <br />
                <strong>
                  {trackingData?.addressSnapshot?.city},  {trackingData?.addressSnapshot?.state}
                </strong>
              </span>
            </div>
            <div className="flex items-center justify-between gap-10 ">
              <div className="text-xs text-gray-500 ">
                Order placed : <br />{" "}
                <span className="text-black font-medium ">
                  {format(trackingData.createdAt, "MMMM dd, yyyy - hh:mm a")}
                </span>
              </div>


              { trackingData?.expectedDeliveryDate && (
                <div className="text-xs text-gray-500 text-end">
                  Expected delivery: <br />
                  <span className="text-black font-medium ">
                    {format(new Date(trackingData.expectedDeliveryDate), "MMMM dd, yyyy - hh:mm a")}
                  </span>
                </div>
              )}



              {/* <div className="text-xs text-gray-500">Est. delivery:</div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tracking;
