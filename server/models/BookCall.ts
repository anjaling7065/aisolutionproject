import mongoose, { Schema, Document } from "mongoose";

export interface IBookCall extends Document {
  userId?: string;
  fullName: string;
  company: string;
  email: string;
  bottleneck: string;
  status: "Pending" | "Contacted" | "Meeting Scheduled" | "Completed" | "Cancelled" | "Rejected";
  consultant?: string;
  meetingDate?: Date;
  createdAt: Date;
}

const BookCallSchema: Schema = new Schema({
  userId: { type: String },
  fullName: { type: String, required: true },
  company: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  bottleneck: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["Pending", "Contacted", "Meeting Scheduled", "Completed", "Cancelled", "Rejected"], 
    default: "Pending" 
  },
  consultant: { type: String, default: "Unassigned" },
  meetingDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.BookCall || mongoose.model<IBookCall>("BookCall", BookCallSchema);
