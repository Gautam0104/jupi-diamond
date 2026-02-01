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

import {
  getGemstoneType,
  getGemstoneVariant,
  createGemstoneVariant,
  deleteGemstoneVariant,
} from "../../../api/Admin/GemstoneApi";
import useFiltration from "../../../Hooks/useFilteration";
import PaginationComponent from "../../../components/PaginationComponent/PaginationComponent";
import { FiFile, FiImage, FiSearch, FiTrash2, FiX } from "react-icons/fi";
import DataLoading from "../../../components/Loaders/DataLoading";
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
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import EditDialog from "./EditDialog";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const GemstoneMaster = () => {
  const {
    clearFilters,
    filters,
    handleFilterChangeHook,
    handlePaginationChange,
    debouncedSearch,
  } = useFiltration();

  const navigate = useNavigate();
  const [pagination, setPagination] = useState({});
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedGemstoneId, setSelectedGemstoneId] = useState(null);
  const [gemstone, setGemstone] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gemstoneType, setGemstoneType] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const validationSchema = Yup.object().shape({
    gemstoneTypeId: Yup.string().required("Gemstone Type is required"),
    origin: Yup.string().required("Origin is required"),
    clarity: Yup.string().required("Clarity is required"),
    cut: Yup.string().required("Cut is required"),
    shape: Yup.string().required("Shape is required"),
    // color: Yup.string().required("Color is required"),
    gemstonePrice: Yup.number()
      .typeError("Price must be a number")
      .required("Price is required")
      .positive("Must be greater than zero"),
    image: Yup.mixed().required("Image is required"),
    certificateFile: Yup.mixed().nullable(),

    // certification: Yup.string().required("Certification is required"),
    // certificateNumber: Yup.string().required("Certificate number is required"),
  });

  const currentPage = pagination.page;

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await getGemstoneVariant({
        page: filters.page || 1,
        limit: 10,
        search: debouncedSearch,
      });
      setGemstone(response.data.data.gemstoneVariant);
      setPagination(response.data.data.pagination);
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchGemstoneType = async () => {
    setLoading(true);
    try {
      const response = await getGemstoneType();
      setGemstoneType(response.data.data);
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to fetch gemstone types");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(filters.page);
    fetchGemstoneType();
  }, [debouncedSearch, filters.page, filters.limit]);

  const handlePageChange = (page) => {
    handlePaginationChange(page, filters.pageSize);
  };

  const formik = useFormik({
    initialValues: {
      gemstoneTypeId: "",
      origin: "",
      clarity: "",
      cut: "",
      shape: "",
      color: "",
      gemstonePrice: "",

      certification: "",
      certificateNumber: "",
      image: null,
      certificateFile: null,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        const formData = new FormData();

        Object.keys(values).forEach((key) => {
          if (key !== "image" && key !== "certificateFile") {
            formData.append(key, values[key] !== null ? values[key] : "");
          }
        });

        if (values.image) {
          formData.append("image", values.image);
        }
        if (values.certificateFile) {
          formData.append("certificateFile", values.certificateFile);
        }

        const res = await createGemstoneVariant(formData);

        if (res.status === 201) {
          toast.success("Gemstone variant added successfully");
          setIsDialogOpen(false);
          resetForm();
          fetchData(filters.page);
        } else {
          toast.error(res.data.message || "Failed to add gemstone variant");
        }
      } catch (error) {
        console.error("Error creating gemstone variant:", error);
        toast.error(
          error.response?.data?.message || "Failed to add gemstone variant"
        );
      } finally {
        setLoading(false);
      }
    },
  });

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [gemstoneToDelete, setGemstoneToDelete] = useState(null);

  const handleDeleteClick = (id) => {
    setGemstoneToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (gemstoneToDelete) {
      await handleDeleteProductVariant(gemstoneToDelete);
      setDeleteConfirmOpen(false);
      setGemstoneToDelete(null);
    }
  };

  const handleDeleteProductVariant = async (id) => {
    try {
      const response = await deleteGemstoneVariant(id);
      if (response.data.success) {
        toast.success("Product variant deleted successfully");
        fetchData(currentPage);
      } else {
        toast.error(
          response.data.message || "Failed to delete product variant"
        );
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete product variant"
      );
    }
  };

  return (
    <div className=" w-full ">
      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-4">Master Panel</h2>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-md font-semibold w-full md:w-auto sm:text-center md:text-left">
            Gemstone Master
          </p>

          <div className="flex flex-row gap-2 items-center w-full md:w-auto">
            <div className="flex items-center gap-2 w-auto sm:w-auto">
              {/* <button className="addButton truncate text-xs w-full sm:w-auto">
                CSV Upload
              </button> */}

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <button className="addButton truncate text-xs w-auto sm:w-auto">
                    Add More
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto scrollbarWidthThinAdmin">
                  <DialogHeader>
                    <DialogTitle>Add New Gemstone Variant</DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={formik.handleSubmit}
                    autoComplete="off"
                    className="grid gap-4 py-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="gemstoneTypeId">Gemstone Type</Label>
                        <Select
                          value={formik.values.gemstoneTypeId}
                          onValueChange={(value) =>
                            formik.setFieldValue("gemstoneTypeId", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gemstone type" />
                          </SelectTrigger>
                          <SelectContent>
                            {gemstoneType.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {formik.touched.gemstoneTypeId &&
                          formik.errors.gemstoneTypeId && (
                            <div className="text-red-500 text-xs -mt-1">
                              {formik.errors.gemstoneTypeId}
                            </div>
                          )}
                      </div>

                      {/* Origin */}
                      <div className="space-y-2">
                        <Label htmlFor="origin">Origin Type</Label>
                        <Select
                          value={formik.values.origin}
                          onValueChange={(value) =>
                            formik.setFieldValue("origin", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select origin type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NATURAL">Natural</SelectItem>
                            <SelectItem value="LAB_GROWN">Lab Grown</SelectItem>
                            <SelectItem value="TREATED">Treated</SelectItem>
                            <SelectItem value="SYNTHETIC">Synthetic</SelectItem>
                            <SelectItem value="MOISSANITE">
                              Moissanite
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {formik.touched.origin && formik.errors.origin && (
                          <div className="text-red-500 text-xs -mt-1">
                            {formik.errors.origin}
                          </div>
                        )}
                      </div>

                      {/* Clarity */}
                      <div className="space-y-2">
                        <Label htmlFor="clarity">Clarity</Label>
                        <Input
                          id="clarity"
                          name="clarity"
                          value={formik.values.clarity}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="e.g. VVS1, VS2"
                        />
                        {formik.touched.clarity && formik.errors.clarity && (
                          <div className="text-red-500 text-xs -mt-1">
                            {formik.errors.clarity}
                          </div>
                        )}
                      </div>

                      {/* Cut */}
                      <div className="space-y-2">
                        <Label htmlFor="cut">Cut</Label>
                        <Input
                          id="cut"
                          name="cut"
                          value={formik.values.cut}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="e.g. Excellent, Very Good, Good"
                        />
                        {formik.touched.cut && formik.errors.cut && (
                          <div className="text-red-500 text-xs -mt-1">
                            {formik.errors.cut}
                          </div>
                        )}
                      </div>

                      {/* Shape */}
                      <div className="space-y-2">
                        <Label htmlFor="shape">Shape</Label>
                        <Input
                          id="shape"
                          name="shape"
                          value={formik.values.shape}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="e.g. Round, Oval"
                        />
                        {formik.touched.shape && formik.errors.shape && (
                          <div className="text-red-500 text-xs -mt-1">
                            {formik.errors.shape}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="color">Color</Label>
                        <Input
                          id="color"
                          name="color"
                          value={formik.values.color}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="e.g. Red, Blue"
                        />
                        {formik.touched.color && formik.errors.color && (
                          <div className="text-red-500 text-xs -mt-1">
                            {formik.errors.color}
                          </div>
                        )}
                      </div>

                      {/* Price */}
                      <div className="space-y-2">
                        <Label htmlFor="gemstonePrice">
                          Gemstone Price (₹)
                        </Label>
                        <Input
                          id="gemstonePrice"
                          name="gemstonePrice"
                          type="number"
                          step="0.01"
                          value={formik.values.gemstonePrice}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Enter gemstone price"
                          onWheel={(e) => e.target.blur()}
                          onKeyDown={(e) => {
                            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                              e.preventDefault();
                            }
                          }}
                          className="no-spinners"
                        />
                        {formik.touched.gemstonePrice &&
                          formik.errors.gemstonePrice && (
                            <div className="text-red-500 text-xs -mt-1">
                              {formik.errors.gemstonePrice}
                            </div>
                          )}
                      </div>

                      {/* Certification */}
                      <div className="space-y-2">
                        <Label htmlFor="certification">Certification</Label>
                        <Input
                          id="certification"
                          name="certification"
                          value={formik.values.certification}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="e.g. GIA, IGI"
                        />
                        {formik.touched.certification &&
                          formik.errors.certification && (
                            <div className="text-red-500 text-xs -mt-1">
                              {formik.errors.certification}
                            </div>
                          )}
                      </div>

                      {/* Certificate Number */}
                      <div className="space-y-2">
                        <Label htmlFor="certificateNumber">
                          Certificate Number
                        </Label>
                        <Input
                          id="certificateNumber"
                          name="certificateNumber"
                          value={formik.values.certificateNumber}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          placeholder="Enter certificate number"
                        />
                        {formik.touched.certificateNumber &&
                          formik.errors.certificateNumber && (
                            <div className="text-red-500 text-xs -mt-1">
                              {formik.errors.certificateNumber}
                            </div>
                          )}
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="image">Gemstone Image</Label>
                        <input
                          id="image"
                          name="image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => {
                            const file = event.currentTarget.files[0];
                            if (file) {
                              formik.setFieldValue("image", file);
                              const previewUrl = URL.createObjectURL(file);
                              setImagePreview(previewUrl);
                            }
                          }}
                        />

                        {!imagePreview ? (
                          <div
                            onClick={() =>
                              document.getElementById("image").click()
                            }
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
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-48 object-contain bg-gray-100"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                formik.setFieldValue("image", null);
                                setImagePreview(null);
                                document.getElementById("image").value = "";
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
                            >
                              <FiX className="h-4 w-4" />
                            </button>
                          </div>
                        )}

                        {formik.touched.image && formik.errors.image && (
                          <div className="text-red-500 text-xs -mt-1">
                            {formik.errors.image}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="certificateFile">
                          Certificate File (PDF)
                        </Label>
                        <input
                          id="certificateFile"
                          name="certificateFile"
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={(event) => {
                            const file = event.currentTarget.files[0];
                            formik.setFieldValue("certificateFile", file);
                          }}
                        />

                        <div
                          onClick={() =>
                            document.getElementById("certificateFile").click()
                          }
                          className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 cursor-pointer hover:border-primary transition-colors"
                        >
                          <FiFile className="h-6 w-6 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500 mb-1">
                            {formik.values.certificateFile
                              ? formik.values.certificateFile.name
                              : "Click to upload certificate (PDF)"}
                          </p>
                          {formik.values.certificateFile && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                formik.setFieldValue("certificateFile", null);
                                document.getElementById(
                                  "certificateFile"
                                ).value = "";
                              }}
                              className="text-red-500 text-xs hover:text-red-700"
                            >
                              Remove file
                            </button>
                          )}
                        </div>

                        {formik.touched.certificateFile &&
                          formik.errors.certificateFile && (
                            <div className="text-red-500 text-xs mt-1">
                              {formik.errors.certificateFile}
                            </div>
                          )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        className="w-full sm:w-auto"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto"
                      >
                        {loading ? "Adding..." : "Add Gemstone"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="relative flex items-center w-full max-w-[250px] min-w-[150px]">
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
                  "Type",
                  "Origin Type",
                  "Color",
                  "Shape",
                  "Cut",
                  // "Clarity",
                  "Price",
                  "Certification",
                  "Certificate No.",
                  "Certificate PDF",
                  "Slug",
                  "Created At",
                  "Actions",
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
                  <TableCell colSpan={12} className="h-20 text-center">
                    <DataLoading />
                  </TableCell>
                </TableRow>
              ) : gemstone?.length > 0 ? (
                gemstone.map((item) => (
                  <TableRow key={item.id} className="text-center">
                    <TableCell className="min-w-[100px]">
                      <div className="flex items-center justify-center">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.gemstoneType.name}
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
                    <TableCell className="min-w-[100px]">
                      {item.gemstoneType.name} - {item.clarity}
                    </TableCell>
                    {/* <TableCell className="min-w-[100px]">{item.name}</TableCell> */}
                    <TableCell className="min-w-[80px]">
                      {item.origin}
                    </TableCell>
                    <TableCell className="min-w-[80px] ">
                      {item.color || "N/A"}
                    </TableCell>
                    <TableCell className="min-w-[120px]">
                      {item.shape || "N/A"}
                    </TableCell>
                    <TableCell className="min-w-[100px]">{item.cut}</TableCell>
                    <TableCell className="min-w-[100px]">
                      ₹ {item.gemstonePrice || "N/A"}
                    </TableCell>
                    <TableCell className="min-w-[80px]">
                      {item.certification || "N/A"}
                    </TableCell>
                    <TableCell className="min-w-[80px]">
                      {item.certificateNumber || "N/A"}
                    </TableCell>

                    <TableCell className="min-w-[140px]">
                      {item.certificateUrl ? (
                        <a
                          href={item.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 text-sm hover:underline hover:font-medium"
                        >
                          View Certificate
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell className="min-w-[160px]">
                      <div className="flex items-center justify-center gap-1">
                        {item.gemstoneVariantSlug || "N/A"}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              item.gemstoneVariantSlug
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
                    <TableCell className="min-w-[150px]">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="edit"
                          size="sm"
                         
                          onClick={() =>
                            navigate(
                              `/admin/master-panel/gemstone-master-history/${item.id}`
                            )
                          }
                        >
                          View History
                        </Button>
                        <Button
                          variant="edit"
                          size="sm"
                          onClick={() => {
                            setSelectedGemstoneId(item.id);
                            setIsEditDialogOpen(true);
                          }}
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
                                Are you sure you want to delete this gemstone ?
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
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={12} className="h-24 text-center">
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

          <EditDialog
            isOpen={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            gemstoneId={selectedGemstoneId}
            gemstoneType={gemstoneType}
            onSuccess={() => fetchData(currentPage)}
          />
        </div>
      </div>
    </div>
  );
};

export default GemstoneMaster;
