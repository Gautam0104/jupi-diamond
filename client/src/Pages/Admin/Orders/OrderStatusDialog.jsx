import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { updateOrderStatus } from "../../../api/Admin/OrderApi";

// Define the order status flow
const STATUS_FLOW = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  // These can be selected from any previous state
  "CANCELLED",
  // "RETURN_REQUESTED",
  "RETURNED",
  "REFUNDED"
];

export function OrderStatusDialog({ orderId, currentStatus, onStatusUpdate }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  // Get allowed next statuses based on current status
  const getAllowedStatuses = () => {
    const currentIndex = STATUS_FLOW.indexOf(currentStatus);
    
    // For these statuses, you can only move forward in the flow
    if (currentIndex < STATUS_FLOW.indexOf("DELIVERED")) {
      // Allow next status in flow plus any special statuses
      return [
        STATUS_FLOW[currentIndex + 1],
        "CANCELLED",
        // "RETURN_REQUESTED",
        "RETURNED",
        "REFUNDED"
      ];
    }
    
    // After delivered or for special statuses, allow all remaining options
    return STATUS_FLOW.slice(STATUS_FLOW.indexOf(currentStatus) + 1);
  };

  const allowedStatuses = getAllowedStatuses();

  const handleStatusUpdate = async () => {
    try {
      setIsUpdating(true);
      await updateOrderStatus(orderId, { status });
      toast.success("Order status updated successfully");
      onStatusUpdate();
      setOpen(false);
    } catch (error) {
      toast.error("Failed to update order status");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="edit" size="sm" className={"text-xs"}>
          Update Status
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4 w-full ">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[300px] sm:w-[370px] text-xs sm:text-sm">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_FLOW.map((statusOption) => (
                  <SelectItem 
                    key={statusOption}
                    value={statusOption}
                    className='text-xs sm:text-sm'
                    disabled={!allowedStatuses.includes(statusOption)}
                  >
                    {statusOption.split('_').map(word => 
                      word.charAt(0) + word.slice(1).toLowerCase()
                    ).join(' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2 ">
          <Button variant="outline" onClick={() => setOpen(false)} className={"text-xs sm:text-sm"}>
            Cancel
          </Button>
          <Button 
            onClick={handleStatusUpdate} 
            disabled={isUpdating || !allowedStatuses.includes(status)}
            className={"text-xs sm:text-sm"}
          >
            {isUpdating ? "Updating..." : "Update Status"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}