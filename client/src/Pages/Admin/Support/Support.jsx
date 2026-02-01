import { useEffect, useState } from "react";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

import DataLoading from "../../../components/Loaders/DataLoading";
import { FiSearch, FiTrash2, FiX } from "react-icons/fi";
import { toast } from "sonner";
import {
  deleteMessage,
  getAllMessages,
  updateMessageStatus,
} from "../../../api/Admin/ContactApi";
import useFiltration from "../../../Hooks/useFilteration";
import PaginationComponent from "../../../components/PaginationComponent/PaginationComponent";

const Support = () => {
  const {
    clearFilters,
    filters,
    handleFilterChangeHook,
    handlePaginationChange,
    debouncedSearch,
  } = useFiltration();

  const [loading, setLoading] = useState(false);
  const [contact, setContact] = useState([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [pagination, setPagination] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAllMessages({
        page: filters.page || 1,
        limit: 10,
        search: debouncedSearch,
      });
      setContact(response.data.data.contactData || []);
      setPagination(response.data.data.pagination || {});
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [debouncedSearch, filters.page, filters.limit]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await updateMessageStatus(id, { status: newStatus });
      if (response.status === 200) {
        toast.success("Status updated successfully !!");
        setContact(
          contact.map((item) =>
            item.id === id ? { ...item, status: newStatus } : item
          )
        );
      } else {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Status update error:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const handleDeleteClick = (id) => {
    setCouponToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (couponToDelete) {
      await handleDelete(couponToDelete);
      setDeleteConfirmOpen(false);
      setCouponToDelete(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteMessage(id);
      if (response.status === 200) {
        toast.success("Enquiry deleted successfully");
        fetchData();
      } else {
        toast.error(response.data.message || "Failed to delete Enquiry");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete Enquiry");
    }
  };

  function ExpandableCell({ message, maxLength = 60 }) {
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
      setExpanded(!expanded);
    };

    if (!message)
      return <TableCell className="min-w-[200px] text-left"></TableCell>;

    if (message.length <= maxLength || expanded) {
      return (
        <TableCell className="min-w-[200px] text-left">
          {message}
          {message.length > maxLength && (
            <button
              onClick={toggleExpand}
              className="text-blue-500 hover:text-blue-700 ml-2 text-sm"
            >
              Show Less
            </button>
          )}
        </TableCell>
      );
    }

    const truncatedMessage = message.substring(0, maxLength) + "...";
    return (
      <TableCell className="min-w-[200px] text-left">
        {truncatedMessage}
        <button
          onClick={toggleExpand}
          className="text-blue-500 hover:text-blue-700 ml-2 text-sm"
        >
          Show More
        </button>
      </TableCell>
    );
  }

  const handlePageChange = (page) => {
    handlePaginationChange(page, filters.pageSize);
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Form Enquiries / Support</h2>
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
      </div>

      <div className="rounded-xl border">
        <div className="relative mb-4">
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  "Name",
                  "Email",
                  "Phone",
                  "Subject",
                  "Message",
                  "Status",
                  "Created At",
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
                  <TableCell colSpan={8} className="h-20 text-center">
                    <DataLoading />
                  </TableCell>
                </TableRow>
              ) : contact?.length > 0 ? (
                contact.map((item) => (
                  <TableRow key={item.id} className="text-center">
                    <TableCell className="min-w-[120px] pl-6 text-left truncate">
                      {item.name}
                    </TableCell>
                    <TableCell className="min-w-[100px]">
                      {item.email}
                    </TableCell>
                    <TableCell className="min-w-[80px]">{item.phone}</TableCell>
                    <TableCell className="min-w-[170px] text-left">
                      {item.subject}
                    </TableCell>
                    <ExpandableCell message={item.message} />
                    <TableCell className="min-w-[80px]">
                      <Select
                        value={item.status}
                        onValueChange={(value) =>
                          handleStatusChange(item.id, value)
                        }
                      >
                        <SelectTrigger className="w-[120px] text-xs cp">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem className="!text-xs" value="PENDING">
                            PENDING
                          </SelectItem>
                          <SelectItem className="!text-xs" value="RESPONDED">
                            RESPONDED
                          </SelectItem>
                          <SelectItem className="!text-xs" value="CLOSED">
                            CLOSED
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="min-w-[120px]">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="min-w-[80px]">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="edit"
                          size="sm"
                          className="text-[10px] md:text-sm px-2 rounded-sm hover:shadow-xl"
                          onClick={() => handleDeleteClick(item.id)}
                        >
                          <FiTrash2 />
                        </Button>
                      </div>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this Enquiry? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className={"cp"}
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Support;
