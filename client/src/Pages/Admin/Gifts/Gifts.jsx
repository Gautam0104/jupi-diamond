import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  FiSearch,
  FiTrash2,
  FiX,
  FiPlus,
  FiGift,
  FiUser,
  FiPhone,
  FiCreditCard,
  FiUserCheck,
  FiUserPlus,
  FiClock,
  FiCalendar,
  FiEdit,
} from "react-icons/fi";
import { toast } from "sonner";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import DataLoading from "../../../components/Loaders/DataLoading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { format } from "date-fns";
import {
  createGiftCard,
  fetchAllGiftCards,
  fetchGiftCardById,
  updateGiftCard,
  deleteGiftCard,
} from "../../../api/Admin/GiftApi";
import { fetchUser } from "../../../api/Admin/UserApi";
import useFiltration from "../../../Hooks/useFilteration";

const voucherSchema = Yup.object().shape({
  assignedToId: Yup.string().required("Customer is required"),
  value: Yup.number()
    .required("Value is required")
    .positive("Value must be positive"),
  expiresAt: Yup.date()
    .required("Expiry date is required")
    .min(new Date(), "Expiry date must be in the future"),
});

const GiftVouchers = () => {
  const [loading, setLoading] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [voucherToDelete, setVoucherToDelete] = useState(null);
  const {
    clearFilters,
    filters,
    handleFilterChangeHook,
    handlePaginationChange,
    debouncedSearch,
  } = useFiltration();

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const response = await fetchAllGiftCards({
        search: debouncedSearch,
        isRedeemed: filters.isRedeemed || "",
      });
      setVouchers(response.data.data);
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to fetch vouchers");
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetchUser();
      const customerData = response.data?.customer || [];

      const formattedCustomers = customerData.map((customer) => ({
        id: customer.id,
        name: `${customer.firstName} ${customer.lastName}`,
        phone: customer.phone,
      }));

      setCustomers(formattedCustomers);
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to fetch customers");
    }
  };

  useEffect(() => {
    fetchVouchers();
    fetchCustomers();
  }, [debouncedSearch, filters.isRedeemed]);

  const formik = useFormik({
    initialValues: {
      assignedToId: undefined,
      value: "",
      expiresAt: "",
    },
    validationSchema: voucherSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const payload = {
          ...values,
          expiresAt: new Date(values.expiresAt).toISOString(),
        };
        let response;
        if (isEditMode) {
          response = await updateGiftCard(currentEditId, payload);
        } else {
          response = await createGiftCard(payload);
        }

        if (response.data.success) {
          toast.success(
            `Voucher ${isEditMode ? "updated" : "created"} successfully`
          );
          resetForm();
          fetchVouchers();
        } else {
          toast.error(
            response.data?.message ||
              `Failed to ${isEditMode ? "update" : "create"} voucher`
          );
        }
      } catch (error) {
        console.log("Submit error:", error);
        toast.error(
          error.response?.data?.message ||
            `Failed to ${isEditMode ? "update" : "create"} voucher`
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const response = await fetchGiftCardById(id);
      const voucherData = response.data.data;
      console.log("Fetched voucher data:", voucherData);

      formik.setValues({
        assignedToId: voucherData.assignedToId,
        value: voucherData.value,
        expiresAt: format(
          new Date(voucherData.expiresAt),
          "yyyy-MM-dd'T'HH:mm"
        ),
      });

      setCurrentEditId(id);
      setIsEditMode(true);
      setIsDialogOpen(true);
    } catch (error) {
      console.log("Error fetching voucher:", error);
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
    setVoucherToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (voucherToDelete) {
      await handleDelete(voucherToDelete);
      setDeleteConfirmOpen(false);
      setVoucherToDelete(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteGiftCard(id);
      if (response.data.success) {
        toast.success("Voucher deleted successfully");
        fetchVouchers();
      } else {
        toast.error(response.data.message || "Failed to delete voucher");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete voucher");
    }
  };

  const VoucherCard = ({ voucher }) => {
    const expiryDate = new Date(voucher.expiresAt);
    const isExpired = expiryDate < new Date();
    const createdAt = new Date(voucher.createdAt);

    return (
      <div
        className={`border rounded-lg p-4 shadow-sm  ${
          isExpired ? "bg-gray-50" : "bg-white cardBG"
        }`}
      >
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <FiGift className="text-lime-500 mr-2" />
            <h3 className="font-bold text-xl text-lime-600">
              ₹{voucher.value}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                isExpired
                  ? "bg-red-100 text-red-800"
                  : "bg-lime-100 text-lime-800"
              }`}
            >
              {isExpired ? "Expired" : "Active"}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                voucher.isRedeemed
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {voucher.isRedeemed ? "Redeemed" : "Not Redeemed"}
            </span>
          </div>
        </div>

        <div className="space-y-2 text-sm mb-4">
          <div className="flex items-center font-medium text-gray-800 ">
            <span>
              <strong className="text-md">Code:</strong>{" "}
              <span>{voucher.code}</span>
            </span>
          </div>
          <div className="flex flex-row items-center gap-2 ">
            <div className="flex  items-center">
              <FiUser className="text-gray-400 capitalize mr-2 flex-shrink-0" />
              <span>
                {voucher.assignedTo?.firstName} {voucher.assignedTo?.lastName}
              </span>
            </div>
            <div className="flex  items-center">
              <FiPhone className="text-gray-400 mr-1 flex-shrink-0" />
              <span>{voucher.assignedTo?.phone}</span>
            </div>
          </div>

          <div className="flex items-center text-gray-600">
            <FiCalendar className="text-gray-400 mr-2 flex-shrink-0" />
            <span>Expires: {format(expiryDate, "dd MMM yyyy, hh:mm a")}</span>
          </div>

          {voucher.orderId && (
            <>
              <div className="bg-gray-100 p-2 rounded-md text-xs">
                <div className="flex flex-col gap-1 text-gray-600">
                  <div className="flex items-center text-gray-600">
                    <FiCreditCard className="text-gray-400 mr-2 flex-shrink-0" />
                    <span>Order: {voucher.orderId}</span>
                  </div>
                  {voucher.redeemedAt && (
                    <>
                      <div className="flex items-center">
                        <FiUserCheck className="text-gray-400 mr-2 text-sm" />
                        <span>
                          {" "}
                          Redeemed By: {voucher.redeemedBy.firstName ||
                            "N/A"}{" "}
                          {voucher.redeemedBy.lastName || ""}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <FiClock className="text-gray-400 mr-2 text-sm" />
                        <span>
                          {" "}
                          Redeemed At:{" "}
                          {format(voucher.redeemedAt, "dd MMM yyyy, hh:mm a")}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-2">
          <div>
            <span>Created At: {format(createdAt, "dd MMM yyyy, hh:mm a")}</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleEdit(voucher.id)}
              className="text-indigo-600 hover:text-indigo-800 p-1 cp"
            >
              <FiEdit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteClick(voucher.id)}
              className="text-red-500 hover:text-red-700 p-1 cp"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-2 gap-3 sm:gap-0">
          <h2 className="text-lg font-semibold">Gift Vouchers</h2>

          <div className="flex flex-col sm:flex-row items-stretch w-full sm:w-auto gap-3">
            <button
              className="addButton flex items-center justify-center sm:justify-start !px-4 gap-2 !text-xs sm:!text-sm w-full sm:w-auto"
              onClick={openAddDialog}
            >
              <FiPlus /> Create Voucher
            </button>

            <div className="flex flex-row sm:flex-row items-stretch gap-3 w-full sm:w-auto">
              <div className="w-auto sm:w-auto bg-white rounded-full">
                <Select
                  onValueChange={(value) => {
                    handleFilterChangeHook({
                      target: {
                        name: "isRedeemed",
                        value: value === "all" ? "" : value,
                      },
                    });
                  }}
                  aria-label="Filter by redemption status"
                  value={filters.isRedeemed || "all"}
                >
                  <SelectTrigger className="w-full rounded-full font-medium">
                    <SelectValue placeholder="Filter by redemption status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="true">Redeemed</SelectItem>
                    <SelectItem value="false">Not Redeemed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="relative flex  items-center w-full">
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
      </div>

      {loading ? (
        <DataLoading />
      ) : vouchers?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2  xl:grid-cols-3 gap-4">
          {vouchers.map((voucher) => (
            <VoucherCard key={voucher.id} voucher={voucher} />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-40">
          <span className="text-gray-500">No Vouchers Available</span>
        </div>
      )}

      {/* Add/Edit Voucher Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Voucher" : "Create Voucher"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the voucher details below."
                : "Fill in the details to create a new voucher."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit} className="text-xs sm:text-sm">
            <div className="grid gap-4 py-4 ">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="assignedToId"
                  className="text-left text-xs sm:text-sm"
                >
                  Customer
                </Label>
                <div className="col-span-3">
                  <Select
                    value={formik.values.assignedToId}
                    onValueChange={(value) =>
                      formik.setFieldValue("assignedToId", value)
                    }
                  >
                    <SelectTrigger className="text-xs sm:text-sm">
                      <SelectValue placeholder="Select a customer">
                        {customers.find(
                          (c) => c.id === formik.values.assignedToId
                        )?.name || "Select a customer"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="text-xs sm:text-sm">
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} ({customer.phone})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formik.touched.assignedToId && formik.errors.assignedToId ? (
                    <div className="mt-1 text-left text-xs sm:text-sm text-red-500">
                      {formik.errors.assignedToId}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4 ">
                <Label htmlFor="value" className="text-left text-xs sm:text-sm">
                  Value (₹)
                </Label>
                <div className="col-span-3">
                  <Input
                    id="value"
                    name="value"
                    type="number"
                    value={formik.values.value}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter voucher value"
                    className={"text-xs sm:text-sm"}
                  />
                  {formik.touched.value && formik.errors.value ? (
                    <div className="mt-1 text-left text-xs sm:text-sm text-red-500">
                      {formik.errors.value}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="expiresAt"
                  className="text-left text-xs sm:text-sm"
                >
                  Expiry Date
                </Label>
                <div className="col-span-3">
                  <Input
                    id="expiresAt"
                    name="expiresAt"
                    type="datetime-local"
                    value={formik.values.expiresAt}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    min={new Date().toISOString().slice(0, 16)}
                    className={"text-xs sm:text-sm"}
                  />
                  {formik.touched.expiresAt && formik.errors.expiresAt ? (
                    <div className="mt-1 text-left text-xs sm:text-sm text-red-500">
                      {formik.errors.expiresAt}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className={"text-xs sm:text-sm"}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className={"text-xs sm:text-sm"}
              >
                {isSubmitting
                  ? "Saving..."
                  : isEditMode
                  ? "Update Voucher"
                  : "Create Voucher"}
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
              Are you sure you want to delete this voucher? This action cannot
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

export default GiftVouchers;
