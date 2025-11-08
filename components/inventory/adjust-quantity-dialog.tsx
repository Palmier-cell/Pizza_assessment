"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IItem } from "@/models/Item";

interface AdjustQuantityDialogProps {
  item: IItem | null;
  open: boolean;
  onClose: () => void;
  onAdjust: (itemId: string, delta: number, reason?: string) => Promise<void>;
}

export function AdjustQuantityDialog({ item, open, onClose, onAdjust }: AdjustQuantityDialogProps) {
  const [delta, setDelta] = useState<number>(0);
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || delta === 0) return;

    setError("");
    setIsLoading(true);

    try {
      await onAdjust(String(item._id), delta, reason || undefined);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to adjust quantity");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setDelta(0);
    setReason("");
    setError("");
    onClose();
  };

  if (!item) return null;

  const newQuantity = item.quantity + delta;
  const isNegative = newQuantity < 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adjust Quantity</DialogTitle>
          <DialogDescription>
            Update the stock level for <strong>{item.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Current Quantity:</span>
              <span className="font-semibold">
                {item.quantity} {item.unit}
              </span>
            </div>
            {delta !== 0 && (
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-gray-600">New Quantity:</span>
                <span className={`font-semibold ${isNegative ? "text-red-600" : "text-green-600"}`}>
                  {newQuantity} {item.unit}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="delta">
              Adjustment <span className="text-red-500">*</span>
            </Label>
            <Input
              id="delta"
              type="number"
              step="0.01"
              value={delta || ""}
              onChange={(e) => setDelta(parseFloat(e.target.value) || 0)}
              placeholder="Enter positive to add, negative to remove"
              required
              aria-invalid={isNegative}
              aria-describedby="delta-help"
            />
            <p id="delta-help" className="text-xs text-gray-500">
              Use positive numbers to add stock, negative to remove
            </p>
            {isNegative && (
              <p className="text-sm text-red-600">
                Warning: This will result in a negative quantity
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason (optional)</Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Received shipment, Used for orders"
              maxLength={200}
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || delta === 0 || isNegative}>
              {isLoading ? "Adjusting..." : "Adjust Quantity"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
