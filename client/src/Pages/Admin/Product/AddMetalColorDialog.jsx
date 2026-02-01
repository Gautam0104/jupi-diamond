import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { createMetalColor } from "../../../api/Admin/MetalApi";
import { toast } from "sonner";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";


const AddMetalColorDialog = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createMetalColor({ name });
      toast.success("Metal color created successfully!");
      onSuccess(); 
      setOpen(false);
      setName("");
    } catch (error) {
      console.error("Error creating metal color:", error);
      toast.error(error.response?.data?.message || "Failed to create metal color");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="text-xs text-gray-500 mb-1 hover:text-gray-700 cursor-pointer">
          Add Metal Color
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Metal Color</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="metalColorName">Color Name</Label>
            <Input
              id="metalColorName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rose Gold"
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMetalColorDialog;