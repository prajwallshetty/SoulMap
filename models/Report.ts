import mongoose, { Schema, model, models } from "mongoose";

export interface IReport {
  _id: mongoose.Types.ObjectId | string;
  userId: mongoose.Types.ObjectId | string;
  fullName: string;
  gender: string;
  dob: string; // YYYY-MM-DD
  birthTime: string; // HH:MM
  birthPlace: string;
  generatedReport: Record<string, any>; // Complex structured JSON representing planetary analysis
  createdAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, "Full Name is required"],
      trim: true,
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["Male", "Female", "Other"],
    },
    dob: {
      type: String,
      required: [true, "Date of Birth is required"],
    },
    birthTime: {
      type: String,
      required: [true, "Time of Birth is required"],
    },
    birthPlace: {
      type: String,
      required: [true, "Place of Birth is required"],
      trim: true,
    },
    generatedReport: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Report = models.Report || model<IReport>("Report", ReportSchema);

export default Report;
