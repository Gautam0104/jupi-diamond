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
import { useFormik } from "formik";
import * as Yup from "yup";

import {
  createCoupon,
  deleteCoupon,
  getCoupons,
  updateCoupon,
  getCouponById,
  updateCouponStatus,
} from "../../../api/Admin/CouponApi";
import DataLoading from "../../../components/Loaders/DataLoading";
import { Switch } from "../../../components/ui/switch";
import { FiSearch, FiTrash2, FiX } from "react-icons/fi";
import { toast } from "sonner";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import useFiltration from "../../../Hooks/useFilteration";
import PaginationComponent from "../../../components/PaginationComponent/PaginationComponent";

const today = new Date();
today.setHours(0, 0, 0, 0);
// Validation schema
const couponSchema = Yup.object().shape({
  code: Yup.string()
    .required("Code is required")
    .max(20, "Code must be at most 20 characters"),
  discountType: Yup.string()
    .required("Discount type is required")
    .oneOf(["PERCENTAGE", "FIXED"], "Invalid discount type"),
  discountValue: Yup.number()
    .required("Discount value is required")
    .positive("Discount must be positive")
    .test("max-percentage", "Percentage cannot exceed 100%", function (value) {
      const { discountType } = this.parent;
      if (discountType === "PERCENTAGE") {
        return value <= 100;
      }
      return true;
    }),
  minCartValue: Yup.number()
    .min(0, "Minimum cart value cannot be negative")
    .required("Minimum cart value is required"),
  usageLimit: Yup.number().min(0, "Usage limit cannot be negative").nullable(),
  validFrom: Yup.date()
    .typeError("Valid from must be a valid date")
    .min(today, "Valid from cannot be in the past")
    .required("Valid from date is required"),
  validTo: Yup.date()
    .required("Valid to date is required")
    .min(
      Yup.ref("validFrom"),
      "Valid to must be after valid from",
      function (endDate) {
        return endDate >= this.parent.validFrom;
      }
    ),
});

