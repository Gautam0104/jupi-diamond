import { useState } from "react";
import { updateProductVariantStock } from "../../../api/Admin/ProductApi";
import { FiCheck } from "react-icons/fi";
import { toast } from "sonner";

const EditableStockCell = ({ variant, onStockUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [stockValue, setStockValue] = useState(variant.stock);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateStock = async () => {
    if (stockValue === variant.stock) {
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);
    try {
      await updateProductVariantStock(variant.id, stockValue);
      setIsEditing(false);
      onStockUpdate(variant.id, stockValue);
      // You might want to add a toast notification here
      toast.success("Stock updated successfully!");
    } catch (error) {
      console.error("Error updating stock:", error);
      setStockValue(variant.stock);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex  gap-1">
      {isEditing ? (
        <div className="flex items-center ">
          <input
            type="number"
            value={stockValue}
            onChange={(e) => setStockValue(Number(e.target.value))}
            className="w-16 px-2 py-1 text-sm  border-2 rounded  border-gray-300 mr-1 "
            disabled={isUpdating}
            min={0}
          />
          <button
            onClick={handleUpdateStock}
            disabled={isUpdating}
            className="text-green-600 px-2 cp  hover:text-green-900 hover:scale-110 transition-transform duration-200"
          >
            <FiCheck className="h-4 w-4 " />
          </button>
        </div>
      ) : (
        <div
          className={`flex items-center cursor-pointer  px-3 py-1.5 rounded hover:scale-110 transition-all duration-300 ease-in-out ${
            variant.stock > 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
          }`}
          onClick={() => setIsEditing(true)}
        >
          <span className="font-medium">{variant.stock}</span>
        </div>
      )}
    </div>
  );
};
export default EditableStockCell;
