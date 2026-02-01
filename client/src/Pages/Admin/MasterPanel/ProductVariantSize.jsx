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
import { FiSearch, FiTrash2, FiX, FiEdit } from "react-icons/fi";
import useFiltration from "../../../Hooks/useFilteration";
import { Input } from "../../../components/ui/input";
import {
  createProductSize,
  deleteProductSize,
  getProductSize,
  getProductSizeById,
  updateProductSize,
} from "../../../api/Admin/ProductApi";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getJewelleryType } from "../../../api/Admin/JewelleryApi";
import PaginationComponent from "../../../components/PaginationComponent/PaginationComponent";

const ProductVariantSize = () => {
  const {
    clearFilters,
    filters,
    handlePaginationChange,
    handleFilterChangeHook,
    debouncedSearch,
  } = useFiltration();

  const [productSize, setProductSize] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [jewelleryType, setJewelleryType] = useState([]);
  const [pagination, setPagination] = useState({});
  const [selectedJewelryTypeSlug, setSelectedJewelryTypeSlug] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getProductSize({
        search: debouncedSearch,
        page: filters.page || 1,
        limit: 10,
        jewelryTypeId: filters.jewelryTypeId || "",
      });
      setProductSize(response.data.data.result);
      setPagination(response.data.data.pagination || {});

      const res = await getJewelleryType();
      setJewelleryType(res.data.data.jewelryType);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch product size");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [debouncedSearch, filters.jewelryTypeId, filters.page, filters.limit]);

  const handleDeleteClick = (id) => {
    setProductToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      await handleDeleteProductSize(productToDelete);
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
    }
  };

  const handleDeleteProductSize = async (id) => {
    try {
      const response = await deleteProductSize(id);
      if (response.data.success) {
        toast.success("Product Size deleted successfully");
        fetchData();
      } else {
        toast.error(response.data.message || "Failed to delete product Size");
      }
    } catch (error) {
      console.log("Delete error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete product Size"
      );
    }
  };

  const sizeValidationSchema = Yup.object().shape({
    label: Yup.string().test(
      "label-required",
      "Size is required",
      function (value) {
        const { jewelryTypeSlug } = this.parent;
        return jewelryTypeSlug !== "bangles" ? !!value : true;
      }
    ),
    labelSize: Yup.string().test(
      "labelSize-required",
      "Label Size is required",
      function (value) {
        const { jewelryTypeSlug } = this.parent;
        return jewelryTypeSlug === "bangles" ? !!value : true;
      }
    ),
    unit: Yup.string().required("Unit is required"),
    circumference: Yup.string().nullable(),
    jewelryTypeId: Yup.string().required("Jewelry type is required"),
  });

  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const response = await getProductSizeById(id);
      const productData = response.data.data;

      // Find the jewelry type slug for the current product
      const jewelryType = jewelleryType.find(
        (type) => type.id === productData.jewelryTypeId
      );
      const jewelryTypeSlug = jewelryType?.jewelryTypeSlug || "";

      formik.setValues({
        label: productData.label,
        labelSize: productData.labelSize || "",
        unit: productData.unit,
        circumference: productData.circumference || "",
        jewelryTypeId: productData.jewelryTypeId || "",
        jewelryTypeSlug: jewelryTypeSlug,
      });

      setSelectedJewelryTypeSlug(jewelryTypeSlug);
      setCurrentEditId(id);
      setIsEditMode(true);
      setIsDialogOpen(true);
    } catch (error) {
      console.log("Error fetching product size:", error);
      toast.error("Failed to load product size for editing");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsDialogOpen(false);
    setIsEditMode(false);
    setCurrentEditId(null);
    setSelectedJewelryTypeSlug("");
  };

  const resetDialogForm = () => {
    formik.resetForm();
    setIsDialogOpen(false);
    setIsEditMode(false);
    setCurrentEditId(null);
    setSelectedJewelryTypeSlug("");
  };

  const formik = useFormik({
    initialValues: {
      label: "",
      labelSize: "",
      unit: "",
      circumference: "",
      jewelryTypeId: "",
      jewelryTypeSlug: "",
    },
    validationSchema: sizeValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      try {
        // Prepare payload based on jewelry type
        const payload = {
          ...values,
          // For bangles, use labelSize and set label to null
          label: values.jewelryTypeSlug === "bangles" ? null : values.label,
          labelSize:
            values.jewelryTypeSlug === "bangles" ? values.labelSize : null,
          circumference:
            values.circumference === "" ? null : values.circumference,
        };

        // Remove jewelryTypeSlug from payload as it's not needed in the API
        delete payload.jewelryTypeSlug;

        let response;
        if (isEditMode) {
          response = await updateProductSize(currentEditId, payload);
        } else {
          response = await createProductSize(payload);
        }

        if (response.status === 200 || response.status === 201) {
          toast.success(
            `Product size ${isEditMode ? "updated" : "created"} successfully`
          );
          resetForm();
          resetDialogForm();
          fetchData();
        } else {
          toast.error(
            response.data.message ||
              `Failed to ${isEditMode ? "update" : "create"} product size`
          );
        }
      } catch (error) {
        console.log("Submit error:", error);
        toast.error(
          error.response?.data?.message ||
            `Failed to ${isEditMode ? "update" : "create"} product size`
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleJewelryTypeChange = (value) => {
    const selectedType = jewelleryType.find((type) => type.id === value);
    const slug = selectedType?.jewelryTypeSlug || "";

    setSelectedJewelryTypeSlug(slug);
    formik.setFieldValue("jewelryTypeId", value);
    formik.setFieldValue("jewelryTypeSlug", slug);

    // Reset label and labelSize when changing jewelry type
    formik.setFieldValue("label", "");
    formik.setFieldValue("labelSize", "");
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handlePageChange = (page) => {
    handlePaginationChange(page, filters.pageSize);
  };

  return (
    <div className="w-full p-2 md:p-4">
      <div className="mb-4">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">Master Panel</h2>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 ">
          <p className="text-md font-semibold w-full sm:w-auto">
            {" "}
            Size Management
          </p>
          <div className="flex flex-row-reverse items-center gap-2 sm:w-auto py-1  overflow-x-auto w-full scrollbarWidthThinAdmin">
            <div className="relative flex items-center w-full md:max-w-[250px] min-w-[180px]">
              <div className="absolute left-3 text-gray-400">
                <FiSearch className="w-5 h-5" />
              </div>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChangeHook}
                placeholder="Search..."
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
            <div className="w-[300px] sm:w-auto bg-white rounded-full">
              <Select
                onValueChange={(value) => {
                  handleFilterChangeHook({
                    target: {
                      name: "jewelryTypeId",
                      value: value === "all" ? "" : value,
                    },
                  });
                }}
                value={filters.jewelryTypeId || "all"}
              >
                <SelectTrigger className="w-full rounded-full font-medium">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jewelry Types</SelectItem>
                  {jewelleryType.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="addButton truncate " onClick={openAddDialog}>
                  Add More
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {isEditMode ? "Edit" : "Add"} Product Size
                  </DialogTitle>
                  <DialogDescription>
                    {isEditMode
                      ? "Update the product size details below."
                      : "Fill in the details to create a new product size."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={formik.handleSubmit} autoComplete="off">
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="jewelryTypeId">Jewelry Type</Label>
                      <Select
                        onValueChange={handleJewelryTypeChange}
                        value={formik.values.jewelryTypeId}
                        defaultValue={
                          isEditMode ? formik.values.jewelryTypeId : ""
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select jewelry type" />
                        </SelectTrigger>
                        <SelectContent>
                          {jewelleryType.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formik.touched.jewelryTypeId &&
                        formik.errors.jewelryTypeId && (
                          <p className="text-xs text-red-500 -mt-1">
                            {formik.errors.jewelryTypeId}
                          </p>
                        )}
                    </div>

                    {selectedJewelryTypeSlug === "bangles" ? (
                      <div className="grid gap-2">
                        <Label htmlFor="labelSize">Label Size</Label>
                        <Input
                          id="labelSize"
                          name="labelSize"
                          placeholder="Enter label size (e.g., 2-2, 2-4, 2-6)"
                          value={formik.values.labelSize}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.labelSize &&
                          formik.errors.labelSize && (
                            <p className="text-xs text-red-500 -mt-1">
                              {formik.errors.labelSize}
                            </p>
                          )}
                      </div>
                    ) : (
                      <div className="grid gap-2">
                        <Label htmlFor="label">Size</Label>
                        <Input
                          id="label"
                          name="label"
                          placeholder="Enter size (e.g., 9)"
                          value={formik.values.label}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.label && formik.errors.label && (
                          <p className="text-xs text-red-500 -mt-1">
                            {formik.errors.label}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="grid gap-2">
                      <Label htmlFor="unit">Unit</Label>
                      <Select
                        value={formik.values.unit}
                        onValueChange={(value) =>
                          formik.setFieldValue("unit", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MM">MM</SelectItem>
                          <SelectItem value="CM">CM</SelectItem>
                          <SelectItem value="INCH">INCH</SelectItem>
                          <SelectItem value="IN">IN</SelectItem>
                          <SelectItem value="US">US</SelectItem>
                        </SelectContent>
                      </Select>
                      {formik.touched.unit && formik.errors.unit && (
                        <p className="text-xs text-red-500 -mt-1">
                          {formik.errors.unit}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="circumference">
                        Circumference (optional)
                      </Label>
                      <Input
                        id="circumference"
                        name="circumference"
                        type="text"
                        placeholder="Enter circumference (e.g., 23.5 cm)"
                        value={formik.values.circumference}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        onWheel={(e) => e.target.blur()}
                        onKeyDown={(e) => {
                          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                            e.preventDefault();
                          }
                        }}
                        className="no-spinners"
                      />
                      {formik.touched.circumference &&
                        formik.errors.circumference && (
                          <p className="text-xs text-red-500 -mt-1">
                            {formik.errors.circumference}
                          </p>
                        )}
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting
                        ? isEditMode
                          ? "Updating..."
                          : "Saving..."
                        : isEditMode
                        ? "Update"
                        : "Save"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="rounded-xl border overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              {[
                "Size/Label",
                "Unit",
                "Circumference",
                "Jewelry Type",
                "Slug",
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
                <TableCell colSpan={7} className="h-20 text-center">
                  <DataLoading />
                </TableCell>
              </TableRow>
            ) : productSize?.length > 0 ? (
              productSize.map((item, index) => (
                <TableRow key={item.id} className="text-center">
                  <TableCell className="min-w-[100px]">
                    {item.label || item.labelSize}
                  </TableCell>
                  <TableCell className="min-w-[80px]">{item.unit}</TableCell>
                  <TableCell className="min-w-[100px]">
                    {item.circumference || "-"}
                  </TableCell>
                  <TableCell className="min-w-[150px]">
                    {item.JewelryType?.name || "-"}
                  </TableCell>
                  <TableCell className="min-w-[140px]">
                    <div className="flex items-center justify-center gap-1">
                      {item.productSizeSlug}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(item.productSizeSlug);
                          toast("Copied to clipboard !!");
                        }}
                        className="p-1 rounded hover:bg-gray-100 cp"
                        title="Copy to clipboard"
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
                  <TableCell className="min-w-[120px]">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="edit"
                        size="sm"
                        onClick={() => handleEdit(item.id)}
                        className="text-xs px-2 md:px-6"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="edit"
                        size="sm"
                        className="text-xs px-2 md:px-3"
                        onClick={() => handleDeleteClick(item.id)}
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
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
          currentPage={Number(pagination.currentPage || pagination.page)}
          totalPages={Number(pagination.totalPages)}
          onPageChange={handlePageChange}
          pageSize={Number(filters.pageSize)}
        />
      </div>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product size? This action
              cannot be undone.
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

export default ProductVariantSize;
