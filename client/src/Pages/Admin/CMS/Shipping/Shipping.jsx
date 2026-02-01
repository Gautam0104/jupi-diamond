import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import useFiltration from "../../../../Hooks/useFilteration";
import { Button } from "../../../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import DataLoading from "../../../../components/Loaders/DataLoading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import {
  createShippingCharge,
  getShippingChargeById,
  updateShippingCharge,
  deleteShippingCharge,
  getAllShippingCharges,
} from "../../../../api/Admin/ShippingApi";
import { Textarea } from "../../../../components/ui/textarea";

// Validation schema
const shippingSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  // price: Yup.number()
  //   .required("Price is required")
  //   .positive("Price must be positive"),
  content: Yup.string().required("Content is required"),
});

const Shipping = () => {
  const { clearFilters, filters, handleFilterChangeHook } = useFiltration();

  const [loading, setLoading] = useState(false);
  const [shipping, setShipping] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [shipToDelete, setShipToDelete] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAllShippingCharges();
      setShipping(response.data.data);
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to fetch promotional scripts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      // price: "",
      content: "",
    },
    validationSchema: shippingSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        let response;
        if (isEditMode) {
          response = await updateShippingCharge(currentEditId, values);
        } else {
          response = await createShippingCharge(values);
        }

        if (response.data.success) {
          toast.success(
            `Promotional script ${isEditMode ? "updated" : "created"} successfully`
          );
          resetForm();
          fetchData();
        } else {
          toast.error(
            response.data?.message ||
              `Failed to ${isEditMode ? "update" : "create"} promotional script`
          );
        }
      } catch (error) {
        console.log("Submit error:", error);
        toast.error(
          error.response?.data?.message ||
            `Failed to ${isEditMode ? "update" : "create"} promotional script`
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const response = await getShippingChargeById(id);
      const shippingData = response.data.data;

      formik.setValues({
        name: shippingData.name,
        // price: shippingData.price,
        content: shippingData.content,
      });

      setCurrentEditId(id);
      setIsEditMode(true);
      setIsDialogOpen(true);
    } catch (error) {
      console.log("Error fetching promotional script:", error);
      toast.error("Failed to load promotional script for editing");
    } finally {
      setLoading(false);
    }
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    formik.resetForm();
    setIsDialogOpen(false);
    setIsEditMode(false);
    setCurrentEditId(null);
  };

  const handleDeleteClick = (id) => {
    setShipToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (shipToDelete) {
      await handleDelete(shipToDelete);
      setDeleteConfirmOpen(false);
      setShipToDelete(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteShippingCharge(id);
      if (response.data.success) {
        toast.success("Promotional Script deleted successfully");
        fetchData();
      } else {
        toast.error(
          response.data.message || "Failed to delete Promotional Script"
        );
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete Promotional Script"
      );
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 ">
        <h2 className="text-2xl font-semibold">CMS</h2>
        <div className="flex items-center justify-between gap-2 mt-2">
          <h2 className="text-md font-semibold">Promotional Script</h2>

          {/* <div className="flex items-center gap-2">
            <Button className="addButton truncate" onClick={openAddDialog}>
              Add Shipping
            </Button>
          </div> */}
        </div>
      </div>

      <div className="rounded-xl border">
        <div className="relative mb-4">
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  "S.No.",
                  "Name",
                  "Content",
                  // "Price",
                  "Updated At",
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
                  <TableCell colSpan={5} className="h-20 text-center">
                    <DataLoading />
                  </TableCell>
                </TableRow>
              ) : shipping?.length > 0 ? (
                shipping.map((item, index) => (
                  <TableRow key={item.id} className="text-center">
                    <TableCell className="min-w-[100px]">
                      {index + 1}.
                    </TableCell>
                    <TableCell className="min-w-[120px]">{item.name}</TableCell>
                    <TableCell className="min-w-[160px] text-left">
                      {item.content}
                    </TableCell>
                    {/* <TableCell className="min-w-[100px]">
                      ₹{item.price}
                    </TableCell> */}
                    <TableCell className="min-w-[120px]">
                      {new Date(item.updatedAt).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="min-w-[80px]">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="edit"
                          size="sm"
                          className="text-xs md:text-sm px-6"
                          onClick={() => handleEdit(item.id)}
                        >
                          Edit
                        </Button>
                        {/* <Button
                          variant="edit"
                          size="sm"
                          className="text-[10px] md:text-sm px-2 rounded-sm hover:shadow-xl"
                          onClick={() => handleDeleteClick(item.id)}
                        >
                          <FiTrash2 />
                        </Button> */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex justify-center items-center">
                      <span className="text-gray-500">No Data Available</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add/Edit Shipping Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Promotional Script" : "Create Promotional Script"}
            </DialogTitle>
            <DialogDescription className={'text-xs sm:text-sm '}>
              {isEditMode
                ? "Update the promotional script details below."
                : "Fill in the details to create a new promotional script."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit} >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-left">
                  Name
                </Label>
                <div className="col-span-3">
                  <Input
                    id="name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter shipping name"
                    className='text-xs sm:text-sm'
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <div className="mt-1 text-left text-xs text-red-500">
                      {formik.errors.name}
                    </div>
                  ) : null}
                </div>
              </div>

              {/* <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-left">
                  Price
                </Label>
                <div className="col-span-3">
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={formik.values.price}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                      className='text-xs sm:text-sm'
                    placeholder="Enter shipping price"
                  />
                  {formik.touched.price && formik.errors.price ? (
                    <div className="mt-1 text-left text-xs text-red-500">
                      {formik.errors.price}
                    </div>
                  ) : null}
                </div>
              </div> */}

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="content" className="text-left">
                  Content
                </Label>
                <div className="col-span-3">
                  <Textarea
                    id="content"
                    name="content"
                    value={formik.values.content}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                      className='text-xs sm:text-sm'
                    placeholder="Enter shipping description"
                  />
                  {formik.touched.content && formik.errors.content ? (
                    <div className="mt-1 text-left text-xs text-red-500">
                      {formik.errors.content}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <DialogFooter >
              <Button type="button" variant="outline"   className='text-xs sm:text-sm' onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}   className='text-xs sm:text-sm'>
                {isSubmitting
                  ? "Saving..."
                  : isEditMode
                  ? "Update"
                  : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this promotional script? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Shipping;
