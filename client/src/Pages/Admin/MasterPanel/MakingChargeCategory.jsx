import { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { FiSearch, FiTrash2, FiX, FiEdit } from "react-icons/fi";
import { toast } from "sonner";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../../components/ui/dialog";
import DataLoading from "../../../components/Loaders/DataLoading";
import {
  createGlobalMakingCharges,
  deleteGlobalMakingCharges,
  fetchGlobalMakingCharges,
  fetchGlobalMakingChargesById,
  updateGlobalMakingCharges,
} from "../../../api/Admin/MakingChargeApi";
import useFiltration from "../../../Hooks/useFilteration";
import { useFormik } from "formik";
import * as Yup from "yup";

const MakingChargeCategory = () => {
  const { clearFilters, filters, handleFilterChangeHook, debouncedSearch } =
    useFiltration();

  const [loading, setLoading] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const categorySchema = Yup.object().shape({
    category: Yup.string().required("Category name is required"),
    description: Yup.string(),
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchGlobalMakingCharges({
        search: debouncedSearch,
      });
      setCategories(response.data.data);
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [debouncedSearch]);

  // Delete functionality
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

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
      const response = await deleteGlobalMakingCharges(id);
      if (response.data.success) {
        toast.success("Category deleted successfully");
        fetchData();
      } else {
        toast.error(response.data.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete category");
    }
  };

  // Edit functionality
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);

  const handleEditClick = async (id) => {
    setEditLoading(true);
    try {
      const response = await fetchGlobalMakingChargesById(id);
      const data = response.data.data;
      setCurrentEditItem(id);
      editFormik.setValues({
        category: data.category || "",
        description: data.description || "",
      });
      setEditDialogOpen(true);
    } catch (error) {
      console.error("Error fetching category:", error);
      toast.error("Failed to fetch category details");
    } finally {
      setEditLoading(false);
    }
  };

  const editFormik = useFormik({
    initialValues: {
      category: "",
      description: "",
    },
    validationSchema: categorySchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setFormSubmitting(true);
      try {
        const response = await updateGlobalMakingCharges(
          currentEditItem,
          values
        );
        if (response.data.success) {
          toast.success("Category updated successfully");
          setEditDialogOpen(false);
          fetchData();
        } else {
          toast.error(response.data.message || "Failed to update category");
        }
      } catch (error) {
        console.error("Update error:", error);
        toast.error(
          error.response?.data?.message || "Failed to update category"
        );
      } finally {
        setFormSubmitting(false);
      }
    },
  });

  // Create functionality
  const [open, setOpen] = useState(false);

  const createFormik = useFormik({
    initialValues: {
      category: "",
      description: "",
    },
    validationSchema: categorySchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setFormSubmitting(true);
        const response = await createGlobalMakingCharges(values);
        if (response.status === 201) {
          toast.success("Category created successfully");
          setOpen(false);
          fetchData();
          resetForm();
        } else {
          toast.error(response.data.message || "Failed to create category");
        }
      } catch (error) {
        console.error("Create error:", error);
        toast.error(
          error.response?.data?.message || "Failed to create category"
        );
      }
      setFormSubmitting(false);
    },
  });

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full mb-4">
        <p className="text-md font-semibold">Making Charge Categories</p>

        <div className="flex flex-row items-center gap-4 w-full md:w-auto">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="addButton w-full sm:w-auto  truncate ">Add More</button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Making Charge Category</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new making charge category.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={createFormik.handleSubmit}
                autoComplete="off"
                className="grid gap-4 py-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="category">Category Name</Label>
                  <Input
                    id="category"
                    name="category"
                    value={createFormik.values.category}
                    onChange={createFormik.handleChange}
                    onBlur={createFormik.handleBlur}
                    placeholder="Enter category name"
                  />
                  {createFormik.touched.category &&
                    createFormik.errors.category && (
                      <div className="text-red-500 text-xs -mt-1">
                        {createFormik.errors.category}
                      </div>
                    )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    value={createFormik.values.description}
                    onChange={createFormik.handleChange}
                    onBlur={createFormik.handleBlur}
                    placeholder="Enter description (optional)"
                  />
                </div>

                <DialogFooter>
                  <Button disabled={formSubmitting} type="submit">
                    {formSubmitting ? "Creating..." : "Create Category"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <div className="relative flex items-center  min-w-[180px]">
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

      <div className="rounded-xl border">
        <div className="relative mb-4">
          <Table>
            <TableHeader>
              <TableRow>
                {["Name", "Description", "Created At", "Action"].map(
                  (header) => (
                    <TableHead
                      key={header}
                      className="whitespace-nowrap text-center"
                    >
                      {header}
                    </TableHead>
                  )
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-20 text-center">
                    <DataLoading />
                  </TableCell>
                </TableRow>
              ) : categories?.length > 0 ? (
                categories.map((item, index) => (
                  <TableRow key={index + 1} className="text-center">
                    <TableCell className="min-w-[150px]">
                      {item.category || "N/A"}
                    </TableCell>
                    <TableCell className="min-w-[200px]">
                      {item.description || "N/A"}
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
                    <TableCell className="min-w-[100px]">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="edit"
                          size="sm"
                          className="text-[10px] md:text-sm px-2 rounded-sm hover:shadow-xl"
                          onClick={() => handleEditClick(item.id)}
                          disabled={editLoading}
                        >
                          {editLoading && currentEditItem === item.id ? (
                            "Loading..."
                          ) : (
                            <FiEdit />
                          )}
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
                  <TableCell colSpan={4} className="h-24 text-center">
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

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Making Charge Category</DialogTitle>
            <DialogDescription>
              Update the details of this making charge category.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={editFormik.handleSubmit}
            autoComplete="off"
            className="grid gap-4 py-4"
          >
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category Name</Label>
              <Input
                id="edit-category"
                name="category"
                value={editFormik.values.category}
                onChange={editFormik.handleChange}
                onBlur={editFormik.handleBlur}
                placeholder="Enter category name"
              />
              {editFormik.touched.category && editFormik.errors.category && (
                <div className="text-red-500 text-xs -mt-1">
                  {editFormik.errors.category}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                name="description"
                value={editFormik.values.description}
                onChange={editFormik.handleChange}
                onBlur={editFormik.handleBlur}
                placeholder="Enter description"
              />
            </div>

            <DialogFooter>
              <Button disabled={formSubmitting} type="submit">
                {formSubmitting ? "Updating..." : "Update Category"}
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
              Are you sure you want to delete this category? This action cannot
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

export default MakingChargeCategory;
