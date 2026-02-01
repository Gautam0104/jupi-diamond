import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiImage, FiTrash2, FiX } from "react-icons/fi";
import { toast } from "sonner";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";

import { Button } from "../../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import DataLoading from "../../../../components/Loaders/DataLoading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import {
  fetchBlogCategory,
  toggleBlogCategoryStatus,
  createBlogCategory,
  fetchBlogCategoryById,
  updateBlogCategory,
  deleteBlogCategory,
} from "../../../../api/Admin/BlogApi";
import { Switch } from "../../../../components/ui/switch";
import { FaRegImage } from "react-icons/fa6";

const blogCategorySchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  image: Yup.mixed()
    .test("fileSize", "File too large (max 5MB)", (value) => {
      if (!value) return true;
      return value.size <= 5 * 1024 * 1024;
    })
    .test("fileType", "Unsupported file format", (value) => {
      if (!value) return true;
      return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
    }),
});

const BlogCategory = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchBlogCategory();
      setCategories(response.data.data);
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to fetch blog categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        toast.error("Only JPG, JPEG, and PNG files are allowed");
        return;
      }

      setSelectedFile(file);
      formik.setFieldValue("image", file);
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

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      image: null,
    },
    validationSchema: blogCategorySchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description);
        if (selectedFile) {
          formData.append("files", selectedFile);
        }

        let response;
        if (isEditMode) {
          response = await updateBlogCategory(currentEditId, formData);
        } else {
          response = await createBlogCategory(formData);
        }

        if (response.data.success) {
          toast.success(
            `Blog category ${isEditMode ? "updated" : "created"} successfully`
          );
          resetForm();
          fetchData();
        } else {
          toast.error(
            response.data?.message ||
              `Failed to ${isEditMode ? "update" : "create"} blog category`
          );
        }
      } catch (error) {
        console.log("Submit error:", error);
        toast.error(
          error.response?.data?.message ||
            `Failed to ${isEditMode ? "update" : "create"} blog category`
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const response = await fetchBlogCategoryById(id);
      const categoryData = response.data.data;

      formik.setValues({
        name: categoryData.name,
        description: categoryData.description,
        image: null,
      });

      if (categoryData.imageUrl) {
        setFilePreview(categoryData.imageUrl);
      }

      setCurrentEditId(id);
      setIsEditMode(true);
      setIsDialogOpen(true);
    } catch (error) {
      console.log("Error fetching blog category:", error);
      toast.error("Failed to load blog category for editing");
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
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeleteClick = (id) => {
    setCategoryToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      await handleDelete(categoryToDelete);
      setDeleteConfirmOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteBlogCategory(id);
      if (response.data.success) {
        toast.success("Blog category deleted successfully");
        fetchData();
      } else {
        toast.error(response.data.message || "Failed to delete blog category");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete blog category"
      );
    }
  };

  const [togglingIds, setTogglingIds] = useState({});

  const handleToggleStatus = async (id, currentStatus) => {
    setTogglingIds((prev) => ({ ...prev, [id]: true }));

    try {
      const res = await toggleBlogCategoryStatus(id);
      toast.success("Category status updated !!");
      setCategories((prev) =>
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
      <div className="mb-4 ">
        <h2 className="text-2xl font-semibold">CMS</h2>
        <div className="flex items-center justify-between gap-2 mt-2">
          <h2 className="text-md font-semibold">Blog Category</h2>

          <div className="flex items-center gap-2">
            <Button className="addButton truncate" onClick={openAddDialog}>
              Add Category
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border">
        <div className="relative mb-4">
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  "S.No.",
                  "Image",
                  "Name",
                  "Description",
                  "Slug",
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
                  <TableCell colSpan={6} className="h-20 text-center">
                    <DataLoading />
                  </TableCell>
                </TableRow>
              ) : categories?.length > 0 ? (
                categories.map((item, index) => (
                  <TableRow key={item.id} className="text-center">
                    <TableCell className="min-w-[100px]">
                      {index + 1}.
                    </TableCell>
                    <TableCell className="min-w-[100px]">
                      <div className="flex items-center justify-center">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-16 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="flex items-center bg-gray-200 justify-center border-2 border-dashed border-gray-300 h-12 w-16 aspect-square">
                            <span className="text-gray-400 font-semibold text-md sm:text-xl xl:text-xl">
                              <FaRegImage />
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[100px]">{item.name}</TableCell>
                    <TableCell className="min-w-[190px]">
                      {item.description}
                    </TableCell>
                    <TableCell className="min-w-[100px]">{item.slug}</TableCell>

                    <TableCell className="min-w-[100px]">
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
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex justify-center items-center">
                      <span className="text-gray-500">No Data Available</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add/Edit Blog Category Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Blog Category" : "Create Blog Category"}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              {isEditMode
                ? "Update the blog category details below."
                : "Fill in the details to create a new blog category."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid sm:grid-cols-4 items-center gap-2 sm:gap-4">
                <Label htmlFor="name" className="text-left">
                  Name
                </Label>
                <div className="col-span-3">
                  <Input
                    id="name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter category name"
                    className="text-xs sm:text-sm"
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <div className="mt-1 text-left text-xs text-red-500">
                      {formik.errors.name}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="grid sm:grid-cols-4 items-center gap-2 sm:gap-4">
                <Label htmlFor="description" className="text-left">
                  Description
                </Label>
                <div className="col-span-3">
                  <Input
                    id="description"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter category description"
                    className="text-xs sm:text-sm"
                  />
                  {formik.touched.description && formik.errors.description ? (
                    <div className="mt-1 text-left text-xs text-red-500">
                      {formik.errors.description}
                    </div>
                  ) : null}
                </div>
              </div>

              <div>
                <Label className="block mb-2 font-medium">
                  Image {!isEditMode && <span className="text-red-500">*</span>}
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
                    <p className="text-xs text-gray-400">PNG, JPG (Max. 5MB)</p>
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
                {formik.touched.image && formik.errors.image && (
                  <div className="mt-1 text-left text-xs text-red-500">
                    {formik.errors.image}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="text-xs sm:text-sm"
                onClick={resetForm}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="text-xs sm:text-sm"
              >
                {isSubmitting
                  ? "Saving..."
                  : isEditMode
                  ? "Update Category"
                  : "Create Category"}
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
              Are you sure you want to delete this blog category? This action
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

export default BlogCategory;
