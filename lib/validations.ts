import { z } from "zod";

export const itemSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  category: z
    .string()
    .min(1, "Category is required")
    .max(50, "Category must be less than 50 characters")
    .trim(),
  unit: z
    .string()
    .min(1, "Unit is required")
    .max(20, "Unit must be less than 20 characters")
    .trim(),
  quantity: z.number().min(0, "Quantity must be 0 or greater"),
  reorderThreshold: z.number().min(0, "Reorder threshold must be 0 or greater"),
  costPrice: z.number().min(0, "Cost price must be 0 or greater"),
});

export const quantityAdjustmentSchema = z.object({
  itemId: z.string().min(1, "Item ID is required"),
  delta: z.number().refine((val) => val !== 0, "Delta cannot be zero"),
  reason: z.string().max(200, "Reason must be less than 200 characters").optional(),
});

export const searchParamsSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  sortBy: z.enum(["name", "quantity", "updatedAt", "costPrice"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

export type ItemInput = z.infer<typeof itemSchema>;
export type QuantityAdjustment = z.infer<typeof quantityAdjustmentSchema>;
export type SearchParams = z.infer<typeof searchParamsSchema>;
