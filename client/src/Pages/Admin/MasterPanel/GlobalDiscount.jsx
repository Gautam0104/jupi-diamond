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
import { Label } from "../../../components/ui/label";
import DataLoading from "../../../components/Loaders/DataLoading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { FiSearch, FiTrash2, FiX, FiImage, FiEdit } from "react-icons/fi";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Switch } from "../../../components/ui/switch";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { toast } from "sonner";
import {
  createGlobalDiscount,
  deleteGlobalDiscount,
  getGlobalDiscountById,
  getGlobalDiscounts,
  updateGlobalDiscount,
} from "../../../api/Admin/DiscountApi";
import useFiltration from "../../../Hooks/useFilteration";
import PaginationComponent from "../../../components/PaginationComponent/PaginationComponent";

const GlobalDiscount = () => {
  const {
    clearFilters,
    filters,
    handleFilterChangeHook,
    handlePaginationChange,
    debouncedSearch,
  } = useFiltration();

  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [pagination, setPagination] = useState({});

  const currentPage = pagination.page;
  const totalPages = Math.ceil(pagination.totalCount / pagination.limit);

  // Validation Schema
  const discountSchema = Yup.object().shape({
    title: Yup.string()
      .required("Title is required")
      .min(2, "Title must be at least 2 characters")
      .max(50, "Title must be less than 50 characters"),
    description: Yup.string()
      .required("Description is required")
      .min(10, "Description must be at least 10 characters")
      .max(500, "Description must be less than 500 characters"),
    discountType: Yup.string()
      .required("Discount type is required")
      .oneOf(["PERCENTAGE", "FIXED"], "Invalid discount type"),
    discountValue: Yup.number()
      .required("Discount value is required")
      .min(1, "Discount must be at least 1")
      .test(
        "max-percentage",
        "Percentage discount cannot exceed 100%",
        function (value) {
          const { discountType } = this.parent;
          if (discountType === "PERCENTAGE") {
            return value <= 100;
          }
          return true;
        }
      ),
    validFrom: Yup.date()
      .required("Valid from date is required")
      .min(
        new Date(new Date().setHours(0, 0, 0, 0)),
        "Valid from date cannot be in the past"
      ),
    validTo: Yup.date()
      .required("Valid to date is required")
      .min(
        Yup.ref("validFrom"),
        "Valid to date must be after valid from date",
        function (value) {
          return value >= this.parent.validFrom;
        }
      ),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      discountType: "PERCENTAGE",
      discountValue: 0,
      validFrom: "",
      validTo: "",
    },
    validationSchema: discountSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        let response;
        const formattedValues = {
          ...values,
          validFrom: new Date(values.validFrom).toISOString(),
          validTo: new Date(values.validTo).toISOString(),
        };

        if (isEditMode) {
          response = await updateGlobalDiscount(currentEditId, formattedValues);
        } else {
          response = await createGlobalDiscount(formattedValues);
        }

        if (
          (!isEditMode && response.status === 201) ||
          (isEditMode && response.status === 200)
        ) {
          toast.success(
            `Discount ${isEditMode ? "updated" : "created"} successfully`
          );
          resetForm();
          fetchData();
        } else {
          toast.error(
            response.data?.message ||
              `Failed to ${isEditMode ? "update" : "create"} discount`
          );
        }
      } catch (error) {
        console.log("Submit error:", error);
        toast.error(
          error.response?.data?.message ||
            `Failed to ${isEditMode ? "update" : "create"} discount`
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await getGlobalDiscounts({
        page: filters.page || 1,
        limit: 10,
        search: debouncedSearch,
      });
      setDiscounts(response.data.data.discounts);

      setPagination(response.data.data.pagination);
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to fetch discounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(filters.page);
  }, [debouncedSearch, filters.page, filters.limit]);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [discountToDelete, setDiscountToDelete] = useState(null);

  const handleDeleteClick = (id) => {
    setDiscountToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (discountToDelete) {
      await handleDelete(discountToDelete);
      setDeleteConfirmOpen(false);
      setDiscountToDelete(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteGlobalDiscount(id);
      if (response.status === 200) {
        toast.success("Discount deleted successfully");
        fetchData();
      } else {
        toast.error(response.data.message || "Failed to delete Discount");
      }
    } catch (error) {
      console.log("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete Discount");
    }
  };

  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const response = await getGlobalDiscountById(id);
      const discountData = response.data.data;

      const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      };

      formik.setValues({
        title: discountData.title,
        description: discountData.description,
        discountType: discountData.discountType,
        discountValue: discountData.discountValue,
        validFrom: formatDateForInput(discountData.validFrom),
        validTo: formatDateForInput(discountData.validTo),
      });

      setCurrentEditId(id);
      setIsEditMode(true);
      setIsDialogOpen(true);
    } catch (error) {
      console.log("Error fetching discount:", error);
      toast.error("Failed to load discount for editing");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    formik.resetForm();
    setIsDialogOpen(false);
    setIsEditMode(false);
    setCurrentEditId(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };
  const handlePageChange = (page) => {
    handlePaginationChange(page, filters.pageSize);
  };
  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-4">Master Panel</h2>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-md font-semibold">Global Discount</p>
          <div className="flex items-center gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="addButton truncate " onClick={openAddDialog}>
                  Add More
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[725px] max-h-[80vh] overflow-y-auto scrollbarWidthThinAdmin">
                <DialogHeader>
                  <DialogTitle>
                    {isEditMode ? "Edit" : "Add"} Global Discount
                  </DialogTitle>
                  <DialogDescription>
                    {isEditMode
                      ? "Update the discount details below."
                      : "Fill in the details to create a new discount."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={formik.handleSubmit} autoComplete="off">
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="grid col-span-2  sm:col-span-1 gap-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        name="title"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="text-xs sm:text-sm"
                        placeholder="Enter discount title (e.g., Summer Sale)"
                      />
                      {formik.touched.title && formik.errors.title && (
                        <p className="text-xs -mt-1 text-red-500">
                          {formik.errors.title}
                        </p>
                      )}
                    </div>
                    <div className="grid col-span-2 sm:col-span-1 gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter discount description"
                        rows={3}
                        className="text-xs sm:text-sm"
                      />
                      {formik.touched.description &&
                        formik.errors.description && (
                          <p className="text-xs -mt-1 text-red-500">
                            {formik.errors.description}
                          </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="discountType">Discount Type</Label>
                      <select
                        id="discountType"
                        name="discountType"
                        value={formik.values.discountType}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="border rounded-md p-2 text-xs sm:text-sm "
                      >
                        <option value="PERCENTAGE">Percentage</option>
                        <option value="FIXED">Fixed Amount</option>
                      </select>
                      {formik.touched.discountType &&
                        formik.errors.discountType && (
                          <p className="text-xs -mt-1 text-red-500">
                            {formik.errors.discountType}
                          </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="discountValue">
                        {formik.values.discountType === "PERCENTAGE"
                          ? "Discount Percentage"
                          : "Discount Amount"}
                      </Label>
                      <Input
                        id="discountValue"
                        name="discountValue"
                        type="number"
                        value={formik.values.discountValue}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder={
                          formik.values.discountType === "PERCENTAGE"
                            ? "Enter percentage (e.g., 15)"
                            : "Enter amount (e.g., 500)"
                        }
                        onWheel={(e) => e.target.blur()}
                        onKeyDown={(e) => {
                          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                            e.preventDefault();
                          }
                        }}
                        className="no-spinners text-xs sm:text-sm"
                      />
                      {formik.touched.discountValue &&
                        formik.errors.discountValue && (
                          <p className="text-xs -mt-1 text-red-500">
                            {formik.errors.discountValue}
                          </p>
                        )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="validFrom">Valid From</Label>
                      <Input
                        id="validFrom"
                        name="validFrom"
                        type="date"
                        value={formik.values.validFrom}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        min={new Date().toISOString().split("T")[0]}
                        className="text-xs sm:text-sm"
                      />
                      {formik.touched.validFrom && formik.errors.validFrom && (
                        <p className="text-xs -mt-1 text-red-500">
                          {formik.errors.validFrom}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="validTo">Valid To</Label>
                      <Input
                        id="validTo"
                        name="validTo"
                        type="date"
                        value={formik.values.validTo}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        min={
                          formik.values.validFrom ||
                          new Date().toISOString().split("T")[0]
                        }
                        className="text-xs sm:text-sm"
                      />
                      {formik.touched.validTo && formik.errors.validTo && (
                        <p className="text-xs -mt-1 text-red-500">
                          {formik.errors.validTo}
                        </p>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="min-w-[100px]"
                    >
                      {isSubmitting
                        ? isEditMode
                          ? "Updating..."
                          : "Creating..."
                        : isEditMode
                        ? "Update Discount"
                        : "Create Discount"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

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
          </div>
        </div>
      </div>

      <div className="rounded-xl border">
        <div className="relative mb-4">
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  "Title",
                  "Description",
                  "Discount",
                  "Discount Type",
                  "Valid From",
                  "Valid To",
                  // "Status",
                  "Created At",
                  "Action",
                ].map((header) => (
                  <TableHead
                    key={header}
                    className="whitespace-nowrap text-center px-2"
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
              ) : discounts?.length > 0 ? (
                discounts.map((item) => (
                  <TableRow key={item.id} className="text-center ">
                    <TableCell className="min-w-[120px] max-w-[180px] px-2 text-left pl-7">
                      <div className="truncate">{item.title || "No Title"}</div>
                    </TableCell>
                    <TableCell className="min-w-[150px] max-w-[250px] px-2 text-left">
                      <div className="">{item.description || "N/A"}</div>
                    </TableCell>
                    <TableCell className="min-w-[100px] max-w-[150px] px-2">
                      <div className="truncate">
                        {item.discountType === "PERCENTAGE"
                          ? `${item.discountValue}%`
                          : item.discountType === "FIXED"
                          ? `₹${item.discountValue}`
                          : "N/A"}
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[120px] max-w-[180px] px-2">
                      {item.discountType === "PERCENTAGE"
                        ? "Percentage"
                        : item.discountType === "FIXED"
                        ? "Fixed Amount"
                        : "N/A"}
                    </TableCell>
                    <TableCell className="min-w-[100px] max-w-[150px] px-2">
                      {new Date(item.validFrom)
                        .toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                        .replace(/ /g, "-")}
                    </TableCell>
                    <TableCell className="min-w-[100px] max-w-[150px] px-2">
                      {new Date(item.validTo)
                        .toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                        .replace(/ /g, "-")}
                    </TableCell>
                    {/* <TableCell className="min-w-[80px] max-w-[100px] px-2">
                      <div className="flex justify-center">
                        <Switch checked={item.isActive} />
                      </div>
                    </TableCell> */}
                    <TableCell className="min-w-[160px] max-w-[160px] truncate px-2">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="min-w-[120px] max-w-[180px] px-2">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="edit"
                          size="sm"
                          onClick={() => handleEdit(item.id)}
                          className="text-xs md:text-sm px-4"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="edit"
                          size="sm"
                          className="text-xs md:text-sm p-2 rounded-sm hover:shadow-xl"
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
                  <TableCell colSpan={9} className="h-24 text-center">
                    <div className="flex justify-center items-center">
                      <span className="text-gray-500">No discounts found</span>
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

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this discount? This action cannot
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
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GlobalDiscount;
