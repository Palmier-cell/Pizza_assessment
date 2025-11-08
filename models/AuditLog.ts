import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAuditLog extends Document {
  itemId: mongoose.Types.ObjectId;
  itemName: string;
  action: "create" | "update" | "delete" | "quantity_adjust";
  userId: string;
  userName: string;
  changes: {
    field?: string;
    oldValue?: string | number | boolean;
    newValue?: string | number | boolean;
    delta?: number;
    reason?: string;
  };
  timestamp: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    itemId: {
      type: Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      enum: ["create", "update", "delete", "quantity_adjust"],
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    changes: {
      field: String,
      oldValue: Schema.Types.Mixed,
      newValue: Schema.Types.Mixed,
      delta: Number,
      reason: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

AuditLogSchema.index({ itemId: 1, timestamp: -1 });
AuditLogSchema.index({ userId: 1 });
AuditLogSchema.index({ timestamp: -1 });

const AuditLog: Model<IAuditLog> =
  mongoose.models.AuditLog || mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);

export default AuditLog;
