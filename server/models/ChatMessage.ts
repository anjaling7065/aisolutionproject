import mongoose, { Schema, Document } from "mongoose";

export interface IChatMessage extends Document {
  userId: string;
  sender: "user" | "ai";
  content: string;
  createdAt: Date;
}

const ChatMessageSchema: Schema = new Schema({
  userId: { type: String, required: true },
  sender: { type: String, enum: ["user", "ai"], required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.ChatMessage || mongoose.model<IChatMessage>("ChatMessage", ChatMessageSchema);
