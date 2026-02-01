import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Button } from "../../../components/ui/button";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { getGemstoneType, createGemstoneVariant } from "../../../api/Admin/GemstoneApi";
import { FiImage, FiX } from "react-icons/fi";

const AddGemstoneVariantDialog = ({ onSuccess, children }) => {
  const [open, setOpen] = useState(false);
  const [gemstoneTypes, setGemstoneTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const validationSchema = Yup.object().shape({
    gemstoneTypeId: Yup.string().required("Gemstone type is required"),
    origin: Yup.string().required("Origin is required"),
    clarity: Yup.string().required("Clarity is required"),
    cut: Yup.string().required("Cut is required"),
    shape: Yup.string().required("Shape is required"),
    color: Yup.string().required("Color is required"),
    gemstonePrice: Yup.number()
      .required("Price is required")
      .min(0, "Price must be positive"),
    image: Yup.mixed()
      .required("Image is required")
      .test("fileSize", "File too large", (value) => {
        if (!value) return true; // if no file, let required validation handle it
        return value.size <= 5 * 1024 * 1024; // 5MB
      })
      .test("fileType", "Unsupported file format", (value) => {
        if (!value) return true; // if no file, let required validation handle it
        return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
      }),
    // certification: Yup.string(),
    // certificateNumber: Yup.string(),
  });

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
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const payload = {
          ...values,
          gemstonePrice: Number(values.gemstonePrice),
        };
        
        // You'll need to modify your API call to handle file upload
        const formData = new FormData();
        Object.keys(payload).forEach(key => {
          formData.append(key, payload[key]);
        });
        
        const response = await createGemstoneVariant(formData);
        
        if (response.status === 201) {
          toast.success("Gemstone variant added successfully");
          onSuccess();
          setOpen(false);
          formik.resetForm();
          setImagePreview(null);
        } else {
          toast.error(response.data?.message || "Failed to add gemstone variant");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error(
          error.response?.data?.message || "Failed to add gemstone variant"
        );
      } finally {
        setLoading(false);
      }
    },
  });

  const fetchGemstoneType = async () => {
    try {
      const response = await getGemstoneType();
      if (response.data.success) {
        setGemstoneTypes(response.data.data);
        if (response.data.data.length > 0) {
          formik.setFieldValue("gemstoneTypeId", response.data.data[0].id);
        }
      } else {
        toast.error(response.data.message || "Failed to fetch gemstone types");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch gemstone types"
      );
    }
  };

  useEffect(() => {
    if (open) {
      fetchGemstoneType();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Gemstone Variant</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gemstone Type */}
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
                  {gemstoneTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.gemstoneTypeId && formik.errors.gemstoneTypeId && (
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
                onValueChange={(value) => formik.setFieldValue("origin", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select origin type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NATURAL">Natural</SelectItem>
                  <SelectItem value="LAB_GROWN">Lab Grown</SelectItem>
                  <SelectItem value="TREATED">Treated</SelectItem>
                  <SelectItem value="SYNTHETIC">Synthetic</SelectItem>
                  <SelectItem value="MOISSANITE">Moissanite</SelectItem>
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

            {/* Color */}
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
              <Label htmlFor="gemstonePrice">Gemstone Price (₹)</Label>
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
              {formik.touched.gemstonePrice && formik.errors.gemstonePrice && (
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
              {formik.touched.certification && formik.errors.certification && (
                <div className="text-red-500 text-xs -mt-1">
                  {formik.errors.certification}
                </div>
              )}
            </div>

            {/* Certificate Number */}
            <div className="space-y-2">
              <Label htmlFor="certificateNumber">Certificate Number</Label>
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

            {/* Image Upload */}
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
                  onClick={() => document.getElementById("image").click()}
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
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
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
  );
};

export default AddGemstoneVariantDialog;