const Coupon = () => {
  const {
    clearFilters,
    filters,
    handleFilterChangeHook,
    handlePaginationChange,
    debouncedSearch,
  } = useFiltration();

  const [loading, setLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [pagination, setPagination] = useState({});

  const currentPage = pagination.page;
  const totalPages = Math.ceil(pagination.totalCount / pagination.limit);

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await getCoupons({
        page: filters.page || 1,
        limit: 10,
        search: debouncedSearch,
      });
      setCoupons(response.data.data.coupons);

      setPagination(response.data.data.pagination);
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(filters.page);
  }, [debouncedSearch, filters.page, filters.limit]);

  const formik = useFormik({
    initialValues: {
      code: "",
      discountType: "FIXED",
      discountValue: 0,
      minCartValue: 0,
      usageLimit: "",
      validFrom: "",
      validTo: "",
    },
    validationSchema: couponSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        let response;
        const formattedValues = {
          ...values,
          usageLimit: values.usageLimit === "" ? null : values.usageLimit,
          validFrom: new Date(values.validFrom).toISOString(),
          validTo: new Date(values.validTo).toISOString(),
        };

        if (isEditMode) {
          response = await updateCoupon(currentEditId, formattedValues);
        } else {
          response = await createCoupon(formattedValues);
        }

        if (response.data.success) {
          toast.success(
            `Coupon ${isEditMode ? "updated" : "created"} successfully`
          );
          resetForm();
          fetchData();
        } else {
          toast.error(
            response.data?.message ||
              `Failed to ${isEditMode ? "update" : "create"} coupon`
          );
        }
      } catch (error) {
        console.log("Submit error:", error);
        toast.error(
          error.response?.data?.message ||
            `Failed to ${isEditMode ? "update" : "create"} coupon`
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const response = await getCouponById(id);
      const couponData = response.data.data;

      const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        const offset = date.getTimezoneOffset();
        const adjustedDate = new Date(date.getTime() - offset * 60000);
        return adjustedDate.toISOString().split("T")[0];
      };

      formik.setValues({
        code: couponData.code,
        discountType: couponData.discountType,
        discountValue: couponData.discountValue,
         minCartValue: couponData.minCartValue || 0,
  usageLimit: couponData.usageLimit || "",
        validFrom: formatDateForInput(couponData.validFrom),
        validTo: formatDateForInput(couponData.validTo),
      });

      setCurrentEditId(id);
      setIsEditMode(true);
      setIsDialogOpen(true);
    } catch (error) {
      console.log("Error fetching coupon:", error);
      toast.error("Failed to load coupon for editing");
    } finally {
      setLoading(false);
    }
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    formik.resetForm();
    setIsDialogOpen(false);
    setIsEditMode(false);
    setCurrentEditId(null);
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
      const response = await deleteCoupon(id);
      if (response.data.success) {
        toast.success("Coupon deleted successfully");
        fetchData();
      } else {
        toast.error(response.data.message || "Failed to delete coupon");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete coupon");
    }
  };

  const handlePageChange = (page) => {
    handlePaginationChange(page);
    fetchData(page);
  };

  const [togglingIds, setTogglingIds] = useState({});

  const handleToggleStatus = async (id, currentStatus) => {
    setTogglingIds((prev) => ({ ...prev, [id]: true }));

    try {
      const res = await updateCouponStatus(id);
      console.log("Toggle response:", res);
      if (res.status === 201) {
        toast.success("Coupon Status updated Successfully !!");
        setCoupons((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, isActive: !currentStatus } : item
          )
        );
      }
    } catch (error) {
      console.log("Toggle failed:", error);
      toast.error("Failed to update status");
    } finally {
      setTogglingIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 ">
        <h2 className="text-2xl font-semibold">Coupons</h2>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2">
          <h2 className="text-md font-semibold">Coupons</h2>

          <div className="flex items-center gap-2">
            <Button className="addButton truncate" onClick={openAddDialog}>
              Add Coupon
            </Button>
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
                  "Code",
                  "Discount",
                  "Discount Type",
                  "Min Cart Value",
                  "Usage Limit",
                  "Used Count",
                  "Valid From",
                  "Valid To",
                  "Created At",
                  "Status",
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
                  <TableCell colSpan={11} className="h-20 text-center">
                    <DataLoading />
                  </TableCell>
                </TableRow>
              ) : coupons?.length > 0 ? (
                coupons.map((item) => (
                  <TableRow key={item.id} className="text-center">
                    <TableCell className="min-w-[100px]">{item.code}</TableCell>
                    <TableCell className="min-w-[100px]">
                      {item.discountType === "PERCENTAGE"
                        ? `${item.discountValue}%`
                        : `₹${item.discountValue}`}
                    </TableCell>
                    <TableCell className="min-w-[100px]">
                      {item.discountType === "PERCENTAGE"
                        ? "Percentage"
                        : "Fixed Amount"}
                    </TableCell>
                    <TableCell className="min-w-[100px]">
                      ₹{item.minCartValue || 0}
                    </TableCell>
                    <TableCell className="min-w-[100px]">
                      {item.usageLimit || "Unlimited"}
                    </TableCell>
                    <TableCell className="min-w-[100px]">
                      {item.usedCount || 0}
                    </TableCell>
                    <TableCell className="min-w-[80px]">
                      {new Date(item.validFrom).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="min-w-[80px]">
                      {new Date(item.validTo).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
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
                    <TableCell className="min-w-[80px]">
                      <Switch
                        checked={item.isActive}
                        onCheckedChange={() =>
                          handleToggleStatus(item.id, item.isActive)
                        }
                        disabled={togglingIds[item.id]}
                      />
                    </TableCell>

                    <TableCell className="min-w-[80px]">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="edit"
                          size="sm"
                          className="text-xs md:text-sm px-6"
                          onClick={() => handleEdit(item.id)}
                        >
                          Edit
                        </Button>
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
                  <TableCell colSpan={11} className="h-24 text-center">
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

      {/* Add/Edit Coupon Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Coupon" : "Create Coupon"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the coupon details below."
                : "Fill in the details to create a new coupon."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-left">
                  Code
                </Label>
                <div className="col-span-3">
                  <Input
                    id="code"
                    name="code"
                    value={formik.values.code}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter coupon code"
                  />
                  {formik.touched.code && formik.errors.code ? (
                    <div className="mt-1 text-left text-xs text-red-500">
                      {formik.errors.code}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="discountType" className="text-left">
                  Discount Type
                </Label>
                <div className="col-span-3">
                  <Select
                    name="discountType"
                    value={formik.values.discountType}
                    onValueChange={(value) =>
                      formik.setFieldValue("discountType", value)
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select discount type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FIXED">Fixed Amount</SelectItem>
                      <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                    </SelectContent>
                  </Select>
                  {formik.touched.discountType && formik.errors.discountType ? (
                    <div className="mt-1 text-left text-xs text-red-500">
                      {formik.errors.discountType}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="discountValue" className="text-left">
                  Discount Value
                </Label>
                <div className="col-span-3">
                  <Input
                    id="discountValue"
                    name="discountValue"
                    type="number"
                    value={formik.values.discountValue}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={
                      formik.values.discountType === "PERCENTAGE"
                        ? "Enter percentage value"
                        : "Enter fixed amount"
                    }
                  />
                  {formik.touched.discountValue &&
                  formik.errors.discountValue ? (
                    <div className="mt-1 text-left text-xs text-red-500">
                      {formik.errors.discountValue}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="minCartValue" className="text-left">
                  Min Cart Value
                </Label>
                <div className="col-span-3">
                  <Input
                    id="minCartValue"
                    name="minCartValue"
                    type="number"
                    value={formik.values.minCartValue}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter minimum cart value"
                  />
                  {formik.touched.minCartValue && formik.errors.minCartValue ? (
                    <div className="mt-1 text-left text-xs text-red-500">
                      {formik.errors.minCartValue}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="usageLimit" className="text-left">
                  Usage Limit
                </Label>
                <div className="col-span-3">
                  <Input
                    id="usageLimit"
                    name="usageLimit"
                    type="number"
                    value={formik.values.usageLimit}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Leave empty for unlimited"
                  />
                  {formik.touched.usageLimit && formik.errors.usageLimit ? (
                    <div className="mt-1 text-left text-xs text-red-500">
                      {formik.errors.usageLimit}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="validFrom" className="text-left">
                  Valid From
                </Label>
                <div className="col-span-3">
                  <Input
                    id="validFrom"
                    name="validFrom"
                    type="date"
                    value={formik.values.validFrom}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.validFrom && formik.errors.validFrom ? (
                    <div className="mt-1 text-left text-xs text-red-500">
                      {formik.errors.validFrom}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="validTo" className="text-left">
                  Valid To
                </Label>
                <div className="col-span-3">
                  <Input
                    id="validTo"
                    name="validTo"
                    type="date"
                    value={formik.values.validTo}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="col-span-3"
                  />
                  {formik.touched.validTo && formik.errors.validTo ? (
                    <div className="mt-1 text-left text-xs text-red-500">
                      {formik.errors.validTo}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : isEditMode
                  ? "Update Coupon"
                  : "Create Coupon"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this coupon? This action cannot be
              undone.
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

export default Coupon;
