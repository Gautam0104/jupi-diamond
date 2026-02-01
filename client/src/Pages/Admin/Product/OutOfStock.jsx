import { useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { FiTrash2, FiEye, FiSearch, FiX } from "react-icons/fi";
import { FaRegImage, FaStar } from "react-icons/fa6";
import { useEffect } from "react";
import DataLoading from "../../../components/Loaders/DataLoading";

import { toast } from "sonner";
import { Badge } from "../../../components/ui/badge";
import PaginationComponent from "../../../components/PaginationComponent/PaginationComponent";
import useFiltration from "../../../Hooks/useFilteration";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { getOutofStockProducts } from "../../../api/Admin/ProductApi";

const OutOfStock = () => {
  const {
    clearFilters,
    filters,
    handleFilterChangeHook,
    handlePaginationChange,
    debouncedSearch,
  } = useFiltration();
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({});

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await getOutofStockProducts({
        page: filters.page || 1,
        limit: 10,
        search: debouncedSearch,
      });
      setLowStock(response.data.data.lowStock);

      setPagination(response.data.data.pagination);
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(filters.page);
  }, [debouncedSearch, filters.page, filters.limit]);

  const handlePageChange = (page) => {
    handlePaginationChange(page);
    fetchData(page);
  };

  const renderProductComapreImages = (product) => (
    <div className="relative w-16 h-16  aspect-square">
      <Swiper
        loop={true}
        pagination={false}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        modules={[Pagination, Autoplay]}
        className="w-full aspect-square"
      >
        {product.productVariantImage.length === 0 ? (
          <SwiperSlide>
            <div className="flex items-center bg-gray-200 justify-center border-2 border-dashed border-gray-300 h-full w-full aspect-square">
              <span className="text-gray-400 font-semibold text-md sm:text-xl xl:text-2xl">
                <FaRegImage />
              </span>
            </div>
          </SwiperSlide>
        ) : (
          product.productVariantImage.map((image, index) => (
            <SwiperSlide key={`${image.imageUrl}-${index}`}>
              {image.imageUrl.endsWith(".mp4") ? (
                <video
                  src={image.imageUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover aspect-square"
                  aria-label={`${product.productVariantTitle} video ${
                    index + 1
                  }`}
                />
              ) : (
                <img
                  src={image.imageUrl}
                  alt={`${product.productVariantTitle} - ${index + 1}`}
                  className="w-full h-full object-cover aspect-square"
                  loading="lazy"
                />
              )}
            </SwiperSlide>
          ))
        )}
      </Swiper>
    </div>
  );

  return (
    <div className="w-full ">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-lg sm:text-2xl font-semibold">
          Low & Out of Stock Products
        </h2>
        <div className="relative flex items-center w-full sm:max-w-[250px]">
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
            className="w-full py-2 pl-10 text-xs sm:text-sm pr-10 text-gray-700 bg-white shadow-md rounded-full focus:outline-none focus:border-lime-500 focus:ring-1 focus:ring-lime-500"
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
      </div>

      <div className="rounded-xl border">
        <div className="relative mb-4">
          <Table>
            <TableHeader>
              <TableRow>
                {["Image", "Product", "Jewelery Type", "Price", "Stock"].map(
                  (header) => (
                    <TableHead
                      key={header}
                      className="whitespace-nowrap text-center"
                    >
                      {header}
                    </TableHead>
                  )
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-20 text-center">
                    <DataLoading />
                  </TableCell>
                </TableRow>
              ) : lowStock?.length > 0 ? (
                lowStock.map((item) => (
                  <TableRow key={item.id} className="text-center">
                    <TableCell className="min-w-[100px] truncate">
                      <div className="flex items-center    justify-center gap-2">
                        {renderProductComapreImages(item)}
                      </div>
                    </TableCell>

                    <TableCell className="min-w-[120px] text-left">
                      {item.productVariantTitle || "N/A"}
                    </TableCell>
                    <TableCell className="min-w-[80px]">
                      {item.products?.jewelryType?.name || "N/A"}
                    </TableCell>
                    <TableCell className="min-w-[120px] text-center">
                      ₹{item.finalPrice || "N/A"}
                    </TableCell>
                    <TableCell className="min-w-[120px]">
                      {item.stock === 0 ? (
                        <Badge
                          variant="outline"
                          className="border-red-300 bg-red-50 text-red-600"
                          aria-label="Out of stock"
                        >
                          Out Of Stock
                        </Badge>
                      ) : item.stock < 10 ? (
                        <Badge
                          variant="destructive"
                          aria-label={`Low stock: ${item.stock} remaining`}
                        >
                          Low Stock ({item.stock})
                        </Badge>
                      ) : (
                        <Badge
                          variant="success"
                          aria-label={`In stock: ${item.stock} available`}
                        >
                          In Stock ({item.stock})
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex justify-center items-center">
                      <span className="text-gray-500">
                        {" "}
                        No products with low stock available
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="p-2 md:p-4 border-t">
          <PaginationComponent
            currentPage={Number(pagination.page) || 1}
            totalPages={pagination.totalPages || 1}
            totalCount={pagination.totalCount || 0}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default OutOfStock;
