import mongoose, { Schema, model, models } from "mongoose";

export interface IAuditLog {
  _id: mongoose.Types.ObjectId | string;
  userId?: mongoose.Types.ObjectId | string;
  userEmail: string;
  action: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },
    userEmail: {
      type: String,
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    details: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
      required: false,
    },
    userAgent: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const AuditLog = models.AuditLog || model<IAuditLog>("AuditLog", AuditLogSchema);

export default AuditLog;
