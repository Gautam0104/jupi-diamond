import { useEffect, useRef, useState } from "react";
import { Button } from "../../../components/ui/button";
import { useForm } from "react-hook-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { FiImage, FiSearch, FiTrash2, FiUpload, FiX } from "react-icons/fi";

import { Switch } from "../../../components/ui/switch";
import useFiltration from "../../../Hooks/useFilteration";
import PaginationComponent from "../../../components/PaginationComponent/PaginationComponent";
import {
  createJewelleryType,
  deleteJewelleryType,
  getJewelleryType,
  toggleJewelleryType,
} from "../../../api/Admin/JewelleryApi";
import { toast } from "sonner";
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
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import EditJewelleryTypeForm from "./EditJewelleryTypeForm";

const JewelleryType = () => {
  const {
    clearFilters,
    filters,
    handleFilterChangeHook,
    handlePaginationChange,
    debouncedSearch,
  } = useFiltration();

  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [jewelType, setJewelType] = useState([]);
  const currentPage = pagination.page;
  const totalPages = Math.ceil(pagination.totalCount / pagination.limit);
  const totalCount = pagination.totalCount;
  const page = pagination.page;

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await getJewelleryType({
        search: debouncedSearch,
        page: filters.page || 1,
        limit: 10,
      });
      setJewelType(response.data.data.jewelryType);
      setPagination(response.data.data.pagination);
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(filters.page);
  }, [debouncedSearch, filters.page,filters.limit]);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [jewelToDelete, setJewelToDelete] = useState(null);

  const handleDeleteClick = (id) => {
    setJewelToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (jewelToDelete) {
      await handleDelete(jewelToDelete);
      setDeleteConfirmOpen(false);
      setJewelToDelete(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteJewelleryType(id);
      if (response.data.success) {
        toast.success("Jewellery Type deleted successfully");
        fetchData(currentPage);
      } else {
        toast.error(response.data.message || "Failed to delete jewellery type");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete jewellery type"
      );
    }
  };

  const handlePageChange = (page) => {
    handlePaginationChange(page, filters.pageSize);
  };

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      toast.warning("Please select an image file");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const removeFile = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
    fileInputRef.current.value = "";
  };

  const onSubmit = async (data) => {
    if (!file) {
      toast.error("Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("files", file);

    try {
      const response = await createJewelleryType(formData);
      if (response.status === 201) {
        toast.success("Jewellery type created successfully");
        reset();
        removeFile();
        setOpen(false);
        fetchData();
      } else {
        toast.error(response.data.message || "Failed to create jewellery type");
      }
    } catch (error) {
      console.error("Error creating jewellery type:", error);
      toast.error(
        error.response?.data?.message || "Failed to create jewellery type"
      );
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const [togglingIds, setTogglingIds] = useState({});

  const handleToggleStatus = async (id, currentStatus) => {
    setTogglingIds((prev) => ({ ...prev, [id]: true }));

    try {
      const res = await toggleJewelleryType(id);
      toast.success("Jewellery Type Status Updated !!");
      setJewelType((prev) =>
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
    <div className=" w-full ">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-4">Master Panel</h2>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-md font-semibold ">Jewellery Type</p>

          <div className="flex items-center gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="addButton truncate ">Add More</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Add New Jewellery Type
                  </DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6 mt-4"
                >
                  <div>
                    <Label htmlFor="name" className="block mb-2 font-medium">
                      Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="e.g. Gold Necklace, Diamond Ring"
                      className="w-full text-xs sm:text-sm xl:text-base"
                      {...register("name", {
                        required: "Name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters",
                        },
                      })}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="block mb-2 font-medium">
                      Image <span className="text-red-500">*</span>
                    </Label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />

                    {!preview ? (
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
                            src={preview}
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
                          {file.name}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setOpen(false);
                        reset();
                        removeFile();
                      }}
                      className="px-6"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">Creating...</span>
                      ) : (
                        "Create"
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            <div className="relative flex items-center w-full max-w-[250px] ">
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
                autoFocus
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

      <div className="rounded-xl border ">
        <div className="relative mb-4">
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  "Image",
                  "Name",
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
                  <TableCell colSpan={5} className="h-20 text-center">
                    <DataLoading />
                  </TableCell>
                </TableRow>
              ) : jewelType?.length > 0 ? (
                jewelType.map((item) => (
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
                      <div className="flex items-center justify-center gap-1">
                        {item.jewelryTypeSlug}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(item.jewelryTypeSlug);
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
                        <EditJewelleryTypeForm
                          jewelId={item.id}
                          fetchData={fetchData}
                        />
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
                              Are you sure you want to delete this jewellery
                              type? This action cannot be undone.
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
                  <TableCell colSpan={5} className="h-24 text-center">
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
    </div>
  );
};

export default JewelleryType;
