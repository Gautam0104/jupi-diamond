import { useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

import { Switch } from "../../../components/ui/switch";
import {
  createCollection,
  deleteCollection,
  getCollection,
  getCollectionById,
  toggleCollection,
  updateCollection,
} from "../../../api/Admin/CollectionApi";
import { useEffect } from "react";
import DataLoading from "../../../components/Loaders/DataLoading";
import PaginationComponent from "../../../components/PaginationComponent/PaginationComponent";
import useFiltration from "../../../Hooks/useFilteration";
import { FiSearch, FiTrash2, FiX } from "react-icons/fi";
import { toast } from "sonner";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import { Input } from "../../../components/ui/input";
import { UploadIcon } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";

const Collection = () => {
  const {
    clearFilters,
    filters,
    handleFilterChangeHook,
    handlePaginationChange,
    debouncedSearch,
  } = useFiltration();

  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});

  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const currentPage = pagination.page;

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await getCollection({
        page: filters.page || 1,
        limit: 10,
        search: debouncedSearch,
      });
      setCollection(response.data.data.collection);

      // console.log("response", response.data.data.collection);

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
  }, [debouncedSearch, filters.page, filters.limit]);

  const handlePageChange = (page) => {
    handlePaginationChange(page);
    fetchData(page);
  };

  const collectionSchema = Yup.object().shape({
    name: Yup.string().required("Collection name is required"),
    gender: Yup.string().required("Gender is required"),
    description: Yup.string(),
    thumbnailImage: Yup.mixed().test(
      "fileOrUrl",
      "Thumbnail is required",
      function (value) {
        // In edit mode, we accept either a File object or a string URL
        if (this.parent.editMode) {
          return value instanceof File || typeof value === "string";
        }
        // In create mode, we require a File object
        return value instanceof File;
      }
    ),
  });

  const [open, setOpen] = useState(false);

  const [preview, setPreview] = useState({
    thumbnailImage: null,
  });

  const handleEdit = async (id) => {
    setEditMode(true);
    setOpen(true);
    setEditingId(id);
    setLoading(true);
    try {
      const { data } = await getCollectionById(id);
      const collection = data.data;

      formik.setValues({
        name: collection.name || "",
        gender: collection.gender || "UNISEX",
        description: collection.description || "",
        thumbnailImage: collection.thumbnailImage,
        editMode: true,
      });
      setPreview({ thumbnailImage: collection.thumbnailImage || null });
      setEditMode(true);
      setEditingId(id);
      setOpen(true);
    } catch (error) {
      console.error("Error fetching collection by ID:", error);
      toast.error("Failed to fetch collection");
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      gender: "UNISEX",
      description: "",
      thumbnailImage: null,
      editMode: false,
    },
    validationSchema: collectionSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("name", values.name);
        formDataToSend.append("gender", values.gender);
        formDataToSend.append("description", values.description || "");
        if (values.thumbnailImage instanceof File) {
          formDataToSend.append("thumbnailImage", values.thumbnailImage);
        }

        if (values.editMode) {
          await updateCollection(editingId, formDataToSend);
          toast.success("Collection updated successfully");
        } else {
          await createCollection(formDataToSend);
          toast.success("Collection created successfully");
        }

        setOpen(false);
        fetchData();
        resetForm();
        setPreview({ thumbnailImage: null });
        setEditMode(false);
      } catch (err) {
        console.error(err);
        toast.error(
          values.editMode
            ? "Failed to update collection"
            : "Failed to create collection"
        );
      } finally {
        setLoading(false);
      }
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      gender: "UNISEX",
      description: "",
      thumbnailImage: null,
      editMode: false,
    });
    setPreview({
      thumbnailImage: null,
    });
    setEditMode(false);
    setEditingId(null);
  };

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState(null);

  const handleDeleteClick = (id) => {
    setCollectionToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (collectionToDelete) {
      await handleDeleteCollection(collectionToDelete);
      setDeleteConfirmOpen(false);
      setCollectionToDelete(null);
    }
  };

  const handleDeleteCollection = async (id) => {
    try {
      const response = await deleteCollection(id);
      if (response.data.success) {
        toast.success("Collection deleted successfully");
        fetchData(currentPage);
      } else {
        toast.error(response.data.message || "Failed to delete collection");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete collection"
      );
    }
  };

  const [togglingIds, setTogglingIds] = useState({});

  const handleToggleStatus = async (id, currentStatus) => {
    setTogglingIds((prev) => ({ ...prev, [id]: true }));

    try {
      const res = await toggleCollection(id);
      toast.success("Collection Status Updated !!");
      setCollection((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: !currentStatus } : item
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
          <p className="text-md font-semibold ">Collections</p>
          <div className="flex items-center gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="addButton">Add More</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">
                    {editMode ? "Edit Collection" : "Create New Collection"}
                  </DialogTitle>
                </DialogHeader>

                <form
                  onSubmit={formik.handleSubmit}
                  className="grid grid-cols-1 gap-6 py-4"
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Collection Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formik.values.name}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="e.g. Summer Collection"
                        />
                        {formik.touched.name && formik.errors.name && (
                          <p className="text-red-500 text-xs -mt-1">
                            {formik.errors.name}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Gender</Label>
                        <Select
                          value={formik.values.gender}
                          onValueChange={(val) =>
                            formik.setFieldValue("gender", val)
                          }
                        >
                          <SelectTrigger className="w-full focus:ring-primary">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UNISEX">Unisex</SelectItem>
                            <SelectItem value="MEN">Men</SelectItem>
                            <SelectItem value="WOMEN">Women</SelectItem>
                          </SelectContent>
                        </Select>
                        {formik.touched.gender && formik.errors.gender && (
                          <p className="text-red-500 text-xs -mt-1">
                            {formik.errors.gender}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Describe the collection..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="thumbnailImage">Thumbnail Image</Label>
                      <div className="flex flex-col gap-3">
                        <Input
                          id="thumbnailImage"
                          name="thumbnailImage"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.currentTarget.files[0];
                            formik.setFieldValue("thumbnailImage", file);
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setPreview({ thumbnailImage: reader.result });
                            };
                            if (file) reader.readAsDataURL(file);
                          }}
                          className="focus-visible:ring-primary"
                        />
                        {formik.touched.thumbnailImage &&
                          formik.errors.thumbnailImage && (
                            <p className="text-red-500 text-xs -mt-1">
                              {formik.errors.thumbnailImage}
                            </p>
                          )}
                        <div className="relative w-24 h-24 border-2 border-dashed rounded-lg overflow-hidden">
                          {preview.thumbnailImage ? (
                            <img
                              src={preview.thumbnailImage}
                              alt="Thumbnail preview"
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center text-gray-400">
                              <UploadIcon className="w-6 h-6 mb-1" />
                              <span className="text-xs">Thumbnail</span>
                              <span className="text-[10px]">300x300px</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => setOpen(false)}
                      className="hover:bg-gray-100"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading
                        ? formik.values.editMode
                          ? "Updating..."
                          : "Creating..."
                        : formik.values.editMode
                        ? "Update Collection"
                        : "Create Collection"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
            <div className="relative flex items-center w-full max-w-[250px] min-w-[180px] ">
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
                  "Image ",
                  "Name",
                  "Details",
                  "Gender",
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
              ) : collection?.length > 0 ? (
                collection.map((item) => (
                  <TableRow key={item.id} className="text-center">
                    <TableCell className="min-w-[100px]">
                      <img
                        src={item.thumbnailImage}
                        alt={item.name}
                        loading="lazy"
                        className="w-11 h-11 mx-auto"
                      />
                    </TableCell>
                    <TableCell className="min-w-[100px] text-left">
                      {item.name}
                    </TableCell>

                    <TableCell className="min-w-[60px] text-left">
                      {item.description || 'N/A'}
                    </TableCell>
                    <TableCell className="min-w-[80px]">
                      {item.gender}
                    </TableCell>
                    <TableCell className="min-w-[80px]">
                      <div className="flex items-center justify-center gap-1 ">
                        {item.collectionSlug}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(item.collectionSlug);
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
                    <TableCell className="min-w-[180px] truncate">
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
                        checked={item.status}
                        onCheckedChange={() =>
                          handleToggleStatus(item.id, item.status)
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
                              Are you sure you want to delete this collection ?
                              This action cannot be undone.
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

export default Collection;
