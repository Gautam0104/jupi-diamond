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
import { FiTrash2 } from "react-icons/fi";

import {
  createMakingChargeWeightRange,
  deleteMakingChargeWeightRange,
  fetchAllMakingChargeWeightRanges,
  fetchGlobalMakingCharges,
  updateMakingChargeWeightRangeStatus,
} from "../../../api/Admin/MakingChargeApi";
import { useEffect } from "react";
import DataLoading from "../../../components/Loaders/DataLoading";
import useFiltration from "../../../Hooks/useFilteration";
import PaginationComponent from "../../../components/PaginationComponent/PaginationComponent";
import { Switch } from "../../../components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { toast } from "sonner";
import { getMetalVariant } from "../../../api/Admin/MetalApi";
import { getGemstoneVariant } from "../../../api/Admin/GemstoneApi";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Input } from "../../../components/ui/input";
import EditMakingChargeDialog from "./EditMakingChargeDialog";
import MakingChargeCategory from "./MakingChargeCategory";
import ProductFilters from "../../../components/ProductFilters/ProductFilters";
import { useFormik } from "formik";
import * as Yup from "yup";

const MakingCharge = () => {
  const {
    clearFilters,
    filters,
    handleFilterChangeHook,
    handlePaginationChange,
    debouncedSearch,
  } = useFiltration();

  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [charge, setCharge] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const currentPage = pagination.page;

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetchAllMakingChargeWeightRanges({
        page: filters.page || 1,
        limit: 10,
        search: debouncedSearch,
        minWeight: filters.minWeight,
        maxWeight: filters.maxWeight,
        chargeType: filters.chargeType,
        chargeCategory: filters.chargeCategory,
        metalVariantId: filters.metalVariantId,
        gemstoneVariantId: filters.gemstoneVariantId,
        makingChargeCategorySetId: filters.makingChargeCategorySetId,
      });

      setCharge(response.data.data.makingCharges);
      setPagination(response.data.data.pagination);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(filters.page);
  }, [
    debouncedSearch,
    filters.page,
    filters.limit,
    filters.minWeight,
    filters.maxWeight,
    filters.chargeType,
    filters.chargeCategory,
    filters.metalVariantId,
    filters.gemstoneVariantId,
    filters.makingChargeCategorySetId,
  ]);

  const [gemstoneVariant, setGemstoneVariant] = useState([]);
  const [metalVariant, setMetalVariant] = useState([]);
  const [makingCharge, setMakingCharge] = useState([]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const responseTwo = await getGemstoneVariant();
      setGemstoneVariant(responseTwo.data.data.gemstoneVariant);

      const responseThree = await getMetalVariant();
      setMetalVariant(responseThree.data.data.metalVariant);

      const response = await fetchGlobalMakingCharges();
      setMakingCharge(response.data.data);
    } catch (error) {
      console.error("Error fetching global making charges:", error);
      toast.error("Failed to fetch global making charges");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [chargeToDelete, setChargeToDelete] = useState(null);

  const handleDeleteClick = (id) => {
    setChargeToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (chargeToDelete) {
      await handleDelete(chargeToDelete);
      setDeleteConfirmOpen(false);
      setChargeToDelete(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteMakingChargeWeightRange(id);
      if (response.data.success) {
        toast.success("Making Charge Master deleted successfully");
        fetchData(currentPage);
      } else {
        toast.error(
          response.data.message || "Failed to delete making charge master"
        );
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete making charge master"
      );
    }
  };

  const handlePageChange = (page) => {
    handlePaginationChange(page);
    fetchData(page);
  };

  const makingChargeSchema = Yup.object().shape({
    makingChargeCategorySetId: Yup.string().required("Category is required"),
    chargeCategory: Yup.string().required("Charge Category is required"),
    chargeType: Yup.string().required("Charge Type is required"),
    metalVariantId: Yup.string().required("Metal Variant is required"),
    gemstoneVariantId: Yup.string().required("Gemstone Variant is required"),
    minWeight: Yup.number()
      .typeError("Min Weight must be a number")
      .required("Min Weight is required")
      .min(0, "Must be greater than or equal to 0"),
    maxWeight: Yup.number()
      .typeError("Max Weight must be a number")
      .required("Max Weight is required")
      .moreThan(Yup.ref("minWeight"), "Must be greater than Min Weight"),
    chargeValue: Yup.number()
      .typeError("Charge Value must be a number")
      .required("Charge Value is required")
      .min(0, "Must be at least 0"),
    discountType: Yup.string().required("Discount Type is required"),
    discountValue: Yup.number()
      .typeError("Discount Value must be a number")
      .required("Discount Value is required")
      .min(0, "Must be at least 0")
      .max(100, "Cannot exceed 100"),
  });

  const [open, setOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      makingChargeCategorySetId: "",
      chargeCategory: "COMBINED",
      chargeType: "FIXED",
      metalVariantId: "",
      gemstoneVariantId: "",
      minWeight: "",
      maxWeight: "",
      chargeValue: "",
      discountType: "PERCENTAGE",
      discountValue: 0,
    },
    validationSchema: makingChargeSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await createMakingChargeWeightRange(values);
        if (response.status === 201) {
          toast.success("Making charge weight range created successfully");
          setOpen(false);
          fetchData(currentPage);
          resetForm();
        } else {
          toast.error(response.data.message || "Failed to create weight range");
        }
      } catch (error) {
        console.error("Create error:", error);
        toast.error(error.response?.data?.message || "Creation failed");
      }
    },
  });

  const [togglingIds, setTogglingIds] = useState({});

  const handleToggleStatus = async (id, currentStatus) => {
    setTogglingIds((prev) => ({ ...prev, [id]: true }));

    try {
      const res = await updateMakingChargeWeightRangeStatus(id);
      toast.success(res.data.message || "Status updated");
      setCharge((prev) =>
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
    <>
      <div className=" w-full ">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold mb-4">Master Panel</h2>

          <nav className="flex gap-x-1">
            <button
              className={`py-2 px-1 cp inline-flex items-center gap-x-2 border-b-2  text-sm whitespace-nowrap  hover:text-black focus:outline-none focus:text-black ${
                activeTab === 0
                  ? "font-semibold border-black text-black"
                  : "border-transparent text-gray-500"
              }`}
              onClick={() => setActiveTab(0)}
              aria-selected={activeTab === 0}
            >
              Making Charge Category
            </button>
            <button
              className={`py-2 px-1 cp inline-flex items-center gap-x-2 ml-5 border-b-2  text-sm whitespace-nowrap  hover:text-black focus:outline-none focus:text-black ${
                activeTab === 1
                  ? "font-semibold border-black text-black"
                  : "border-transparent text-gray-500"
              }`}
              onClick={() => setActiveTab(1)}
              aria-selected={activeTab === 1}
            >
              Making Charge
            </button>
          </nav>
        </div>
        <div className={`${activeTab === 0 ? "" : "hidden"}`}>
          <MakingChargeCategory />
        </div>
      </div>
      <div className={`${activeTab === 1 ? "" : "hidden"}`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full mb-4 ">
          <p className="text-md font-semibold ">Making Charge Master</p>

          <div className="flex flex-row items-center gap-4 w-full md:w-auto">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button className="addButton truncate ">Add More</button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[550px] overflow-x-auto scrollbarWidthThinAdmin">
                <DialogHeader>
                  <DialogTitle>
                    Create New Making Charge Weight Range
                  </DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new making charge weight
                    range.
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={formik.handleSubmit}
                  autoComplete="off"
                  className="grid gap-4 py-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="makingChargeCategorySetId">
                        Making Charge Category
                      </Label>
                      <Select
                        value={formik.values.makingChargeCategorySetId}
                        onValueChange={(value) =>
                          formik.setFieldValue(
                            "makingChargeCategorySetId",
                            value
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {makingCharge?.map((item) => (
                            <SelectItem key={item.id} value={item?.id}>
                              {item.category || "N/A"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formik.touched.makingChargeCategorySetId &&
                        formik.errors.makingChargeCategorySetId && (
                          <p className="text-red-500 text-xs -mt-1">
                            {formik.errors.makingChargeCategorySetId}
                          </p>
                        )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="chargeCategory">Charge Category</Label>
                      <Select
                        value={formik.values.chargeCategory}
                        onValueChange={(value) =>
                          formik.setFieldValue("chargeCategory", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select charge category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="METAL">Metal</SelectItem>
                          <SelectItem value="COMBINED">Combined</SelectItem>
                          <SelectItem value="GEMSTONE">Gemstone</SelectItem>
                        </SelectContent>
                      </Select>
                      {formik.touched.chargeCategory &&
                        formik.errors.chargeCategory && (
                          <p className="text-red-500 text-xs -mt-1">
                            {formik.errors.chargeCategory}
                          </p>
                        )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="metalVariantId">Metal Variant</Label>
                      <Select
                        value={formik.values.metalVariantId}
                        onValueChange={(value) =>
                          formik.setFieldValue("metalVariantId", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select metal variant" />
                        </SelectTrigger>
                        <SelectContent>
                          {metalVariant?.map((metal) => (
                            <SelectItem key={metal.id} value={metal.id}>
                              {metal.metalType?.name} - {metal.purityLabel}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formik.touched.metalVariantId &&
                        formik.errors.metalVariantId && (
                          <p className="text-red-500 text-xs -mt-1">
                            {formik.errors.metalVariantId}
                          </p>
                        )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gemstoneVariantId">
                        Gemstone Variant
                      </Label>
                      <Select
                        value={formik.values.gemstoneVariantId}
                        onValueChange={(value) =>
                          formik.setFieldValue("gemstoneVariantId", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gemstone variant" />
                        </SelectTrigger>
                        <SelectContent>
                          {gemstoneVariant?.map((gemstone) => (
                            <SelectItem key={gemstone.id} value={gemstone.id}>
                              {gemstone.gemstoneType?.name} - {gemstone.clarity}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formik.touched.gemstoneVariantId &&
                        formik.errors.gemstoneVariantId && (
                          <p className="text-red-500 text-xs -mt-1">
                            {formik.errors.gemstoneVariantId}
                          </p>
                        )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="minWeight">Min Weight</Label>
                      <Input
                        id="minWeight"
                        name="minWeight"
                        type="number"
                        value={formik.values.minWeight}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter minimum weight"
                        min="0"
                        step="0.01"
                        onWheel={(e) => e.target.blur()}
                        onKeyDown={(e) => {
                          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                            e.preventDefault();
                          }
                        }}
                        className="no-spinners"
                      />
                      {formik.touched.minWeight && formik.errors.minWeight && (
                        <p className="text-red-500 text-xs -mt-1">
                          {formik.errors.minWeight}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxWeight">Max Weight</Label>
                      <Input
                        id="maxWeight"
                        name="maxWeight"
                        type="number"
                        value={formik.values.maxWeight}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter maximum weight"
                        min="0"
                        step="0.01"
                        onWheel={(e) => e.target.blur()}
                        onKeyDown={(e) => {
                          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                            e.preventDefault();
                          }
                        }}
                        className="no-spinners"
                      />
                      {formik.touched.maxWeight && formik.errors.maxWeight && (
                        <p className="text-red-500 text-xs -mt-1">
                          {formik.errors.maxWeight}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="chargeType">Charge Type</Label>
                      <Select
                        value={formik.values.chargeType}
                        onValueChange={(value) =>
                          formik.setFieldValue("chargeType", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select charge type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FIXED">Fixed</SelectItem>
                          <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                          <SelectItem value="PER_GRAM_WEIGHT">
                            Per Gram Weight
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {formik.touched.chargeType &&
                        formik.errors.chargeType && (
                          <p className="text-red-500 text-xs -mt-1">
                            {formik.errors.chargeType}
                          </p>
                        )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="chargeValue">Charge Value</Label>
                      <Input
                        id="chargeValue"
                        name="chargeValue"
                        type="number"
                        value={formik.values.chargeValue}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter charge value"
                        min="0"
                        step="0.01"
                        onWheel={(e) => e.target.blur()}
                        onKeyDown={(e) => {
                          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                            e.preventDefault();
                          }
                        }}
                        className="no-spinners"
                      />
                      {formik.touched.chargeValue &&
                        formik.errors.chargeValue && (
                          <p className="text-red-500 text-xs -mt-1">
                            {formik.errors.chargeValue}
                          </p>
                        )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="discountType">Discount Type</Label>
                      <Select
                        value={formik.values.discountType}
                        onValueChange={(value) =>
                          formik.setFieldValue("discountType", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select discount type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                          <SelectItem value="FIXED">Fixed</SelectItem>
                        </SelectContent>
                      </Select>
                      {formik.touched.discountType &&
                        formik.errors.discountType && (
                          <p className="text-red-500 text-xs -mt-1">
                            {formik.errors.discountType}
                          </p>
                        )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="discountValue">Discount Value</Label>
                      <Input
                        id="discountValue"
                        name="discountValue"
                        type="number"
                        value={formik.values.discountValue}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter discount value"
                        min="0"
                        step="0.01"
                        onWheel={(e) => e.target.blur()}
                        onKeyDown={(e) => {
                          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                            e.preventDefault();
                          }
                        }}
                        className="no-spinners"
                      />
                      {formik.touched.discountValue &&
                        formik.errors.discountValue && (
                          <p className="text-red-500 text-xs -mt-1">
                            {formik.errors.discountValue}
                          </p>
                        )}
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="submit">Create</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <ProductFilters
              filters={filters}
              handleFilterChangeHook={handleFilterChangeHook}
              metalVariant={metalVariant}
              gemstoneVariant={gemstoneVariant}
              makingCharge={makingCharge}
            />
          </div>
        </div>

        <div className="rounded-xl border ">
          <div className="relative mb-4">
            <Table>
              <TableHeader>
                <TableRow>
                  {[
                    "Name",
                    "Metal Type",
                    "Gemstone",
                    "Charge Category",
                    "Weight",
                    "Charge",
                    "Discount",
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
                    <TableCell colSpan={9} className="h-20 text-center">
                      <DataLoading />
                    </TableCell>
                  </TableRow>
                ) : charge?.length > 0 ? (
                  charge.map((item, index) => (
                    <TableRow key={index + 1} className="text-center">
                      <TableCell className="min-w-[100px]">
                        {item.MakingChargeCategorySet?.category || "N/A"}
                      </TableCell>
                      <TableCell className="min-w-[100px]">
                        {item.metalVariant?.metalType?.name || "N/A"} -{" "}
                        {item.metalVariant?.purityLabel || "N/A"}
                      </TableCell>

                      <TableCell className="min-w-[120px]">
                        {item.gemstoneVariant?.gemstoneType?.name || "N/A"} -{" "}
                        {item.gemstoneVariant?.clarity || "N/A"}
                      </TableCell>
                      <TableCell className="min-w-[120px]">
                        {item.chargeCategory || "N/A"}
                      </TableCell>
                      <TableCell className="min-w-[100px] ">
                       <div className="flex flex-col justify-center truncate">
                         <span>
                          <span className="font-medium text-black">
                            Min Weight:
                          </span>{" "}
                          {item.minWeight || "N/A"}
                        </span>
                        <span>
                          <span className="font-medium text-black">
                            Max Weight:
                          </span>{" "}
                          {item.maxWeight || "N/A"}
                        </span>
                       </div>
                      </TableCell>
                      <TableCell className="min-w-[100px]">
                        {item.chargeValue !== undefined ? (
                          <>
                            {item.chargeType === "FIXED" && "₹ "}
                            {item.chargeValue}
                            {item.chargeType === "PERCENTAGE" && " %"}
                            {item.chargeType === "PER_GRAM_WEIGHT" && " /gm"}
                          </>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell className="min-w-[120px]">
                        {item.discountValue !== undefined ? (
                          <>
                            {item.discountType === "FIXED" && "₹ "}
                            {item.discountValue}
                            {item.discountType === "PERCENTAGE" && " %"}
                          </>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell className="min-w-[170px]">
                        <div className="flex items-center justify-center gap-1">
                          {item.globalMakingChargeSlug}
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(
                                item.globalMakingChargeSlug
                              );
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
                          <EditMakingChargeDialog
                            id={item.id}
                            metalVariant={metalVariant}
                            gemstoneVariant={gemstoneVariant}
                            makingCharge={makingCharge}
                            fetchData={fetchData}
                            currentPage={currentPage}
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
                                Are you sure you want to delete this making
                                change master? This action cannot be undone.
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
    </>
  );
};

export default MakingCharge;
