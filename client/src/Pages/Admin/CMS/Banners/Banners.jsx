import { useEffect, useState, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { Label } from "../../../../components/ui/label";
import DataLoading from "../../../../components/Loaders/DataLoading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog";
import {
  FiSearch,
  FiTrash2,
  FiX,
  FiImage,
  FiEdit,
  FiPlus,
} from "react-icons/fi";
import { useForm } from "react-hook-form";
import useFiltration from "../../../../Hooks/useFilteration";
import { Switch } from "../../../../components/ui/switch";
import { Input } from "../../../../components/ui/input";
import PaginationComponent from "../../../../components/PaginationComponent/PaginationComponent";
import { toast } from "sonner";
import {
  createBanner,
  deleteBanner,
  getBannerById,
  getBanners,
  toggleBanner,
  updateBanner,
} from "../../../../api/Admin/BannerApi";
import { Button } from "../../../../components/ui/button";

const Banners = () => {
  const {
    clearFilters,
    filters,
    handleFilterChangeHook,
    handlePaginationChange,
    debouncedSearch,
  } = useFiltration();

  const [pagination, setPagination] = useState({});
  const [banner, setBanner] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedMobileFile, setSelectedMobileFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [mobileFilePreview, setMobileFilePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const fileInputRef = useRef(null);
  const mobileFileInputRef = useRef(null);
  const [expandedRows, setExpandedRows] = useState({});

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
      const response = await getBanners({
        page: filters.page || 1,
        limit: 10,
        search: debouncedSearch,
      });

      setBanner(response.data.data.banners);
      setPagination(response.data.data.pagination);
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to fetch banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(filters.page);
  }, [debouncedSearch, filters.page, filters.limit]);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const handleDeleteClick = (id) => {
    setProductToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      await handleDeletebanner(productToDelete);
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
    }
  };

  const handleDeletebanner = async (id) => {
    try {
      const response = await deleteBanner(id);
      if (response.data.success) {
        toast.success("Banner deleted successfully");
        fetchData(currentPage);
      } else {
        toast.error(response.data.message || "Failed to delete Banner");
      }
    } catch (error) {
      console.log("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete Banner");
    }
  };

  const handlePageChange = (page) => {
    handlePaginationChange(page);
    fetchData(page);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const triggerMobileFileInput = () => {
    mobileFileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.type;
    const isVideo = fileType.startsWith("video/");

    if (isVideo) {
      setSelectedFile(file);
      setFilePreview({
        url: URL.createObjectURL(file),
        type: fileType,
        isNew: true,
      });
    } else {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(file);
        setFilePreview({
          url: reader.result,
          type: fileType,
          isNew: true,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMobileFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.type;
    const isVideo = fileType.startsWith("video/");

    if (isVideo) {
      setSelectedMobileFile(file);
      setMobileFilePreview({
        url: URL.createObjectURL(file),
        type: fileType,
        isNew: true,
      });
    } else {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedMobileFile(file);
        setMobileFilePreview({
          url: reader.result,
          type: fileType,
          isNew: true,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    if (filePreview?.type?.startsWith("video/")) {
      URL.revokeObjectURL(filePreview.url);
    }
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeMobileFile = () => {
    if (mobileFilePreview?.type?.startsWith("video/")) {
      URL.revokeObjectURL(mobileFilePreview.url);
    }
    setSelectedMobileFile(null);
    setMobileFilePreview(null);
    if (mobileFileInputRef.current) {
      mobileFileInputRef.current.value = "";
    }
  };

  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const response = await getBannerById(id);
      const bannerData = response.data.data;

      setValue("title", bannerData.title);
      setValue("subtitle", bannerData.subtitle);
      setValue("redirectUrl", bannerData.redirectUrl);
      setValue("buttonName", bannerData.buttonName);

      // Set previews for existing files
      if (bannerData.imageUrl) {
        setFilePreview({
          url: bannerData.imageUrl,
          type: bannerData.imageUrl.match(/\.(mp4|mov|avi)$/i)
            ? "video/mp4"
            : "image/jpeg",
          isNew: false,
        });
      }
      if (bannerData.mobileFiles) {
        setMobileFilePreview({
          url: bannerData.mobileFiles,
          type: bannerData.mobileFiles.match(/\.(mp4|mov|avi)$/i)
            ? "video/mp4"
            : "image/jpeg",
          isNew: false,
        });
      }

      setCurrentEditId(id);
      setIsEditMode(true);
      setIsDialogOpen(true);
    } catch (error) {
      console.log("Error fetching banner:", error);
      toast.error("Failed to load banner for editing");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {

      if (!isEditMode) {
  if (!selectedFile) {
    toast.error("Desktop media is required");
    return;
  }
  if (!selectedMobileFile) {
    toast.error("Mobile media is required");
    return;
  }
}

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("subtitle", data.subtitle);
      formData.append("redirectUrl", data.redirectUrl);
      formData.append("buttonName", data.buttonName);

      if (selectedFile) {
        formData.append("desktopImg", selectedFile);
      }
      if (selectedMobileFile) {
        formData.append("mobileImg", selectedMobileFile);
      }

      let response;
      if (isEditMode) {
        response = await updateBanner(currentEditId, formData);
      } else {
        response = await createBanner(formData);
      }
      if (response.data.success) {
        toast.success(
          `Banner ${isEditMode ? "updated" : "created"} successfully`
        );
        resetForm();
        fetchData(currentPage);
      } else {
        toast.error(
          response.data.message ||
            `Failed to ${isEditMode ? "update" : "create"} banner`
        );
      }
    } catch (error) {
      console.log("Submit error:", error);
      toast.error(
        error.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} banner`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    reset();
    if (filePreview?.isNew && filePreview?.type?.startsWith("video/")) {
      URL.revokeObjectURL(filePreview.url);
    }
    if (
      mobileFilePreview?.isNew &&
      mobileFilePreview?.type?.startsWith("video/")
    ) {
      URL.revokeObjectURL(mobileFilePreview.url);
    }
    setSelectedFile(null);
    setSelectedMobileFile(null);
    setFilePreview(null);
    setMobileFilePreview(null);
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
      const res = await toggleBanner(id);
      toast.success("Banner Status Updated !!");
      setBanner((prev) =>
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

  // Render media preview (image or video)
  const renderMediaPreview = (preview, alt) => {
    if (!preview) return null;

    if (preview.type?.startsWith("video/")) {
      return (
        <video controls className="w-full h-48 object-contain bg-gray-100">
          <source src={preview.url} type={preview.type} />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return (
        <img
          src={preview.url}
          alt={alt}
          loading="lazy"
          className="w-full h-48 object-contain bg-gray-100"
        />
      );
    }
  };

  // Render table media (image or video)
  const renderTableMedia = (url, alt) => {
    if (!url) return null;

    if (url.match(/\.(mp4|mov|avi)$/i)) {
      return (
        <video controls className="rounded h-14 w-auto object-cover">
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return (
        <img
          src={url}
          alt={alt}
          loading="lazy"
          className="rounded h-14 w-auto object-cover"
        />
      );
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-4">CMS</h2>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-md font-semibold">Banners</p>
          <div className="flex items-center gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="addButton truncate bg-Lime  flex items-center gap-2"
                  onClick={openAddDialog}
                >
                  <FiPlus /> Create Banner
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                  <DialogTitle>
                    {isEditMode ? "Edit" : "Add"} Banner
                  </DialogTitle>
                  <DialogDescription>
                    {isEditMode
                      ? "Update the banner details below."
                      : "Fill in the details to create a new banner."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        {...register("title")}
                        placeholder="Enter banner title"
                      />
                      {/* {errors.title && (
                        <p className="text-sm text-red-500">
                          {errors.title.message}
                        </p>
                      )} */}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="subtitle">Subtitle</Label>
                      <Input
                        id="subtitle"
                        {...register("subtitle")}
                        placeholder="Enter subtitle"
                      />
                      {/* {errors.subtitle && (
                        <p className="text-sm text-red-500">
                          {errors.subtitle.message}
                        </p>
                      )} */}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="redirectUrl">Redirect URL</Label>
                      <Input
                        id="redirectUrl"
                        {...register("redirectUrl")}
                        placeholder="Enter redirect URL"
                      />
                      {/* {errors.redirectUrl && (
                        <p className="text-sm text-red-500">
                          {errors.redirectUrl.message}
                        </p>
                      )} */}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="buttonName">Button Name</Label>
                      <Input
                        id="buttonName"
                        {...register("buttonName")}
                        placeholder="Enter button name (e.g., 'Shop Now')"
                      />
                      {/* {errors.buttonName && (
                        <p className="text-sm text-red-500">
                          {errors.buttonName.message}
                        </p>
                      )} */}
                    </div>

                    <div className="grid gap-2">
                      <Label className="block mb-2 font-medium">
                        Desktop Media{" "}
                        {!isEditMode && <span className="text-red-500">*</span>}
                      </Label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*,video/*"
                        className="hidden"
                      />

                      {!filePreview ? (
                        <div
                          onClick={triggerFileInput}
                          className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-3 sm:p-8 cursor-pointer hover:border-primary transition-colors"
                        >
                          <FiImage className="h-10 w-10 text-gray-400 mb-3" />
                          <p className="text-xs text-gray-500 mb-1 text-center">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-400 text-center">
                            PNG, JPG, MP4 (Max. 5MB)
                          </p>
                        </div>
                      ) : (
                        <div className="relative group">
                          <div className="border rounded-lg overflow-hidden">
                            {renderMediaPreview(filePreview, "Desktop Preview")}
                          </div>
                          <button
                            type="button"
                            onClick={removeFile}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
                          >
                            <FiX className="h-4 w-4" />
                          </button>
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {selectedFile?.name || "Current media"}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label className="block mb-2 font-medium">
                        Mobile Media{" "}
                        {!isEditMode && <span className="text-red-500">*</span>}
                      </Label>
                      <input
                        type="file"
                        ref={mobileFileInputRef}
                        onChange={handleMobileFileChange}
                        accept="image/*,video/*"
                        className="hidden"
                      />

                      {!mobileFilePreview ? (
                        <div
                          onClick={triggerMobileFileInput}
                          className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-3 sm:p-8 cursor-pointer hover:border-primary transition-colors"
                        >
                          <FiImage className="h-10 w-10 text-gray-400 mb-3" />
                          <p className="text-xs text-gray-500 mb-1 text-center">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-400 text-center">
                            PNG, JPG, MP4 (Max. 5MB)
                          </p>
                        </div>
                      ) : (
                        <div className="relative group">
                          <div className="border rounded-lg overflow-hidden">
                            {renderMediaPreview(
                              mobileFilePreview,
                              "Mobile Preview"
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={removeMobileFile}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
                          >
                            <FiX className="h-4 w-4" />
                          </button>
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {selectedMobileFile?.name || "Current mobile media"}
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
            <div className="relative flex items-center w-full max-w-[250px]">
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
                  "Desktop",
                  "Mobile",
                  "Title",
                  "Sub Title",
                  "Button Name",
                  "Redirect URL",
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
                  <TableCell colSpan={9} className="h-20 text-center">
                    <DataLoading />
                  </TableCell>
                </TableRow>
              ) : banner?.length > 0 ? (
                banner.map((item, index) => (
                  <TableRow key={item.id} className="text-center">
                    <TableCell className="min-w-[100px]">
                      <div className="flex items-center justify-center aspect-video">
                        {renderTableMedia(item.imageUrl, item.title)}
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[100px]">
                      <div className="flex items-center justify-center aspect-square">
                        {renderTableMedia(item.mobileFiles, item.title)}
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[100px] text-balance">
                      {item.title || '-'}
                    </TableCell>
                    <TableCell className="min-w-[80px] max-w-[200px] text-left">
                      <div
                        className={expandedRows[item.id] ? "" : "line-clamp-2"}
                      >
                        {item.subtitle || '-'}
                      </div>
                      {item.subtitle.split(/\s+/).length > 10 && (
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

                    <TableCell className="min-w-[80px]">
                      {item.buttonName || '-'}
                    </TableCell>
                    <TableCell className="min-w-[80px]">
                      {item.redirectUrl || '-'}
                    </TableCell>
                    <TableCell className="min-w-[140px] text-balance">
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
                              Are you sure you want to delete this banner? This
                              action cannot be undone.
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
    </div>
  );
};

export default Banners;
