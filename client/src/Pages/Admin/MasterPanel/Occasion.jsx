import { useEffect, useRef, useState } from "react";
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
import { Textarea } from "../../../components/ui/textarea";
import PaginationComponent from "../../../components/PaginationComponent/PaginationComponent";
import { toast } from "sonner";
import {
  getOccassion,
  toggleOccassionStatus,
  createOccassion,
  updateOccassion,
  deleteOccassion,
  getOccassionById,
} from "../../../api/Admin/OccationAPi";

const Occasion = () => {
  const {
    clearFilters,
    filters,
    handleFilterChangeHook,
    handlePaginationChange,
    debouncedSearch,
  } = useFiltration();

  const [pagination, setPagination] = useState({});
  const [occasions, setOccasions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [filePreview, setFilePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const currentPage = pagination.page;
  const totalPages = Math.ceil(pagination.totalCount / pagination.limit);

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await getOccassion({
        page: filters.page || 1,
        limit: 10,
        search: debouncedSearch,
      });
      setOccasions(response.data.data.result);
      setPagination(response.data.data.pagination);
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to fetch occasions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(filters.page);
  }, [debouncedSearch, filters.page, filters.limit]);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [occasionToDelete, setOccasionToDelete] = useState(null);

  const handleDeleteClick = (id) => {
    setOccasionToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (occasionToDelete) {
      await handleDeleteOccasion(occasionToDelete);
      setDeleteConfirmOpen(false);
      setOccasionToDelete(null);
    }
  };

  const handleDeleteOccasion = async (id) => {
    try {
      const response = await deleteOccassion(id);
      if (response.status === 200) {
        toast.success("Occasion deleted successfully");
        fetchData(currentPage);
      } else {
        toast.error(response.data.message || "Failed to delete occasion");
      }
    } catch (error) {
      console.log("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete occasion");
    }
  };

  const handlePageChange = (page) => {
    handlePaginationChange(page, filters.pageSize);
  };

  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const response = await getOccassionById(id);

      const occasionData = response.data.data.data;

      setValue("name", occasionData.name);
      setValue("description", occasionData.description);

      if (occasionData.imageUrl) {
        setFilePreview(occasionData.imageUrl);
      }

      setCurrentEditId(id);
      setIsEditMode(true);
      setIsDialogOpen(true);
    } catch (error) {
      console.log("Error fetching occasion:", error);
      toast.error("Failed to load occasion for editing");
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
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      let response;
      if (isEditMode) {
        response = await updateOccassion(currentEditId, formData);
      } else {
        if (!selectedFile) {
          toast.error("Image is required");
          setIsSubmitting(false);
          return;
        }
        response = await createOccassion(formData);
      }

      if (response.status === 200) {
        toast.success(
          `Occasion ${isEditMode ? "updated" : "created"} successfully`
        );
        resetForm();
        fetchData();
      } else {
        toast.error(
          response.data.message ||
            `Failed to ${isEditMode ? "update" : "create"} occasion`
        );
      }
    } catch (error) {
      console.log("Submit error:", error);
      toast.error(
        error.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} occasion`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    reset();
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
      const res = await toggleOccassionStatus(id);
      toast.success("Occasion Status Updated !!");
      setOccasions((prev) =>
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-md font-semibold">Occasions</p>
          <div className="flex items-center gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="addButton truncate " onClick={openAddDialog}>
                  Add More
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>
                    {isEditMode ? "Edit" : "Add"} Occasion
                  </DialogTitle>
                  <DialogDescription>
                    {isEditMode
                      ? "Update the occasion details below."
                      : "Fill in the details to create a new occasion."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        {...register("name", {
                          required: "Name is required",
                          minLength: {
                            value: 2,
                            message: "Name must be at least 2 characters",
                          },
                          maxLength: {
                            value: 50,
                            message: "Name must be less than 50 characters",
                          },
                        })}
                        className="text-xs sm:text-sm"
                        placeholder="Enter occasion name (e.g., New Year)"
                      />
                      {errors.name && (
                        <p className="text-xs -mt-1 text-red-500">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        className="text-xs sm:text-sm"
                        {...register("description", {
                          required: "Description is required",
                        })}
                        placeholder="Enter occasion description (e.g., This ring for new year occasion)"
                        rows={3}
                      />
                      {errors.description && (
                        <p className="text-xs -mt-1 text-red-500">
                          {errors.description.message}
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
                          <p className="text-xs sm:text-sm text-gray-500 mb-1">
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
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      disabled={isSubmitting}
                      className="text-xs sm:text-sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="min-w-[100px] text-xs sm:text-sm"
                    >
                      {isSubmitting
                        ? isEditMode
                          ? "Updating..."
                          : "Creating..."
                        : isEditMode
                        ? "Update Occasion"
                        : "Create Occasion"}
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
                placeholder="Search occasions..."
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
                  // "S.No.",
                  "Image",
                  "Name",
                  "Description",
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
              ) : occasions?.length > 0 ? (
                occasions.map((item, index) => (
                  <TableRow key={item.id} className="text-center">
                    {/* <TableCell className="min-w-[100px]">
                      {(currentPage - 1) * pagination.limit + index + 1}.
                    </TableCell> */}
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
                    <TableCell className="min-w-[100px] max-w-[140px] text-left">
                      {item.name}
                    </TableCell>
                    <TableCell className="min-w-[80px] max-w-[200px] text-left">
                      <div
                        className={expandedRows[item.id] ? "" : "line-clamp-2"}
                      >
                        {item.description}
                      </div>
                      {item.description.split(/\s+/).length > 20 && (
                        <button
                          className="text-lime-500 font-medium cp text-xs mt-1"
                          onClick={() =>
                            setExpandedRows((prev) => ({
                              ...prev,
                              [item.id]: !prev[item.id],
                            }))
                          }
                        >
                          {expandedRows[item.id] ? "Show less" : "Show more"}
                        </button>
                      )}
                    </TableCell>
                    <TableCell className="min-w-[80px] max-w-[150px] ">
                      <div className="flex items-start justify-start gap-1 truncate">
                        {item.occasionSlug}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(item.occasionSlug);
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
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex justify-center items-center">
                      <span className="text-gray-500">No occasions found</span>
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
              Are you sure you want to delete this occasion? This action cannot
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
              Delete Occasion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Occasion;
