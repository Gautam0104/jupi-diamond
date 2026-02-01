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
import { createMetalVariant, getMetalType } from "../../../api/Admin/MetalApi";

const AddMetalVariantDialog = ({ onSuccess, children }) => {
  const [open, setOpen] = useState(false);
  const [metalTypes, setMetalTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    metalTypeId: Yup.string().required("Metal type is required"),
    purityLabel: Yup.string()
      .required("Purity label is required")
      .matches(/^\d{1,3}k$/, "Purity label must be in format like 22k, 24k"),
    metalPriceInGram: Yup.number()
      .required("Price per gram is required")
      .min(0, "Price must be positive"),
  });

  const formik = useFormik({
    initialValues: {
      metalTypeId: "",
      purityLabel: "",
      metalPriceInGram: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const response = await createMetalVariant(values);
        if (response.data.success) {
          toast.success("Metal added successfully");
          onSuccess();
          setOpen(false);
          formik.resetForm();
        } else {
          toast.error(response.data.message || "Failed to add metal ");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error(
          error.response?.data?.message || "Failed to add metal "
        );
      } finally {
        setLoading(false);
      }
    },
  });

  const fetchMetalType = async () => {
    try {
      const response = await getMetalType();
      if (response.data.success) {
        setMetalTypes(response.data.data);
        if (response.data.data.length > 0) {
          formik.setFieldValue("metalTypeId", response.data.data[0].id);
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
    if (open) {
      fetchMetalType();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Metal</DialogTitle>
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
                <div className="text-red-500 text-xs text-left mt-1">
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

          <div className="flex justify-end gap-2 mt-4">
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
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMetalVariantDialog;