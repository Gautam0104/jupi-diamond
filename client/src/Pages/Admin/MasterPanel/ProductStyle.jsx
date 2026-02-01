import { useEffect, useState, useRef } from "react";
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
import { useForm } from "react-hook-form";
import useFiltration from "../../../Hooks/useFilteration";
import { Switch } from "../../../components/ui/switch";
import { Input } from "../../../components/ui/input";
import {
  createProductStyle,
  deleteProductStyle,
  getProductStyle,
  getProductStyleById,
  toggleProductStyle,
  updateProductStyle,
} from "../../../api/Admin/ProductApi";
import PaginationComponent from "../../../components/PaginationComponent/PaginationComponent";
import { toast } from "sonner";
import { getJewelleryType } from "../../../api/Admin/JewelleryApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

const ProductStyle = () => {
  const {
    clearFilters,
    filters,
    handleFilterChangeHook,
    handlePaginationChange,
    debouncedSearch,
  } = useFiltration();

  const [pagination, setPagination] = useState({});
  const [productStyle, setProductStyle] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const fileInputRef = useRef(null);
  const [jewelleryType, setJewelleryType] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      jewelryTypeId: "",
    },
  });

  const currentPage = pagination.page;
  const totalPages = Math.ceil(pagination.totalCount / pagination.limit);

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await getProductStyle({
        page: filters.page || 1,
        limit: 10,
        search: debouncedSearch,
         jewelryTypeId: filters.jewelryTypeId || "",
      });
      const res = await getJewelleryType();
      setJewelleryType(res.data.data.jewelryType);

      setProductStyle(response.data.data.result);
      setPagination(response.data.data.pagination);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(filters.page);
  }, [debouncedSearch,filters.jewelryTypeId, filters.page, filters.limit]);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const handleDeleteClick = (id) => {
    setProductToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      await handleDeleteProductStyle(productToDelete);
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
    }
  };

  const handleDeleteProductStyle = async (id) => {
    try {
      const response = await deleteProductStyle(id);
      if (response.data.success) {
        toast.success("Product Style deleted successfully");
        fetchData(currentPage);
      } else {
        toast.error(response.data.message || "Failed to delete product Style");
      }
    } catch (error) {
      console.log("Delete error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete product Style"
      );
    }
  };

  const handlePageChange = (page) => {
    handlePaginationChange(page);
    fetchData(page);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const response = await getProductStyleById(id);
      const productData = response.data.data;

      setValue("name", productData.name);
      setValue("description", productData.description);
      setValue("jewelryTypeId", productData.jewelryTypeId);

      if (productData.imageUrl) {
        setFilePreview(productData.imageUrl);
      }

      setCurrentEditId(id);
      setIsEditMode(true);
      setIsDialogOpen(true);
    } catch (error) {
      console.log("Error fetching product style:", error);
      toast.error("Failed to load product style for editing");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("jewelryTypeId", data.jewelryTypeId);

      if (selectedFile) {
        formData.append("mp", selectedFile);
      }

      let response;
      if (isEditMode) {
        response = await updateProductStyle(currentEditId, formData);
      } else {
        response = await createProductStyle(formData);
      }

      if (response.data.success) {
        toast.success(
          `Product style ${isEditMode ? "updated" : "created"} successfully`
        );
        resetForm();
        fetchData(currentPage);
      } else {
        toast.error(
          response.data.message ||
            `Failed to ${isEditMode ? "update" : "create"} product style`
        );
      }
    } catch (error) {
      console.log("Submit error:", error);
      toast.error(
        error.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} product style`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    reset();
    setSelectedFile(null);
    setFilePreview(null);
    setIsDialogOpen(false);
    setIsEditMode(false);
    setCurrentEditId(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const [togglingIds, setTogglingIds] = useState({});

  const handleToggleStatus = async (id, currentStatus) => {
    setTogglingIds((prev) => ({ ...prev, [id]: true }));

    try {
      const res = await toggleProductStyle(id);
      toast.success("Product Style Status Updated !!");
      setProductStyle((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isActive: !currentStatus } : item
        )
      );
    } catch (error) {
      console.log("Toggle failed:", error);
      toast.error("Failed to update status");
    } finally {
      setTogglingIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-4">Master Panel</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ">
          <p className="text-md font-semibold">Product Style</p>
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-y-auto scrollbarWidthThinAdmin">
            <div className="w-auto  bg-white rounded-full">
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
                <SelectTrigger className="w-full px-4 rounded-full font-medium">
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
                    {isEditMode ? "Edit" : "Add"} Product Style
                  </DialogTitle>
                  <DialogDescription>
                    {isEditMode
                      ? "Update the product style details below."
                      : "Fill in the details to create a new product style."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        {...register("name", { required: "Name is required" })}
                        placeholder="Enter product style name"
                      />
                      {errors.name && (
                        <p className="text-xs text-red-500 -mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        {...register("description", {
                          required: "Description is required",
                        })}
                        placeholder="Enter description"
                      />
                      {errors.description && (
                        <p className="text-xs text-red-500 -mt-1">
                          {errors.description.message}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="jewelryTypeId">Jewelry Type</Label>
                      <Select
                        onValueChange={(value) =>
                          setValue("jewelryTypeId", value)
                        }
                        defaultValue={
                          isEditMode ? getValues("jewelryTypeId") : ""
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
                      {errors.jewelryTypeId && (
                        <p className="text-xs text-red-500 -mt-1">
                          {errors.jewelryTypeId.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="block mb-2 font-medium">
                        Image{" "}
                        {!isEditMode && <span className="text-red-500">*</span>}
                      </Label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />

                      {!filePreview ? (
                        <div
                          onClick={triggerFileInput}
                          className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 cursor-pointer hover:border-primary transition-colors"
                        >
                          <FiImage className="h-10 w-10 text-gray-400 mb-3" />
                          <p className="text-sm text-gray-500 mb-1">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-400">
                            PNG, JPG (Max. 5MB)
                          </p>
                        </div>
                      ) : (
                        <div className="relative group">
                          <div className="border rounded-lg overflow-hidden">
                            <img
                              src={filePreview}
                              alt="Preview"
                              loading="lazy"
                              className="w-full h-48 object-contain bg-gray-100"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={removeFile}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
                          >
                            <FiX className="h-4 w-4" />
                          </button>
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {selectedFile?.name || "Current image"}
                          </p>
                        </div>
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
            <div className="relative flex items-center w-full min-w-[200px] sm:max-w-[250px]">
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
                  "Name",
                  "Description",
                  "Jewelry Type",
                  "Slug",
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
                  <TableCell colSpan={7} className="h-20 text-center">
                    <DataLoading />
                  </TableCell>
                </TableRow>
              ) : productStyle?.length > 0 ? (
                productStyle.map((item, index) => (
                  <TableRow key={item.id} className="text-center">
                    <TableCell className="min-w-[100px]">
                      <div className="flex items-center justify-center">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            loading="lazy"
                            className="rounded size-14 object-cover"
                          />
                        ) : (
                          <div className="relative aspect-square w-16 border border-dashed rounded flex items-center justify-center cursor-pointer hover:bg-gray-50">
                            <FiImage className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[100px]">{item.name}</TableCell>
                    <TableCell className="min-w-[80px]">
                      {item.description}
                    </TableCell>
                    <TableCell className="min-w-[80px]">
                      {jewelleryType.find(
                        (type) => type.id === item.jewelryTypeId
                      )?.name || "N/A"}
                    </TableCell>
                    <TableCell className="min-w-[80px]">
                      <div className="flex items-center justify-center gap-1">
                        {item.productStyleSlug}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              item.productStyleSlug
                            );
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
                    <TableCell className="min-w-[140px] truncate">
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
                          onClick={() => handleEdit(item.id)}
                          className="text-xs md:text-sm px-6"
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
                      <Dialog
                        open={deleteConfirmOpen}
                        onOpenChange={setDeleteConfirmOpen}
                      >
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this product
                              style? This action cannot be undone.
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
                              onClick={confirmDelete}
                            >
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
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

export default ProductStyle;
