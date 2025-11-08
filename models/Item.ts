import mongoose, { Schema, Document, Model } from "mongoose";

export interface IItem extends Document {
  name: string;
  category: string;
  unit: string;
  quantity: number;
  reorderThreshold: number;
  costPrice: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const ItemSchema = new Schema<IItem>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      maxlength: [50, "Category cannot exceed 50 characters"],
    },
    unit: {
      type: String,
      required: [true, "Unit is required"],
      trim: true,
      maxlength: [20, "Unit cannot exceed 20 characters"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
      default: 0,
    },
    reorderThreshold: {
      type: Number,
      required: [true, "Reorder threshold is required"],
      min: [0, "Reorder threshold cannot be negative"],
      default: 0,
    },
    costPrice: {
      type: Number,
      required: [true, "Cost price is required"],
      min: [0, "Cost price cannot be negative"],
      default: 0,
    },
    createdBy: {
      type: String,
      required: [true, "Creator ID is required"],
    },
  },
  {
    timestamps: true,
  }
);

ItemSchema.index({ name: 1 });
ItemSchema.index({ category: 1 });
ItemSchema.index({ createdBy: 1 });
ItemSchema.index({ updatedAt: -1 });

const Item: Model<IItem> = mongoose.models.Item || mongoose.model<IItem>("Item", ItemSchema);

export default Item;
