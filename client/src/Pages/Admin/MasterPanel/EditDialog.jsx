import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { toast } from "sonner";
import {
  getGemstoneVariantById,
  updateGemstoneVariant,
} from "../../../api/Admin/GemstoneApi";
import { FiFile, FiImage, FiX } from "react-icons/fi";

const validationSchema = Yup.object().shape({
  gemstoneTypeId: Yup.string().required("Gemstone Type is required"),
  origin: Yup.string().required("Origin is required"),
  clarity: Yup.string().required("Clarity is required"),
  cut: Yup.string().required("Cut is required"),
  shape: Yup.string().required("Shape is required"),
  // color: Yup.string().required("Color is required"),
  gemstonePrice: Yup.number()
    .required("Gemstone Price is required")
    .typeError("Must be a number")
    .positive("Must be greater than 0"),
  certificateFile: Yup.mixed().nullable(),

  // certification: Yup.string().required("Certification is required"),
  // certificateNumber: Yup.string().required("Certificate Number is required"),
});

const EditDialog = ({
  isOpen,
  onOpenChange,
  gemstoneId,
  gemstoneType,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentCertificate, setCurrentCertificate] = useState(null);

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
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const formData = new FormData();

        formData.append("gemstoneTypeId", values.gemstoneTypeId);
        formData.append("origin", values.origin);
        formData.append("clarity", values.clarity);
        formData.append("cut", values.cut);
        formData.append("shape", values.shape);
        formData.append("color", values.color);
        formData.append("gemstonePrice", values.gemstonePrice);
        formData.append("certification", values.certification);
        formData.append("certificateNumber", values.certificateNumber);

        if (values.image && typeof values.image !== "string") {
          formData.append("image", values.image);
        }
        // Handle certificate file
        if (
          values.certificateFile &&
          typeof values.certificateFile !== "string"
        ) {
          formData.append("certificateFile", values.certificateFile);
        } else if (values.certificateFile === null) {
          // Send flag to remove certificate
          formData.append("removeCertificate", "true");
        }

        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }

        const res = await updateGemstoneVariant(gemstoneId, formData);
        if (res.status === 200) {
          toast.success("Gemstone variant updated successfully");
          onOpenChange(false);
          onSuccess();
        } else {
          toast.error(res.data.message || "Failed to update gemstone variant");
        }
      } catch (error) {
        console.error("Error updating gemstone variant:", error);
        toast.error(
          error.response?.data?.message || "Failed to update gemstone variant"
        );
      } finally {
        setLoading(false);
      }
    },
  });

  const fetchGemstoneData = async () => {
    try {
      setLoading(true);
      const response = await getGemstoneVariantById(gemstoneId);
      const data = response.data.data;
      formik.setValues({
        gemstoneTypeId: data.gemstoneTypeId,
        origin: data.origin,
        clarity: data.clarity,
        cut: data.cut,
        shape: data.shape,
        color: data.color,
        gemstonePrice: data.gemstonePrice,

        certification: data.certification,
        certificateNumber: data.certificateNumber,
        image: data.imageUrl || null,
        certificateFile: data.certificateUrl || null,
      });
      if (data.imageUrl) {
        setCurrentImage(data.imageUrl);
        setImagePreview(data.imageUrl);
      }
      if (data.certificateUrl) {
        setCurrentCertificate(data.certificateUrl);
      }
    } catch (error) {
      console.log("Error fetching gemstone data:", error);
      toast.error("Failed to fetch gemstone data");
    } finally {
      setLoading(false);
    }
  };
  const handleImageChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      formik.setFieldValue("image", file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleCertificateChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      formik.setFieldValue("certificateFile", file);
    }
  };

  const removeImage = () => {
    formik.setFieldValue("image", null);
    setImagePreview(null);
    const fileInput = document.getElementById("image-edit");
    if (fileInput) fileInput.value = "";
  };

  const removeCertificate = () => {
    formik.setFieldValue("certificateFile", null);
    setCurrentCertificate(null);
    const fileInput = document.getElementById("certificateFile-edit");
    if (fileInput) fileInput.value = "";
  };

  useEffect(() => {
    if (isOpen && gemstoneId) {
      fetchGemstoneData();
    }

    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [isOpen, gemstoneId]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Gemstone Variant</DialogTitle>
          <DialogDescription>
            Update the details of this gemstone variant
          </DialogDescription>
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
                  <p className="text-red-500 text-xs -mt-1">
                    {formik.errors.gemstoneTypeId}
                  </p>
                )}
            </div>

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
                <p className="text-red-500 text-xs -mt-1">
                  {formik.errors.origin}
                </p>
              )}
            </div>

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
                <p className="text-red-500 text-xs -mt-1">
                  {formik.errors.clarity}
                </p>
              )}
            </div>

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
                <p className="text-red-500 text-xs -mt-1">
                  {formik.errors.cut}
                </p>
              )}
            </div>

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
                <p className="text-red-500 text-xs -mt-1">
                  {formik.errors.shape}
                </p>
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
                <p className="text-red-500 text-xs -mt-1">
                  {formik.errors.color}
                </p>
              )}
            </div>

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
                <p className="text-red-500 text-xs -mt-1">
                  {formik.errors.gemstonePrice}
                </p>
              )}
            </div>

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
                <p className="text-red-500 text-xs -mt-1">
                  {formik.errors.certification}
                </p>
              )}
            </div>

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
                  <p className="text-red-500 text-xs -mt-1">
                    {formik.errors.certificateNumber}
                  </p>
                )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="image-edit">Gemstone Image</Label>
              <input
                id="image-edit"
                name="image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />

              {!imagePreview ? (
                <div
                  onClick={() => document.getElementById("image-edit").click()}
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
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-contain bg-gray-100"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {formik.values.image?.name || "Current image"}
                  </p>
                </div>
              )}

              {formik.touched.image && formik.errors.image && (
                <div className="text-red-500 text-xs -mt-1">
                  {formik.errors.image}
                </div>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="certificateFile-edit">
                Certificate File (PDF)
              </Label>
              <input
                id="certificateFile-edit"
                name="certificateFile"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleCertificateChange}
              />

              <div
                onClick={() =>
                  document.getElementById("certificateFile-edit").click()
                }
                className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 cursor-pointer hover:border-primary transition-colors"
              >
                <FiFile className="h-6 w-6 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-1">
                  {formik.values.certificateFile?.name ||
                    (currentCertificate
                      ? "Current certificate file"
                      : "Click to upload certificate (PDF)")}
                </p>
                {(formik.values.certificateFile || currentCertificate) && (
                  <div className="flex gap-2">
                    {currentCertificate && !formik.values.certificateFile && (
                      <a
                        href={currentCertificate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 text-xs hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Current
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCertificate();
                      }}
                      className="text-red-500 text-xs hover:text-red-700"
                    >
                      Remove file
                    </button>
                  </div>
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
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? "Updating..." : "Update Gemstone"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
