"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ItemInput } from "@/lib/validations";

interface ItemFormProps {
  initialData?: ItemInput & { _id?: string };
  onSubmit: (data: ItemInput) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ItemForm({ initialData, onSubmit, onCancel, isLoading }: ItemFormProps) {
  const [formData, setFormData] = useState<ItemInput>({
    name: initialData?.name || "",
    category: initialData?.category || "",
    unit: initialData?.unit || "",
    quantity: initialData?.quantity || 0,
    reorderThreshold: initialData?.reorderThreshold || 0,
    costPrice: initialData?.costPrice || 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      await onSubmit(formData);
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ submit: error.message });
      }
    }
  };

  const handleChange = (field: keyof ItemInput, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">
          Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="e.g., Mozzarella Cheese"
          required
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p id="name-error" className="text-sm text-red-600">
            {errors.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">
          Category <span className="text-red-500">*</span>
        </Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => handleChange("category", e.target.value)}
          placeholder="e.g., Dairy, Vegetables, Meats"
          required
          aria-invalid={!!errors.category}
          aria-describedby={errors.category ? "category-error" : undefined}
        />
        {errors.category && (
          <p id="category-error" className="text-sm text-red-600">
            {errors.category}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="unit">
            Unit <span className="text-red-500">*</span>
          </Label>
          <Input
            id="unit"
            value={formData.unit}
            onChange={(e) => handleChange("unit", e.target.value)}
            placeholder="e.g., kg, lbs, units"
            required
            aria-invalid={!!errors.unit}
            aria-describedby={errors.unit ? "unit-error" : undefined}
          />
          {errors.unit && (
            <p id="unit-error" className="text-sm text-red-600">
              {errors.unit}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">
            Quantity <span className="text-red-500">*</span>
          </Label>
          <Input
            id="quantity"
            type="number"
            min="0"
            step="0.01"
            value={formData.quantity}
            onChange={(e) => handleChange("quantity", parseFloat(e.target.value) || 0)}
            required
            aria-invalid={!!errors.quantity}
            aria-describedby={errors.quantity ? "quantity-error" : undefined}
          />
          {errors.quantity && (
            <p id="quantity-error" className="text-sm text-red-600">
              {errors.quantity}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="reorderThreshold">Reorder Threshold</Label>
          <Input
            id="reorderThreshold"
            type="number"
            min="0"
            step="0.01"
            value={formData.reorderThreshold}
            onChange={(e) => handleChange("reorderThreshold", parseFloat(e.target.value) || 0)}
            aria-invalid={!!errors.reorderThreshold}
            aria-describedby={errors.reorderThreshold ? "threshold-error" : undefined}
          />
          {errors.reorderThreshold && (
            <p id="threshold-error" className="text-sm text-red-600">
              {errors.reorderThreshold}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="costPrice">Cost Price ($)</Label>
          <Input
            id="costPrice"
            type="number"
            min="0"
            step="0.01"
            value={formData.costPrice}
            onChange={(e) => handleChange("costPrice", parseFloat(e.target.value) || 0)}
            aria-invalid={!!errors.costPrice}
            aria-describedby={errors.costPrice ? "cost-error" : undefined}
          />
          {errors.costPrice && (
            <p id="cost-error" className="text-sm text-red-600">
              {errors.costPrice}
            </p>
          )}
        </div>
      </div>

      {errors.submit && (
        <div className="rounded-md bg-red-50 p-3">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : initialData?._id ? "Update Item" : "Create Item"}
        </Button>
      </div>
    </form>
  );
}
