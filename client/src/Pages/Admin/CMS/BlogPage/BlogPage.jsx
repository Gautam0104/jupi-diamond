import { useEffect, useState, useRef, useMemo } from "react";
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
  FiTrash2,
  FiEdit,
  FiPlus,
  FiImage,
  FiX,
  FiSearch,
} from "react-icons/fi";
import { toast } from "sonner";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { useFormik } from "formik";
import * as Yup from "yup";
import JoditEditor from "jodit-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";

import {
  fetchAllBlogs,
  fetchBlogCategory,
  toggleBlogStatus,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleBlogFeaturedStatus,
} from "../../../../api/Admin/BlogApi.js";
import { Switch } from "../../../../components/ui/switch.jsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog.jsx";
import useFiltration from "../../../../Hooks/useFilteration.js";
import PaginationComponent from "../../../../components/PaginationComponent/PaginationComponent.jsx";
import { Textarea } from "../../../../components/ui/textarea.jsx";

const BlogPage = () => {
  const {
    clearFilters,
    filters,
    handleFilterChangeHook,
    handlePaginationChange,
    debouncedSearch,
  } = useFiltration();
  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [blogCategories, setBlogCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [activeTab, setActiveTab] = useState("list");
  const editorContent = useRef(null);
  const fileInputRef = useRef(null);
  const [filePreview, setFilePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Jodit editor config
  const config = useMemo(
    () => ({
      uploader: {
        insertImageAsBase64URI: true,
      },
      readonly: false,
    }),
    []
  );

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string()
      .max(80, "Description must be at most 80 characters")
      .required("Description is required"),
    content: Yup.string().required("Content is required"),
    categoryId: Yup.string().required("Category is required"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      content: "",
      categoryId: "",
      coverImage: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("content", values.content);
        formData.append("categoryId", values.categoryId);
        if (selectedFile) {
          formData.append("coverImage", selectedFile);
        }

        let response;
        if (currentEditId) {
          response = await updateBlog(currentEditId, formData);
        } else {
          response = await createBlog(formData);
        }

        if (response.data.success) {
          toast.success(
            `Blog ${currentEditId ? "updated" : "created"} successfully`
          );
          setActiveTab("list");
          fetchData();
          formik.resetForm();
          setFilePreview(null);
          setSelectedFile(null);
        } else {
          toast.error(
            response.data.message ||
              `Failed to ${currentEditId ? "update" : "create"} blog`
          );
        }
      } catch (error) {
        console.log("Save error:", error);
        toast.error(
          error.response?.data?.message ||
            `Failed to ${currentEditId ? "update" : "create"} blog`
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchAllBlogs({
        page: filters.page || 1,
        limit: 10,
        search: debouncedSearch,
      });
      setBlogs(response.data.data?.blogs);

      setPagination(response.data.data.pagination || {});

      const res = await fetchBlogCategory();
      setBlogCategories(res.data.data);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(filters.page);
  }, [debouncedSearch, filters.page, filters.limit]);

  const openAddForm = () => {
    setCurrentEditId(null);
    formik.resetForm();
    setFilePreview(null);
    setSelectedFile(null);
    setActiveTab("create");
  };

  const openEditForm = async (id) => {
    try {
      const blog = blogs.find((b) => b.id === id);
      if (blog) {
        setCurrentEditId(id);
        formik.setValues({
          title: blog.title,
          description: blog.description,
          content: blog.content,
          categoryId: blog.category?.id || "",
        });
        setFilePreview(blog.coverImage);
        setSelectedFile(null);
        setActiveTab("create");
      }
    } catch (error) {
      console.log("Fetch error:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch blog details"
      );
    }
  };

  const [togglingIds, setTogglingIds] = useState({});

  const handleToggleStatus = async (id, currentStatus) => {
    setTogglingIds((prev) => ({ ...prev, [id]: true }));

    try {
      const res = await toggleBlogStatus(id);
      toast.success(res.data.message || "Status updated");
      setBlogs((prev) =>
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

  const [togIds, setTogIds] = useState({});

  const handleToggleFeaturedStatus = async (id, currentStatus) => {
    setTogIds((prev) => ({ ...prev, [id]: true }));

    try {
      const res = await toggleBlogFeaturedStatus(id);
      toast.success(res.data.message || "Featured status updated");
      setBlogs((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, isFeatured: !currentStatus } : item
        )
      );
    } catch (error) {
      console.log("Toggle failed:", error);
      toast.error("Failed to update status");
    } finally {
      setTogIds((prev) => ({ ...prev, [id]: false }));
    }
  };

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
    setFilePreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  const handleDeleteClick = (id) => {
    setBlogToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (blogToDelete) {
      await handleDelete(blogToDelete);
      setDeleteConfirmOpen(false);
      setBlogToDelete(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteBlog(id);
      if (response.data.success) {
        toast.success("Blog deleted successfully");
        fetchData();
      } else {
        toast.error(response.data.message || "Failed to delete Blog");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete Blog");
    }
  };

  const handlePageChange = (page) => {
    handlePaginationChange(page);
    fetchData(page);
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold mb-1">CMS</h2>
          <p className="text-md font-semibold">Blogs</p>
        </div>
      </div>
      <div className="mb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between gap-4 w-full overflow-x-auto py-2 no-scrollbar">
            <TabsList className="flex-shrink-0">
              <TabsTrigger value="list">Blog List</TabsTrigger>
              <TabsTrigger
                value="create"
                disabled={!currentEditId && activeTab !== "create"}
              >
                {currentEditId ? "Edit Blog" : "Create Blog"}
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-4">
              <div className="relative flex items-center w-full max-w-[250px] min-w-[180px]">
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
              <Button
                className="flex-shrink-0 addButton truncate bg-Lime flex items-center gap-2"
                onClick={openAddForm}
              >
                <FiPlus /> Create Blog
              </Button>
            </div>
          </div>
        </Tabs>
      </div>

      <Tabs value={activeTab}>
        <TabsContent value="list">
          <div className="rounded-xl border">
            <div className="relative mb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    {[
                      "Image",
                      "Title",
                      "Description",
                      "Content",
                      "Category",
                      "Created At",
                      "Status",
                      "Featured",
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
                  ) : blogs?.length > 0 ? (
                    blogs.map((item) => (
                      <TableRow key={item.id} className="text-center">
                        <TableCell className="min-w-[90px] text-balance">
                          <div className="flex items-center justify-center">
                            {item.coverImage ? (
                              <img
                                src={item.coverImage}
                                alt={item.title}
                                loading="lazy"
                                className="rounded w-16 h-14 "
                              />
                            ) : (
                              <div className="relative aspect-square w-16 border border-dashed rounded flex items-center justify-center cursor-pointer hover:bg-gray-50">
                                <FiImage className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="min-w-[160px] text-left">
                          {item.title}
                        </TableCell>
                        <TableCell className="min-w-[160px] text-left">
                          {item.description || "-"}
                        </TableCell>

                        <TableCell className="min-w-[180px] text-left">
                          {item.content.length > 100
                            ? `${item.content.substring(0, 100)}...`
                            : item.content}
                          {item.content.length > 100 && (
                            <Button
                              variant="link"
                              className="text-blue-500 p-0 ml-1 h-auto text-xs"
                              onClick={() => openEditForm(item.id)}
                            >
                              Show More
                            </Button>
                          )}
                        </TableCell>

                        <TableCell className="min-w-[160px]">
                          {item.category?.name}
                        </TableCell>

                        <TableCell className="min-w-[140px] text-balance">
                          {new Date(item.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
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
                          <Switch
                            checked={item.isFeatured}
                            onCheckedChange={() =>
                              handleToggleFeaturedStatus(item.id, item.isFeatured)
                            }
                            disabled={togglingIds[item.id]}
                          />
                        </TableCell>

                        <TableCell className="min-w-[80px]">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="edit"
                              size="sm"
                              onClick={() => openEditForm(item.id)}
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

                            <Dialog
                              open={deleteConfirmOpen}
                              onOpenChange={setDeleteConfirmOpen}
                            >
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Confirm Deletion</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to delete this blog
                                    post? This action cannot be undone.
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
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        <div className="flex justify-center items-center">
                          <span className="text-gray-500">
                            No Data Available
                          </span>
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
        </TabsContent>

        <TabsContent value="create">
          <div className="rounded-xl border p-3 sm:p-6 bg-white">
            <form onSubmit={formik.handleSubmit}>
              <div className="grid gap-6 py-4">
                {/* Title Field */}
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="title"
                      name="title"
                      value={formik.values.title}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter blog title"
                    />
                    {formik.errors.title && formik.touched.title && (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.title}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <div className="col-span-3">
                    <Textarea
                      id="description"
                      name="description"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Enter blog description"
                    />
                    {formik.touched.description &&
                      formik.errors.description && (
                        <div className="text-red-500 text-sm mt-1">
                          {formik.errors.description}
                        </div>
                      )}
                  </div>
                </div>

                {/* Cover Image Field */}
                <div className="grid grid-cols-3 items-start gap-4">
                  <Label className="text-right mt-2">Cover Image</Label>
                  <div className="col-span-3">
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

                {/* Category Field */}
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="categoryId" className="text-right">
                    Category
                  </Label>
                  <div className="col-span-3">
                    <Select
                      onValueChange={(value) =>
                        formik.setFieldValue("categoryId", value)
                      }
                      value={formik.values.categoryId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {blogCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formik.errors.categoryId && formik.touched.categoryId && (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.categoryId}
                      </div>
                    )}
                  </div>
                </div>

                {/* Content Field */}
                <div className="grid grid-cols-3 items-start gap-4">
                  <Label htmlFor="content" className="text-right mt-2">
                    Content
                  </Label>
                  <div className="col-span-3">
                    <JoditEditor
                      ref={editorContent}
                      config={config}
                      value={formik.values.content}
                      onBlur={() => formik.setFieldTouched("content", true)}
                      onChange={(newContent) =>
                        formik.setFieldValue("content", newContent)
                      }
                    />
                    {formik.errors.content && formik.touched.content && (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.content}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setActiveTab("list");
                    setFilePreview(null);
                    setSelectedFile(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlogPage;
