import { useEffect, useState } from "react";
import {
  getMetalVariantById,
  updateMetalVariant,
} from "../../../api/Admin/MetalApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import DataLoading from "../../../components/Loaders/DataLoading";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Input } from "../../../components/ui/input";
import { toast } from "sonner";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  metalTypeId: Yup.string().required("Metal type is required"),
  purityLabel: Yup.string().required("Purity label is required"),
  metalPriceInGram: Yup.number()
    .required("Unit price is required")
    .positive("Price must be positive"),
  // byBackPrice: Yup.number().positive("Buy back price must be positive"),
});

const EditMetalVariantDialog = ({
  variantId,
  metalTypes,
  fetchData,
  activeTab,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      metalTypeId: "",
      purityLabel: "",
      metalPriceInGram: "",
      // byBackPrice: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await updateMetalVariant(variantId, values);
        if (response.data.success) {
          toast.success("Metal variant updated successfully");
          fetchData(1, activeTab);
          setOpen(false);
        } else {
          toast.error(
            response.data.message || "Failed to update metal variant"
          );
        }
      } catch (error) {
        console.error("Update error:", error);
        toast.error(
          error.response?.data?.message || "Failed to update metal variant"
        );
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (open && variantId) {
      const fetchVariantData = async () => {
        setLoading(true);
        try {
          const response = await getMetalVariantById(variantId);
          if (response.data.success) {
            const variant = response.data.data;
            formik.setValues({
              metalTypeId: variant.metalTypeId,
              purityLabel: variant.purityLabel,
              metalPriceInGram: variant.metalPriceInGram,
              // byBackPrice: variant.byBackPrice || "",
            });
          } else {
            toast.error(
              response.data.message || "Failed to fetch variant data"
            );
          }
        } catch (error) {
          console.error("Fetch error:", error);
          toast.error(
            error.response?.data?.message || "Failed to fetch variant data"
          );
        } finally {
          setLoading(false);
        }
      };
      fetchVariantData();
    }
  }, [open, variantId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="edit"
          size="sm"
          className="text-xs md:text-sm px-6"
          onClick={() => setOpen(true)}
        >
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Metal Variant</DialogTitle>
        </DialogHeader>
        {loading ? (
          <DataLoading />
        ) : (
          <form onSubmit={formik.handleSubmit} className="grid gap-4 py-4">
            <div className="grid sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label htmlFor="metalTypeId" className="text-left">
                Metal Type
              </Label>
              <div className="col-span-3">
                <Select
                  value={formik.values.metalTypeId}
                  onValueChange={(value) =>
                    formik.setFieldValue("metalTypeId", value)
                  }
                  onBlur={formik.handleBlur}
                >
                  <SelectTrigger>
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
                  <div className="mt-1 text-red-500 text-sm text-left">
                    {formik.errors.metalTypeId}
                  </div>
                ) : null}
              </div>
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
                  <div className="mt-1 text-red-500 text-xs text-left">
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
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter price in ₹"
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
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter buy back price in ₹"
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
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditMetalVariantDialog;
