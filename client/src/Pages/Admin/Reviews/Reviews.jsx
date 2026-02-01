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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { FiTrash2, FiEye, FiSearch, FiX } from "react-icons/fi";
import { FaStar } from "react-icons/fa6";
import { useEffect } from "react";
import DataLoading from "../../../components/Loaders/DataLoading";
import {
  approveReview,
  deleteReview,
  featureReview,
  getAllReviews,
} from "../../../api/Admin/ReviewApi";
import { toast } from "sonner";
import { Switch } from "../../../components/ui/switch";
import { Badge } from "../../../components/ui/badge";
import { format } from "date-fns";
import { LucideImage } from "lucide-react";
import PaginationComponent from "../../../components/PaginationComponent/PaginationComponent";
import useFiltration from "../../../Hooks/useFilteration";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

const Reviews = () => {
  const {
    clearFilters,
    filters,
    handleFilterChangeHook,
    handlePaginationChange,
    debouncedSearch,
  } = useFiltration();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [pagination, setPagination] = useState({});

  const currentPage = pagination.page;
  const totalPages = Math.ceil(pagination.totalCount / pagination.limit);
  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await getAllReviews({
        page: filters.page || 1,
        limit: 10,
        search: debouncedSearch,
        isApproved: filters.isApproved || "",
      });
      setReviews(response.data.data.reviews);
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(filters.page);
  }, [debouncedSearch, filters.isApproved, filters.page, filters.limit]);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const handleDeleteClick = (id) => {
    setReviewToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (reviewToDelete) {
      await handleDelete(reviewToDelete);
      setDeleteConfirmOpen(false);
      setReviewToDelete(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteReview(id);
      if (response.data.success) {
        toast.success("Review deleted successfully");
        fetchData();
      } else {
        toast.error(response.data.message || "Failed to delete review");
      }
    } catch (error) {
      console.log("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete review");
    }
  };

  const [togglingIds, setTogglingIds] = useState({});

  const handleToggleStatus = async (id, currentStatus) => {
    setTogglingIds((prev) => ({ ...prev, [id]: true }));

    try {
      const res = await approveReview(id, !currentStatus);
      const newStatus = !currentStatus;
      toast.success(
        newStatus
          ? "Review has been approved !!"
          : "Review has been disapproved !!"
      );
      setReviews((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isApproved: newStatus } : item
        )
      );
    } catch (error) {
      console.log("Toggle failed:", error);
      toast.error(
        `Failed to ${currentStatus ? "disapprove" : "approve"} review`
      );
    } finally {
      setTogglingIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  const [togIds, setTogIds] = useState({});

  const handleStatus = async (id, currentStatus) => {
    setTogIds((prev) => ({ ...prev, [id]: true }));

    try {
      const res = await featureReview(id, !currentStatus);
      const newStatus = !currentStatus;
      toast.success(
        newStatus
          ? "Review has been featured !!"
          : "Review has been unfeatured !!"
      );
      setReviews((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isFeatured: newStatus } : item
        )
      );
    } catch (error) {
      console.log("Toggle failed:", error);
      toast.error(
        `Failed to ${currentStatus ? "unfeature" : "feature"} review`
      );
    } finally {
      setTogIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleViewDetails = (review) => {
    setSelectedReview(review);
    setViewDialogOpen(true);
  };

  const handlePageChange = (page) => {
    handlePaginationChange(page);
    fetchData(page);
  };

  return (
    <div className="w-full ">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-lg sm:text-2xl font-semibold">Reviews & Ratings</h2>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="w-auto sm:w-auto bg-white rounded-full">
            <Select
              onValueChange={(value) => {
                handleFilterChangeHook({
                  target: {
                    name: "isApproved",
                    value: value === "all" ? "" : value,
                  },
                });
              }}
              aria-label="Filter by approved status"
              value={filters.isApproved || "all"}
            >
              <SelectTrigger className="w-full rounded-full font-medium">
                <SelectValue placeholder="Filter by approved status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Approved</SelectItem>
                <SelectItem value="false">Disapproved</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
      </div>

      <div className="rounded-xl border">
        <div className="relative mb-4">
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  "Image",
                  "Product",
                  "Rating",
                  "Customer",
                  "Verified",
                  // "Helpfull Count",
                  "Status",
                  "Featured",
                  "Date",
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
                  <TableCell colSpan={9} className="h-20 text-center">
                    <DataLoading />
                  </TableCell>
                </TableRow>
              ) : reviews?.length > 0 ? (
                reviews.map((item) => (
                  <TableRow key={item.id} className="text-center">
                    <TableCell className="min-w-[100px] truncate">
                      <div className="flex items-center    justify-center gap-2">
                        {item.images?.[0] ? (
                          <>
                            <div className="relative">
                              <img
                                src={item.images[0]}
                                alt="Review image"
                                loading="lazy"
                                className="size-14 rounded bg-gray-200 object-contain "
                              />
                              <span className="absolute bottom-0 right-0 bg-black text-white text-xs rounded px-1">
                                +{item.images.length - 1}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="size-14 rounded bg-gray-200 flex border border-dotted justify-center items-center">
                            <LucideImage className="size-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="min-w-[120px] text-left">
                      {item.productVariant?.productVariantTitle || "N/A"}
                    </TableCell>
                    <TableCell className="min-w-[80px]">
                      <span className="border-2 flex items-center justify-center gap-4 border-gray-200 rounded-full px-0 py-1 text-sm text-center bg-white">
                        {item.rating || "N/A"} <FaStar />
                      </span>
                    </TableCell>
                    <TableCell className="min-w-[120px]">
                      {item.customer?.firstName
                        ? `${item.customer.firstName} ${
                            item.customer.lastName || ""
                          }`
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={item.isVerifiedBuyer ? "default" : "outline"}
                      >
                        {item.isVerifiedBuyer ? "Verified" : "Guest"}
                      </Badge>
                    </TableCell>
                    {/* <TableCell>{item.helpfulCount || 0}</TableCell> */}
                    <TableCell>
                      <button
                        className="text-xs font-medium text-white border-none rounded-md cp px-4 py-2"
                        style={{
                          backgroundColor: item.isApproved
                            ? "rgb(52 211 153 / var(--tw-text-opacity, 1))"
                            : "#F44336",
                        }}
                        onClick={() =>
                          handleToggleStatus(item.id, item.isApproved)
                        }
                        disabled={togglingIds[item.id]}
                      >
                        {item.isApproved ? "Approved" : "Disapproved"}
                      </button>
                    </TableCell>
                    <TableCell className="min-w-[80px]">
                      <Switch
                        checked={item.isFeatured}
                        onCheckedChange={() =>
                          handleStatus(item.id, item.isFeatured)
                        }
                        disabled={togglingIds[item.id]}
                      />
                    </TableCell>
                    <TableCell className="min-w-[140px]">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="edit"
                          size="sm"
                          onClick={() => handleViewDetails(item)}
                          className="hover:bg-gray-100 px-4 py-2"
                        >
                          View
                        </Button>
                        <Button
                          variant="edit"
                          size="sm"
                          onClick={() => handleDeleteClick(item.id)}
                          className="hover:bg-gray-100"
                        >
                          <FiTrash2 className="text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
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
            currentPage={Number(pagination.page) || 1}
            totalPages={pagination.totalPages || 1}
            totalCount={pagination.totalCount || 0}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Review Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-3xl   p-3 sm:p-6 bg-white rounded-lg shadow-xl ">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Review Details
            </DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 items-start  md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </h4>
                    <p className="text-xs text-gray-700">
                      {selectedReview.productVariant?.productVariantTitle}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </h4>
                    <p className="text-xs text-gray-700">
                      {selectedReview.customer?.firstName
                        ? `${selectedReview.customer.firstName} ${
                            selectedReview.customer.lastName || ""
                          }`
                        : "Guest"}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </h4>
                    <div className="flex items-center gap-1.5">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className={`w-4 h-4 ${
                              star <= selectedReview.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-medium text-gray-700">
                        {selectedReview.rating}/5
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </h4>
                    <p className="text-xs text-gray-700">
                      {format(
                        new Date(selectedReview.createdAt),
                        "MMM dd, yyyy HH:mm"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 items-center md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verified Buyer
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-700">
                    {selectedReview.isVerifiedBuyer ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </h4>
                  <Badge
                    className={`px-3 py-1 text-[10px] sm:text-xs font-medium rounded-full ${
                      selectedReview.isApproved
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {selectedReview.isApproved ? "Approved" : "Pending"}
                  </Badge>
                </div>
              </div>

              <div className="flex justify-between gap-4 items-start">
                <div className="space-y-4 w-[80%]">
                  <div className="border-t border-gray-100 pt-2">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Review Title
                    </h4>
                    <p className="text-xs sm:text-sm font-medium text-gray-800 mt-1">
                      {selectedReview.reviewTitle}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Review
                    </h4>
                    <p className="text-xs h-[150px] overflow-y-auto text-gray-700 leading-snug bg-gray-50 p-3 rounded mt-1">
                      {selectedReview.reviewBody}
                    </p>
                  </div>
                </div>

                {selectedReview.images?.length > 0 && (
                  <div className="w-[20%]">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Images ({selectedReview.images.length})
                    </h4>
                    <div className="grid grid-cols-1  gap-3 max-h-[200px] overflow-x-auto">
                      {selectedReview.images.map((img, index) => (
                        <Zoom key={index}>
                          <div className="relative aspect-square">
                            <img
                              src={img}
                              alt={`Review ${index + 1}`}
                              className="w-full h-full object-cover rounded border border-gray-200"
                            />
                          </div>
                        </Zoom>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-sm sm:text-base">
            Are you sure you want to delete this review?
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reviews;
