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
  createCurrency,
  deleteCurrency,
  getAllCurrencies,
  getCurrencyById,
  updateCurrency,
} from "../../../../api/Admin/CurrencyApi";

// Currency symbols data
const currencySymbols = [
  { name: "Indian Rupee", symbol: "₹", code: "INR" },
  { name: "Euro", symbol: "€", code: "EUR" },
  { name: "British Pound", symbol: "£", code: "GBP" },
  { name: "US Dollar", symbol: "$", code: "USD" },
];

// Validation schema
const currencySchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  code: Yup.string().required("Code is required"),
  symbol: Yup.string().required("Symbol is required"),
  exchangeRate: Yup.number()
    .required("Exchange rate is required")
    .positive("Exchange rate must be positive"),
});

const Currency = () => {
  const { clearFilters, filters, handleFilterChangeHook } = useFiltration();

  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditId, setCurrentEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [currencyToDelete, setCurrencyToDelete] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAllCurrencies();
      setCurrency(response.data.data);
    } catch (err) {
      console.log(err.message);
      toast.error("Failed to fetch currencies");
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
      code: "",
      symbol: "",
      exchangeRate: "",
    },
    validationSchema: currencySchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        let response;
        if (isEditMode) {
          response = await updateCurrency(currentEditId, values);
        } else {
          response = await createCurrency(values);
        }

        if (response.data.success) {
          toast.success(
            `Currency ${isEditMode ? "updated" : "created"} successfully`
          );
          resetForm();
          fetchData();
        } else {
          toast.error(
            response.data?.message ||
              `Failed to ${isEditMode ? "update" : "create"} currency`
          );
        }
      } catch (error) {
        console.log("Submit error:", error);
        toast.error(
          error.response?.data?.message ||
            `Failed to ${isEditMode ? "update" : "create"} currency`
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const response = await getCurrencyById(id);
      const currencyData = response.data.data;

      formik.setValues({
        name: currencyData.name,
        code: currencyData.code,
        symbol: currencyData.symbol,
        exchangeRate: currencyData.exchangeRate,
      });

      setCurrentEditId(id);
      setIsEditMode(true);
      setIsDialogOpen(true);
    } catch (error) {
      console.log("Error fetching currency:", error);
      toast.error("Failed to load currency for editing");
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
    setCurrencyToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (currencyToDelete) {
      await handleDelete(currencyToDelete);
      setDeleteConfirmOpen(false);
      setCurrencyToDelete(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteCurrency(id);
      if (response.data.success) {
        toast.success("Currency deleted successfully");
        fetchData();
      } else {
        toast.error(response.data.message || "Failed to delete currency");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete currency");
    }
  };

  const handleSymbolChange = (value) => {
    const selectedCurrency = currencySymbols.find(
      (curr) => curr.symbol === value
    );
    if (selectedCurrency) {
      formik.setValues({
        ...formik.values,
        symbol: selectedCurrency.symbol,
        name: selectedCurrency.name,
        code: selectedCurrency.code,
      });
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 ">
        <h2 className="text-2xl font-semibold">CMS</h2>
        <div className="flex items-center justify-between gap-2 mt-2">
          <h2 className="text-md font-semibold">Currency</h2>

          {/* <div className="flex items-center gap-2">
            <Button className="addButton truncate" onClick={openAddDialog}>
              Add Currency
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
                  "Code",
                  "Symbol",
                  "Exchange Rate",
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
                  <TableCell colSpan={7} className="h-20 text-center">
                    <DataLoading />
                  </TableCell>
                </TableRow>
              ) : currency?.length > 0 ? (
                currency.map((item, index) => (
                  <TableRow key={item.id} className="text-center">
                    <TableCell className="min-w-[100px]">
                      {index + 1}.
                    </TableCell>
                    <TableCell className="min-w-[140px]">{item.name}</TableCell>
                    <TableCell className="min-w-[100px]">{item.code}</TableCell>
                    <TableCell className="min-w-[100px]">
                      {item.symbol}
                    </TableCell>
                    <TableCell className="min-w-[100px]">
                      {item.exchangeRate}
                    </TableCell>
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
                  <TableCell colSpan={7} className="h-24 text-center">
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

      {/* Add/Edit Currency Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Currency" : "Create Currency"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the currency details below."
                : "Fill in the details to create a new currency."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={formik.handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="symbol" className="text-left">
                  Symbol
                </Label>
                <div className="col-span-3">
                  <Select
                    value={formik.values.symbol}
                    onValueChange={handleSymbolChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency symbol" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencySymbols.map((currency) => (
                        <SelectItem key={currency.code} value={currency.symbol}>
                          {currency.name} ({currency.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formik.touched.symbol && formik.errors.symbol ? (
                    <div className="mt-1 text-left text-xs text-red-500">
                      {formik.errors.symbol}
                    </div>
                  ) : null}
                </div>
              </div>

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
                    placeholder="Enter currency name"
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <div className="mt-1 text-left text-xs text-red-500">
                      {formik.errors.name}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-left">
                  Code
                </Label>
                <div className="col-span-3">
                  <Input
                    id="code"
                    name="code"
                    value={formik.values.code}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter currency code"
                  />
                  {formik.touched.code && formik.errors.code ? (
                    <div className="mt-1 text-left text-xs text-red-500">
                      {formik.errors.code}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="exchangeRate" className="text-left">
                  Exchange Rate
                </Label>
                <div className="col-span-3">
                  <Input
                    id="exchangeRate"
                    name="exchangeRate"
                    type="number"
                    step="0.01"
                    value={formik.values.exchangeRate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter exchange rate"
                  />
                  {formik.touched.exchangeRate && formik.errors.exchangeRate ? (
                    <div className="mt-1 text-left text-xs text-red-500">
                      {formik.errors.exchangeRate}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving..."
                  : isEditMode
                  ? "Update Currency"
                  : "Create Currency"}
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
              Are you sure you want to delete this currency? This action cannot
              be undone.
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

export default Currency;
