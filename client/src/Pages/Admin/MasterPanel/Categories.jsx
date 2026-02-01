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
import { Switch } from "../../../components/ui/switch";
import useFiltration from "../../../Hooks/useFilteration";
import {
  createMetalType,
  deleteMetalType,
  getMetalType,
  getMetalTypeById,
  updateMetalType,
} from "../../../api/Admin/MetalApi";
import DataLoading from "../../../components/Loaders/DataLoading";
import { FiSearch, FiTrash2, FiX } from "react-icons/fi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

const Categories = () => {
  const {
    clearFilters,
    filters,
    handleFilterChangeHook,
    handlePaginationChange,
    debouncedSearch,
  } = useFiltration();

  const [loading, setLoading] = useState(false);
  const [metalType, setMetalType] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await getMetalType({
        page,
        search: debouncedSearch,
      });
      setMetalType(response.data.data);
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(filters.page);
  }, [debouncedSearch, filters.page]);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const handleDeleteClick = (id) => {
    setProductToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      await handleDeleteProductVariant(productToDelete);
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
    }
  };

  const handleDeleteProductVariant = async (id) => {
    try {
      const response = await deleteMetalType(id);
      if (response.status === 201) {
        toast.success("Category deleted successfully");
        fetchData(filters.page);
      } else {
        toast.error(response.data.message || "Failed to delete category");
      }
    } catch (error) {
      console.log("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete category");
    }
  };

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const handleEditClick = async (id) => {
    try {
      setLoading(true);
      const response = await getMetalTypeById(id);
      const data = response.data.data;

      setCurrentItemId(id);
      setIsEditMode(true);
      setValue("name", data.name);
      setIsAddDialogOpen(true);
    } catch (error) {
      console.log("Error fetching item:", error);
      toast.error("Failed to fetch item details");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      let response;
      if (isEditMode) {
        response = await updateMetalType(currentItemId, data);
      } else {
        response = await createMetalType(data);
      }

      if (response.data.success) {
        toast.success(
          isEditMode
            ? "Metal type updated successfully"
            : "Metal type created successfully"
        );
        setIsAddDialogOpen(false);
        resetForm();
        fetchData(filters.page);
      } else {
        toast.error(
          response.data.message ||
            (isEditMode
              ? "Failed to update metal type"
              : "Failed to create metal type")
        );
      }
    } catch (error) {
      console.log("Submit error:", error);
      toast.error(
        error.response?.data?.message ||
          (isEditMode
            ? "Failed to update metal type"
            : "Failed to create metal type")
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    reset();
    setIsEditMode(false);
    setCurrentItemId(null);
  };

  const handleDialogClose = () => {
    setIsAddDialogOpen(false);
    resetForm();
  };

  return (
    <div className=" w-full ">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-4">Master Panel</h2>
        <div className="flex flex-row items-center justify-between gap-4">
          <p className="text-md font-semibold ">Material Type</p>

          <div className="flex items-center gap-4">
            {/* <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="addButton "
            >
              Add Category
            </Button> */}
            {/* <div className="relative flex items-center w-full max-w-[250px] ">
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
            </div> */}
          </div>
        </div>
      </div>

      <div className="rounded-xl  ">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-4">
          {loading ? (
            <div className="col-span-full flex justify-center items-center h-20">
              <DataLoading />
            </div>
          ) : metalType?.length > 0 ? (
            metalType.map((item) => (
              <div
                key={item.id}
                className="group relative cp bg-white rounded-lg shadow-md px-4 py-6 border border-gray-200 
             hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1
             overflow-hidden"
              >
                <div
                  className={`absolute bottom-0 left-0 h-1 w-full 
                  ${
                    item.name.toLowerCase() === "gold"
                      ? "bg-amber-400"
                      : item.name.toLowerCase() === "silver"
                      ? "bg-gray-300"
                      : "bg-gray-400"
                  } 
                  transition-all duration-500 ease-in-out 
                  group-hover:h-2`}
                ></div>

                <div className="flex items-center justify-between relative z-10">
                  <div className="space-y-2">
                    <h3
                      className={`font-semibold text-lg 
                     ${
                       item.name.toLowerCase() === "gold"
                         ? "text-amber-600"
                         : item.name.toLowerCase() === "silver"
                         ? "text-gray-600"
                         : "text-gray-700"
                     }`}
                    >
                      {item.name}
                    </h3>
                    
                  </div>
                  <div className="ml-4 transition-all duration-300 group-hover:scale-110">
                    {item.name.toLowerCase() === "gold" && (
                      <img
                        src="/admin/Gold.png"
                        alt="Gold"
                        loading="lazy"
                        className="h-16 w-16 object-contain drop-shadow-lg transition-all duration-500 group-hover:rotate-6"
                      />
                    )}
                    {item.name.toLowerCase() === "silver" && (
                      <img
                        src="/admin/Silver.jpg"
                        alt="Silver"
                        loading="lazy"
                        className="h-16 w-16 object-contain drop-shadow-lg transition-all duration-500 group-hover:rotate-6"
                      />
                    )}
                    {item.name.toLowerCase() === "platinum" && (
                      <img
                        src="/admin/Platinum.png"
                        alt="Platinum"
                        loading="lazy"
                        className="h-16 w-16 object-contain drop-shadow-lg transition-all duration-500 group-hover:rotate-6"
                      />
                    )}
                  </div>
                </div>

                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                  <div
                    className={`absolute top-0 left-0 w-full h-full 
                    ${
                      item.name.toLowerCase() === "gold"
                        ? "bg-amber-200"
                        : item.name.toLowerCase() === "silver"
                        ? "bg-gray-200"
                        : "bg-gray-300"
                    } 
                    animate-pulse`}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex justify-center items-center h-24">
              <span className="text-gray-500">No Data Available</span>
            </div>
          )}
        </div>

        <div className="p-2 md:p-4 ">
          <Dialog open={isAddDialogOpen} onOpenChange={handleDialogClose}>
            <DialogContent className="max-w-[95vw] sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {isEditMode ? "Edit Metal Type" : "Add New Metal Type"}
                </DialogTitle>
                <DialogDescription>
                  {isEditMode
                    ? "Update the details of this metal type."
                    : "Fill in the details to create a new metal type."}
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={handleSubmit(onSubmit)}
                autoComplete="off"
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name*
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter metal type name"
                    {...register("name", { required: "Name is required" })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-lime-500 focus:ring-lime-500 sm:text-sm p-2"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <DialogFooter>
                  <div className="flex justify-end flex-col sm:flex-row gap-2 w-full">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={handleDialogClose}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          {isEditMode ? "Updating..." : "Creating..."}
                        </span>
                      ) : isEditMode ? (
                        "Update"
                      ) : (
                        "Create"
                      )}
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this category? This action
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
      </div>
    </div>
  );
};

export default Categories;
