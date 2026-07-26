import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password?: string;
  company?: string;
  avatar?: string;
  phone?: string;
  role: "user" | "admin";
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  company: { type: String, default: "" },
  avatar: { type: String, default: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80" },
  phone: { type: String, default: "" },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
