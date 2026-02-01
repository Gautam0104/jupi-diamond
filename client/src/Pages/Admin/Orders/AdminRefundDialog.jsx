import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaRegImage } from "react-icons/fa";

const RefundDialog = ({
  isOpen,
  onClose,
  orderData,
  onConfirmRefund,
}) => {
  const [refundReason, setRefundReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState(orderData?.orderItems || []);

  const handlePriceChange = (index, value) => {
    const updatedItems = [...items];
    updatedItems[index].refundAmount = parseFloat(value) || 0;
    setItems(updatedItems);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);

    const refundPayload = {
      orderId: orderData?.id,
      orderNumber: orderData?.orderNumber,
      refundReason,
      items: items.map((item) => ({
        orderItemId: item.id,
        refundAmount: item.refundAmount || item.price,
      })),
    };

    await onConfirmRefund(refundPayload);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-md sm:text-lg">Refund Order</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Please confirm the items and refund amount. You can adjust the amount and provide a reason before initiating the refund.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[350px] overflow-y-auto">
          {items.map((item, index) => (
            <div key={item.id} className="flex items-start gap-3 mb-3">
              {item.imageUrl?.endsWith(".mp4") ? (
                <video
                  src={item.imageUrl}
                  className="w-12 h-12 object-cover rounded border"
                  autoPlay
                  loop
                  muted
                />
              ) : item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-12 h-12 object-cover rounded border"
                />
              ) : (
                <div className="flex items-center justify-center w-12 h-12 border-2 border-dashed border-gray-300 bg-gray-100">
                  <FaRegImage className="text-gray-400 text-xl" />
                </div>
              )}

              <div className="w-full">
                <p className="font-medium text-xs sm:text-sm">{item.productName}</p>
                <p className="text-xs text-gray-500 mb-1">Qty: {item.quantity}</p>
                <Input
                  type="number"
                  min="0"
                  value={item.refundAmount || item.price}
                  onChange={(e) => handlePriceChange(index, e.target.value)}
                  className="text-xs"
                  placeholder="Refund Amount"
                />
              </div>
            </div>
          ))}
          <Textarea
            placeholder="Reason for refund..."
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            className="min-h-[100px] text-xs sm:text-sm"
          />
        </div>

        <DialogFooter className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-xs sm:text-sm"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="text-xs sm:text-sm"
          >
            {isSubmitting ? "Processing..." : "Confirm Refund"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RefundDialog;
