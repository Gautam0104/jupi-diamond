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

import { toast } from "sonner";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  createMetalColor,
  deleteMetalColor,
  getMetalColor,
  getMetalColorById,
  updateMetalColor,
} from "../../../api/Admin/MetalApi";

const MaterialColor = () => {
  const { clearFilters, filters, handleFilterChangeHook, debouncedSearch } =
    useFiltration();

  const [metalColors, setMetalColors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [metalColorToDelete, setMetalColorToDelete] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getMetalColor({
        search: debouncedSearch,
      });
      setMetalColors(response.data.data);
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to fetch metal colors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [debouncedSearch]);

  const handleDeleteClick = (id) => {
    setMetalColorToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (metalColorToDelete) {
      await handleDeleteMetalColor(metalColorToDelete);
      setDeleteConfirmOpen(false);
      setMetalColorToDelete(null);
    }
  };

  const handleDeleteMetalColor = async (id) => {
    try {
      const response = await deleteMetalColor(id);
      if (response.data.success) {
        toast.success("Metal color deleted successfully");
        fetchData();
      } else {
        toast.error(response.data.message || "Failed to delete metal color");
      }
    } catch (error) {
      console.log("Delete error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete metal color"
      );
    }
  };

  const metalColorValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
  });

  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const response = await getMetalColorById(id);
      const metalColorData = response.data.data;

      formik.setValues({
        name: metalColorData.name,
      });

      setCurrentEditId(id);
      setIsEditMode(true);
      setIsDialogOpen(true);
    } catch (error) {
      console.log("Error fetching metal color:", error);
      toast.error("Failed to load metal color for editing");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsDialogOpen(false);
    setIsEditMode(false);
    setCurrentEditId(null);
  };

  const resetDialogForm = () => {
    formik.resetForm();
    setIsDialogOpen(false);
    setIsEditMode(false);
    setCurrentEditId(null);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: metalColorValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      try {
        let response;
        if (isEditMode) {
          response = await updateMetalColor(currentEditId, values);
        } else {
          response = await createMetalColor(values);
        }

        if (response.status === 200 || response.status === 201) {
          toast.success(
            `Metal color ${isEditMode ? "updated" : "created"} successfully`
          );
          resetForm();
          resetDialogForm();
          fetchData();
        } else {
          toast.error(
            response.data.message ||
              `Failed to ${isEditMode ? "update" : "create"} metal color`
          );
        }
      } catch (error) {
        console.log("Submit error:", error);
        toast.error(
          error.response?.data?.message ||
            `Failed to ${isEditMode ? "update" : "create"} metal color`
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <div className="w-full p-2 md:p-4">
      <div className="mb-4">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">Master Panel</h2>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-md font-semibold">Material Colors</p>
          <div className="flex flex-row-reverse items-end md:items-center gap-2 w-full md:w-auto">
            <div className="relative flex items-center w-full md:max-w-[250px]">
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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="addButton truncate " onClick={openAddDialog}>
                  Add More
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {isEditMode ? "Edit" : "Add"} Metal Color
                  </DialogTitle>
                  <DialogDescription>
                    {isEditMode
                      ? "Update the metal color details below."
                      : "Fill in the details to create a new metal color."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={formik.handleSubmit} autoComplete="off">
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Enter metal color name (e.g., Rose Gold)"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.name && formik.errors.name && (
                        <p className="text-xs text-red-500 -mt-1">
                          {formik.errors.name}
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
              {["S.No.", "Name", "Slug", "Created At", "Action"].map(
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
                <TableCell colSpan={5} className="h-20 text-center">
                  <DataLoading />
                </TableCell>
              </TableRow>
            ) : metalColors?.length > 0 ? (
              metalColors.map((item, index) => (
                <TableRow key={item.id} className="text-center">
                  <TableCell className="min-w-[50px]">{index + 1}.</TableCell>
                  <TableCell className="min-w-[150px] capitalize">
                    {item.name}
                  </TableCell>
                  <TableCell className="min-w-[150px]">
                    <div className="flex items-center justify-center gap-1">
                      {item.metalColorSlug}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(item.metalColorSlug);
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
                  <TableCell className="min-w-[100px]">
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

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this metal color? This action
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

export default MaterialColor;
