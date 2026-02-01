import { FiSearch, FiTrash2, FiX } from "react-icons/fi";
import {
  createMetalVariant,
  deleteMetalType,
  deleteMetalVariant,
  getMetalType,
  getMetalVariant,
} from "../../../api/Admin/MetalApi";
import DataLoading from "../../../components/Loaders/DataLoading";
import PaginationComponent from "../../../components/PaginationComponent/PaginationComponent";
import { Button } from "../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import useFiltration from "../../../Hooks/useFilteration";
import React, { useEffect, useState } from "react";
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
import { Input } from "../../../components/ui/input";
import EditMetalVariantDialog from "./EditMetalVariantDialog";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object().shape({
  metalTypeId: Yup.string().required("Metal type is required"),
  purityLabel: Yup.string().required("Purity label is required"),
  metalPriceInGram: Yup.number()
    .required("Unit price is required")
    .positive("Price must be positive"),
  // byBackPrice: Yup.number().positive("Buy back price must be positive"),
});

const MetalMaster = () => {
  const [activeTab, setActiveTab] = useState(null);
  const {
    clearFilters,
    filters,
    handleFilterChangeHook,
    handlePaginationChange,
    debouncedSearch,
  } = useFiltration();

  const navigate = useNavigate();

  const [pagination, setPagination] = useState({});
  const [metalVariants, setMetalVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [metalTypes, setMetalTypes] = useState([]);

  const fetchData = async (page = 1, metalTypeId = null) => {
    setLoading(true);
    try {
      const response = await getMetalVariant({
        page: filters.page || 1,
        limit: 10,
        search: debouncedSearch,
        metalTypeId: metalTypeId || filters.metalTypeId,
      });
      setMetalVariants(response.data.data.metalVariant);
      setPagination(response.data.data.pagination);
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to fetch metal variants");
    } finally {
      setLoading(false);
    }
  };

  const fetchMetalType = async () => {
    try {
      const response = await getMetalType();
      if (response.data.success) {
        setMetalTypes(response.data.data);
        if (response.data.data.length > 0 && !activeTab) {
          setActiveTab(response.data.data[0].id);
        }
      } else {
        toast.error(response.data.message || "Failed to fetch metal types");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch metal types"
      );
    }
  };

  useEffect(() => {
    fetchMetalType();
  }, []);

  useEffect(() => {
    if (activeTab) {
      fetchData(1, activeTab);
    }
  }, [debouncedSearch, activeTab, filters.page, filters.limit]);

  const handlePageChange = (page) => {
    handlePaginationChange(page);
    fetchData(page, activeTab);
  };

  const filteredMetalVariants = metalVariants.filter(
    (variant) => variant.metalTypeId === activeTab
  );

  const [open, setOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      metalTypeId: activeTab || "",
      purityLabel: "",
      metalPriceInGram: "",
      // byBackPrice: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const res = await createMetalVariant(values);
        if (res.status === 201) {
          toast.success("Metal variant created successfully");
          fetchData(1, activeTab);
          setOpen(false);
          formik.resetForm();
        } else {
          toast.error(res.data.message || "Failed to create metal variant");
        }
      } catch (error) {
        console.error("Error creating metal variant:", error);
        toast.error(
          error.response?.data?.message || "Failed to create metal variant"
        );
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (activeTab) {
      formik.setFieldValue("metalTypeId", activeTab);
    }
  }, [activeTab]);

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
      const response = await deleteMetalVariant(id);
      if (response.data.success) {
        toast.success("Metal deleted successfully");
        fetchData();
      } else {
        toast.error(response.data.message || "Failed to delete metal");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete metal");
    }
  };

  return (
    <div className="  ">
      <h2 className="text-2xl font-semibold mb-4">Master Panel</h2>
      <p className="text-md font-semibold mb-4">Metal Master</p>

      <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 mb-4">
        <div className="flex items-center justify-between gap-4  w-full overflow-x-auto scrollbarWidthThinAdmin">
          {metalTypes.map((metal) => (
            <button
              key={metal.id}
              onClick={() => setActiveTab(metal.id)}
              className={`px-7 sm:px-8 md:px-16 py-2 text-xs md:text-sm cp rounded-full font-semibold ${
                activeTab === metal.id
                  ? "bg-Lime text-black"
                  : "bg-white text-black "
              }`}
            >
              {metal.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 w-full ">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button
                onClick={() => {
                  formik.resetForm();
                }}
                className="md:ml-auto w-[200px] md:w-auto addButton truncate"
              >
                Add More
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Metal Variant</DialogTitle>
              </DialogHeader>
              <form onSubmit={formik.handleSubmit} className="grid gap-4 py-4">
                <div className="grid sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="metalTypeId" className="text-left">
                    Metal Type
                  </Label>
                  <Select
                    value={formik.values.metalTypeId}
                    onValueChange={(value) =>
                      formik.setFieldValue("metalTypeId", value)
                    }
                    disabled={!!activeTab}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select metal type" />
                    </SelectTrigger>
                    <SelectContent>
                      {metalTypes.map((metal) => (
                        <SelectItem key={metal.id} value={metal.id}>
                          {metal.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formik.touched.metalTypeId && formik.errors.metalTypeId ? (
                    <div className="col-span-4 text-red-500 text-sm text-right">
                      {formik.errors.metalTypeId}
                    </div>
                  ) : null}
                </div>

                <div className="grid sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="purityLabel" className="text-left">
                    Purity Label
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="purityLabel"
                      name="purityLabel"
                      value={formik.values.purityLabel}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="e.g. 22k, 24k"
                    />
                    {formik.touched.purityLabel && formik.errors.purityLabel ? (
                      <div className=" text-red-500 text-xs text-left mt-1">
                        {formik.errors.purityLabel}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="grid sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="metalPriceInGram" className="text-left">
                    Unit Price/gm
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="metalPriceInGram"
                      name="metalPriceInGram"
                      type="number"
                      value={formik.values.metalPriceInGram}
                      placeholder="Enter price in ₹"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.metalPriceInGram &&
                    formik.errors.metalPriceInGram ? (
                      <div className="mt-1 text-red-500 text-xs text-left">
                        {formik.errors.metalPriceInGram}
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* <div className="grid sm:grid-cols-4 items-center gap-2 sm:gap-4">
                  <Label htmlFor="byBackPrice" className="text-left">
                    Buy Back Price/gm
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="byBackPrice"
                      name="byBackPrice"
                      type="number"
                      value={formik.values.byBackPrice}
                      placeholder="Enter buy back price in ₹"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.byBackPrice && formik.errors.byBackPrice ? (
                      <div className="mt-1 text-red-500 text-xs text-left">
                        {formik.errors.byBackPrice}
                      </div>
                    ) : null}
                  </div>
                </div> */}

                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <div className="relative flex items-center w-full max-w-[250px] min-w-[150px]">
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

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-Lime">
            <TableRow>
              {["purity", "unitPrice", "Slug", "Created At", "action"].map(
                (field) => (
                  <TableHead
                    key={field}
                    className="text-black cursor-pointer text-center"
                  >
                    {field === "unitPrice"
                      ? "Unit Price/gm"
                      : field.charAt(0).toUpperCase() + field.slice(1)}
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
            ) : filteredMetalVariants?.length > 0 ? (
              filteredMetalVariants.map((item) => (
                <TableRow key={item.id} className="text-center">
                  <TableCell className='min-w-[100px]'>{item.purityLabel}</TableCell>

                  <TableCell className='min-w-[140px]'>₹{item.metalPriceInGram}</TableCell>
                  {/* <TableCell>₹{item.byBackPrice || "N/A"}</TableCell> */}
                  <TableCell className='min-w-[150px]'>
                    <div className="flex items-center justify-center gap-1">
                      {item.metalVariantSlug}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(item.metalVariantSlug);
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
                  <TableCell className='min-w-[100px]'>
                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell className='min-w-[100px]'>
                    <div className="flex items-center justify-center gap-2">
                      <EditMetalVariantDialog
                        variantId={item.id}
                        metalTypes={metalTypes}
                        fetchData={fetchData}
                        activeTab={activeTab}
                      />
                      <Button
                        variant="edit"
                        size="sm"
                        onClick={() =>
                          navigate(`/admin/master-panel/metal-variant-history/${item.id}`)
                        }
                      >
                        View History
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
                            Are you sure you want to delete this metal ? This
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
                          <Button variant="destructive" onClick={confirmDelete}>
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
                <TableCell colSpan={5} className="h-20 text-center">
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
  );
};

export default MetalMaster;
