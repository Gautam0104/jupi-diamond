import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { createMakingChargeWeightRange, fetchGlobalMakingCharges } from "../../../api/Admin/MakingChargeApi";
import { getMetalVariant } from "../../../api/Admin/MetalApi";
import { getGemstoneVariant } from "../../../api/Admin/GemstoneApi";
import { useEffect } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";

const AddMakingChargeWeightRangeDialog = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [metalVariant, setMetalVariant] = useState([]);
  const [gemstoneVariant, setGemstoneVariant] = useState([]);
  const [makingCharge, setMakingCharge] = useState([]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [gemstoneRes, metalRes, makingChargeRes] = await Promise.all([
        getGemstoneVariant(),
        getMetalVariant(),
        fetchGlobalMakingCharges(),
      ]);

      setGemstoneVariant(gemstoneRes.data.data.gemstoneVariant);
      setMetalVariant(metalRes.data.data.metalVariant);
      setMakingCharge(makingChargeRes.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch required data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchAll();
    }
  }, [open]);

  const validationSchema = Yup.object().shape({
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
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        const response = await createMakingChargeWeightRange(values);
        if (response.status === 201) {
          toast.success("Making charge weight range created successfully");
          setOpen(false);
          resetForm();
          if (onSuccess) onSuccess();
        } else {
          toast.error(response.data.message || "Failed to create weight range");
        }
      } catch (error) {
        console.error("Create error:", error);
        toast.error(error.response?.data?.message || "Creation failed");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <p  className="ml-2 text-xs cp text-gray-500 hover:text-gray-700 ">
          Add Weight Range
        </p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Making Charge Weight Range</DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Making Charge Category */}
            <div className="space-y-2">
              <Label htmlFor="makingChargeCategorySetId">
                Making Charge Category
              </Label>
              <Select
                value={formik.values.makingChargeCategorySetId}
                onValueChange={(value) =>
                  formik.setFieldValue("makingChargeCategorySetId", value)
                }
                disabled={loading}
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

            {/* Charge Category */}
            <div className="space-y-2">
              <Label htmlFor="chargeCategory">Charge Category</Label>
              <Select
                value={formik.values.chargeCategory}
                onValueChange={(value) =>
                  formik.setFieldValue("chargeCategory", value)
                }
                disabled={loading}
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

            {/* Metal Variant */}
            <div className="space-y-2">
              <Label htmlFor="metalVariantId">Metal Variant</Label>
              <Select
                value={formik.values.metalVariantId}
                onValueChange={(value) =>
                  formik.setFieldValue("metalVariantId", value)
                }
                disabled={loading}
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

            {/* Gemstone Variant */}
            <div className="space-y-2">
              <Label htmlFor="gemstoneVariantId">Gemstone Variant</Label>
              <Select
                value={formik.values.gemstoneVariantId}
                onValueChange={(value) =>
                  formik.setFieldValue("gemstoneVariantId", value)
                }
                disabled={loading}
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

            {/* Min Weight */}
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
                disabled={loading}
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

            {/* Max Weight */}
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
                disabled={loading}
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

            {/* Charge Type */}
            <div className="space-y-2">
              <Label htmlFor="chargeType">Charge Type</Label>
              <Select
                value={formik.values.chargeType}
                onValueChange={(value) =>
                  formik.setFieldValue("chargeType", value)
                }
                disabled={loading}
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
              {formik.touched.chargeType && formik.errors.chargeType && (
                <p className="text-red-500 text-xs -mt-1">
                  {formik.errors.chargeType}
                </p>
              )}
            </div>

            {/* Charge Value */}
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
                disabled={loading}
                onWheel={(e) => e.target.blur()}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                    e.preventDefault();
                  }
                }}
                className="no-spinners"
              />
              {formik.touched.chargeValue && formik.errors.chargeValue && (
                <p className="text-red-500 text-xs -mt-1">
                  {formik.errors.chargeValue}
                </p>
              )}
            </div>

            {/* Discount Type */}
            <div className="space-y-2">
              <Label htmlFor="discountType">Discount Type</Label>
              <Select
                value={formik.values.discountType}
                onValueChange={(value) =>
                  formik.setFieldValue("discountType", value)
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select discount type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                  <SelectItem value="FIXED">Fixed</SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.discountType && formik.errors.discountType && (
                <p className="text-red-500 text-xs -mt-1">
                  {formik.errors.discountType}
                </p>
              )}
            </div>

            {/* Discount Value */}
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
                disabled={loading}
                onWheel={(e) => e.target.blur()}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                    e.preventDefault();
                  }
                }}
                className="no-spinners"
              />
              {formik.touched.discountValue && formik.errors.discountValue && (
                <p className="text-red-500 text-xs -mt-1">
                  {formik.errors.discountValue}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMakingChargeWeightRangeDialog;