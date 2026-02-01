import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
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
import { createProductSize } from "../../../api/Admin/ProductApi";
import { getJewelleryType } from "../../../api/Admin/JewelleryApi";

const sizeValidationSchema = Yup.object().shape({
  label: Yup.string().test(
    "label-required",
    "Size is required",
    function (value) {
      const { jewelryTypeSlug } = this.parent;
      return jewelryTypeSlug !== "bangles" ? !!value : true;
    }
  ),
  labelSize: Yup.string().test(
    "labelSize-required",
    "Label Size is required",
    function (value) {
      const { jewelryTypeSlug } = this.parent;
      return jewelryTypeSlug === "bangles" ? !!value : true;
    }
  ),
  unit: Yup.string().required("Unit is required"),
  circumference: Yup.string().nullable(),
  jewelryTypeId: Yup.string().required("Jewelry type is required"),
});

const AddProductSizeDialog = ({ onSuccess, children }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jewelleryType, setJewelleryType] = useState([]);
  const [selectedJewelryTypeSlug, setSelectedJewelryTypeSlug] = useState("");

  useEffect(() => {
    const fetchJewelryTypes = async () => {
      try {
        const res = await getJewelleryType();
        setJewelleryType(res.data.data.jewelryType);
      } catch (err) {
        console.error("Error fetching jewelry types:", err);
        toast.error("Failed to load jewelry types");
      }
    };

    if (open) {
      fetchJewelryTypes();
    }
  }, [open]);

  const formik = useFormik({
    initialValues: {
      label: "",
      labelSize: "",
      unit: "",
      circumference: "",
      jewelryTypeId: "",
      jewelryTypeSlug: "",
    },
    validationSchema: sizeValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        // Prepare payload based on jewelry type
        const payload = {
          ...values,
          // For bangles, use labelSize and set label to null
          label: values.jewelryTypeSlug === "bangles" ? null : values.label,
          labelSize:
            values.jewelryTypeSlug === "bangles" ? values.labelSize : null,
          circumference:
            values.circumference === "" ? null : values.circumference,
        };

        // Remove jewelryTypeSlug from payload as it's not needed in the API
        delete payload.jewelryTypeSlug;

        const response = await createProductSize(payload);

        if (response.status === 200) {
          toast.success("Product size created successfully");
          resetForm();
          setOpen(false);
          onSuccess();
        } else {
          toast.error(response.data?.message || "Failed to create product size");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error(
          error.response?.data?.message || "Failed to create product size"
        );
      } finally {
        setLoading(false);
      }
    },
  });

  const handleJewelryTypeChange = (value) => {
    const selectedType = jewelleryType.find((type) => type.id === value);
    const slug = selectedType?.jewelryTypeSlug || "";

    setSelectedJewelryTypeSlug(slug);
    formik.setFieldValue("jewelryTypeId", value);
    formik.setFieldValue("jewelryTypeSlug", slug);

    // Reset label and labelSize when changing jewelry type
    formik.setFieldValue("label", "");
    formik.setFieldValue("labelSize", "");
  };

  const resetForm = () => {
    formik.resetForm();
    setSelectedJewelryTypeSlug("");
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Product Size</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new product size.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="jewelryTypeId">Jewelry Type</Label>
              <Select
                onValueChange={handleJewelryTypeChange}
                value={formik.values.jewelryTypeId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select jewelry type" />
                </SelectTrigger>
                <SelectContent>
                  {jewelleryType.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.jewelryTypeId &&
                formik.errors.jewelryTypeId && (
                  <p className="text-xs text-red-500 -mt-1">
                    {formik.errors.jewelryTypeId}
                  </p>
                )}
            </div>

            {selectedJewelryTypeSlug === "bangles" ? (
              <div className="grid gap-2">
                <Label htmlFor="labelSize">Label Size</Label>
                <Input
                  id="labelSize"
                  name="labelSize"
                  placeholder="Enter label size (e.g., 2-2, 2-4, 2-6)"
                  value={formik.values.labelSize}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.labelSize &&
                  formik.errors.labelSize && (
                    <p className="text-xs text-red-500 -mt-1">
                      {formik.errors.labelSize}
                    </p>
                  )}
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="label">Size</Label>
                <Input
                  id="label"
                  name="label"
                  placeholder="Enter size (e.g., 9)"
                  value={formik.values.label}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.label && formik.errors.label && (
                  <p className="text-xs text-red-500 -mt-1">
                    {formik.errors.label}
                  </p>
                )}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="unit">Unit</Label>
              <Select
                value={formik.values.unit}
                onValueChange={(value) =>
                  formik.setFieldValue("unit", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM">MM</SelectItem>
                  <SelectItem value="CM">CM</SelectItem>
                  <SelectItem value="INCH">INCH</SelectItem>
                  <SelectItem value="IN">IN</SelectItem>
                  <SelectItem value="US">US</SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.unit && formik.errors.unit && (
                <p className="text-xs text-red-500 -mt-1">
                  {formik.errors.unit}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="circumference">
                Circumference (optional)
              </Label>
              <Input
                id="circumference"
                name="circumference"
                type="text"
                placeholder="Enter circumference (e.g., 23.5 cm)"
                value={formik.values.circumference}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                onWheel={(e) => e.target.blur()}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                    e.preventDefault();
                  }
                }}
                className="no-spinners"
              />
              {formik.touched.circumference &&
                formik.errors.circumference && (
                  <p className="text-xs text-red-500 -mt-1">
                    {formik.errors.circumference}
                  </p>
                )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductSizeDialog;