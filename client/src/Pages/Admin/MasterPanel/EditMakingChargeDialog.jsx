import { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
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
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";

import DataLoading from "../../../components/Loaders/DataLoading";
import {
  fetchSingleMakingChargeWeightRange,
  updateMakingChargeWeightRange,
} from "../../../api/Admin/MakingChargeApi";

const EditMakingChargeDialog = ({
  id,
  metalVariant,
  gemstoneVariant,
  makingCharge,
  fetchData,
  currentPage,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
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
  });

  useEffect(() => {
    if (open && id) {
      fetchChargeData();
    }
  }, [open, id]);

  const fetchChargeData = async () => {
    setLoading(true);
    try {
      const response = await fetchSingleMakingChargeWeightRange(id);
      const data = response.data.data;

      setFormData({
        makingChargeCategorySetId: data.makingChargeCategorySetId,
        chargeCategory: data.chargeCategory,
        chargeType: data.chargeType,
        metalVariantId: data.metalVariantId,
        gemstoneVariantId: data.gemstoneVariantId,
        minWeight: data.minWeight,
        maxWeight: data.maxWeight,
        chargeValue: data.chargeValue,
        discountType: data.discountType,
        discountValue: data.discountValue,
      });
    } catch (error) {
      console.error("Error fetching making charge:", error);
      toast.error("Failed to fetch making charge details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.discountType === "PERCENTAGE" && formData.discountValue > 100) {
      toast.error("Discount Value cannot exceed 100");
      return; 
    }
     if (formData.chargeType === "PERCENTAGE" && formData.chargeValue > 100) {
      toast.error("Discount Value cannot exceed 100");
      return; 
    }

    try {
      const response = await updateMakingChargeWeightRange(id, formData);
      if (response.data.success) {
        toast.success("Making charge weight range updated successfully");
        setOpen(false);
        fetchData(currentPage);
      } else {
        toast.error(
          response.data.message || "Failed to update making charge weight range"
        );
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update making charge weight range"
      );
    }
  };

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
          <DialogTitle>Edit Making Charge Weight Range</DialogTitle>
          <DialogDescription>
            Update the details of this making charge weight range.
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <DataLoading />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="makingChargeCategorySetId">
                  Making Charge Category
                </Label>
                <Select
                  value={formData.makingChargeCategorySetId}
                  onValueChange={(value) =>
                    handleSelectChange("makingChargeCategorySetId", value)
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {makingCharge?.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.category || "N/A"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="chargeCategory">Charge Category</Label>
                <Select
                  value={formData.chargeCategory}
                  onValueChange={(value) =>
                    handleSelectChange("chargeCategory", value)
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select charge category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COMBINED">Combined</SelectItem>
                    <SelectItem value="METAL">Metal</SelectItem>
                    <SelectItem value="GEMSTONE">Gemstone</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metalVariantId">Metal Variant</Label>
                <Select
                  value={formData.metalVariantId}
                  onValueChange={(value) =>
                    handleSelectChange("metalVariantId", value)
                  }
                  required
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="gemstoneVariantId">Gemstone Variant</Label>
                <Select
                  value={formData.gemstoneVariantId}
                  onValueChange={(value) =>
                    handleSelectChange("gemstoneVariantId", value)
                  }
                  required
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="minWeight">Min Weight</Label>
                <Input
                  id="minWeight"
                  name="minWeight"
                  type="number"
                  value={formData.minWeight}
                  onChange={handleChange}
                  required
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxWeight">Max Weight</Label>
                <Input
                  id="maxWeight"
                  name="maxWeight"
                  type="number"
                  value={formData.maxWeight}
                  onChange={handleChange}
                  required
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="chargeType">Charge Type</Label>
                <Select
                  value={formData.chargeType}
                  onValueChange={(value) =>
                    handleSelectChange("chargeType", value)
                  }
                  required
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="chargeValue">Charge Value</Label>
                <Input
                  id="chargeValue"
                  name="chargeValue"
                  type="number"
                  value={formData.chargeValue}
                  onChange={handleChange}
                  required
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountType">Discount Type</Label>
                <Select
                  value={formData.discountType}
                  onValueChange={(value) =>
                    handleSelectChange("discountType", value)
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select discount type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                    <SelectItem value="FIXED">Fixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountValue">Discount Value</Label>
                <Input
                  id="discountValue"
                  name="discountValue"
                  type="number"
                  value={formData.discountValue}
                  onChange={handleChange}
                  required
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
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">Update</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditMakingChargeDialog;
