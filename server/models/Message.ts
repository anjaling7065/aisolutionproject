import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  userId: string; // The chat thread owner (user ID)
  senderId: string; // The specific sender (user ID or admin ID)
  senderName: string;
  senderRole: "user" | "admin";
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema = new Schema({
  userId: { type: String, required: true },
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  senderRole: { type: String, enum: ["user", "admin"], required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
