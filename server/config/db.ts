import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Import Mongoose Models
import UserModel from "../models/User";
import BookCallModel from "../models/BookCall";
import ChatMessageModel from "../models/ChatMessage";
import NotificationModel from "../models/Notification";
import MessageModel from "../models/Message";

const DATA_DIR = path.join(process.cwd(), "server", "data");

// Ensure local data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Global MongoDB Connection State
let isMongoConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log("◆ [DB] MONGODB_URI not provided. Operating in high-fidelity LOCAL JSON storage mode.");
    return;
  }
  try {
    // Avoid double connections
    if (mongoose.connection.readyState === 1) {
      isMongoConnected = true;
      return;
    }
    await mongoose.connect(uri);
    isMongoConnected = true;
    console.log("◆ [DB] Successfully synchronized with MongoDB Atlas cluster.");
    
    // Seed default admin inside MongoDB if it doesn't exist
    await seedAdminMongo();
  } catch (err) {
    console.error("◆ [DB] MongoDB Atlas connection failed. Reverting to LOCAL JSON storage:", err);
    isMongoConnected = false;
  }
}

// Seed default administrator in MongoDB
async function seedAdminMongo() {
  try {
    const UserModel = mongoose.models.User || mongoose.model("User");
    const adminExists = await UserModel.findOne({ email: "admin@stellar.ai" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin", 10);
      await UserModel.create({
        fullName: "Stellar Administrator",
        email: "admin@stellar.ai",
        password: hashedPassword,
        role: "admin",
        company: "Stellar AI Corp",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        phone: "+1 (555) 0199",
      });
      console.log("◆ [DB] Seeded admin account in MongoDB Atlas (admin@stellar.ai / admin)");
    }
  } catch (err) {
    console.error("◆ [DB] Seed admin mongo error:", err);
  }
}

// Map collection name to its Mongoose Model
const modelMap: Record<string, any> = {
  users: UserModel,
  book_calls: BookCallModel,
  chats: ChatMessageModel,
  notifications: NotificationModel,
  messages: MessageModel,
};

// Map query helper from virtual ID/createdAt to Mongo schema standard if needed
function mapToMongoFilter(filter: any) {
  if (!filter) return {};
  const mongoFilter = { ...filter };
  if (mongoFilter.id) {
    mongoFilter._id = mongoFilter.id;
    delete mongoFilter.id;
  }
  return mongoFilter;
}

// Convert Mongoose doc back to virtual id interface
function mapFromMongoDoc<T>(doc: any): T {
  if (!doc) return doc;
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  if (obj._id) {
    obj.id = obj._id.toString();
    delete obj._id;
  }
  if (obj.__v !== undefined) {
    delete obj.__v;
  }
  if (obj.createdAt && obj.createdAt instanceof Date) {
    obj.createdAt = obj.createdAt.toISOString();
  }
  if (obj.meetingDate && obj.meetingDate instanceof Date) {
    obj.meetingDate = obj.meetingDate.toISOString();
  }
  return obj as T;
}

class Collection<T extends { id?: string; createdAt?: string }> {
  private filePath: string;
  private collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
    this.filePath = path.join(DATA_DIR, `${collectionName}.json`);
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2), "utf8");
    }
  }

  private read(): T[] {
    try {
      const data = fs.readFileSync(this.filePath, "utf8");
      return JSON.parse(data);
    } catch (e) {
      console.error(`Error reading collection ${this.filePath}`, e);
      return [];
    }
  }

  private write(data: T[]): void {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), "utf8");
    } catch (e) {
      console.error(`Error writing collection ${this.filePath}`, e);
    }
  }

  async find(filter?: Partial<T>): Promise<T[]> {
    if (isMongoConnected && modelMap[this.collectionName]) {
      try {
        const model = modelMap[this.collectionName];
        const mongoFilter = mapToMongoFilter(filter);
        const docs = await model.find(mongoFilter).sort({ createdAt: -1 });
        return docs.map((doc: any) => mapFromMongoDoc<T>(doc));
      } catch (err) {
        console.error(`MongoDB find error on ${this.collectionName}, fallback to JSON:`, err);
      }
    }

    const records = this.read();
    if (!filter) return records;
    return records.filter((rec: any) => {
      for (const key in filter) {
        if (rec[key] !== filter[key]) return false;
      }
      return true;
    });
  }

  async findOne(filter: Partial<T>): Promise<T | null> {
    if (isMongoConnected && modelMap[this.collectionName]) {
      try {
        const model = modelMap[this.collectionName];
        const mongoFilter = mapToMongoFilter(filter);
        const doc = await model.findOne(mongoFilter);
        return doc ? mapFromMongoDoc<T>(doc) : null;
      } catch (err) {
        console.error(`MongoDB findOne error on ${this.collectionName}, fallback to JSON:`, err);
      }
    }

    const records = this.read();
    const found = records.find((rec: any) => {
      for (const key in filter) {
        if (rec[key] !== filter[key]) return false;
      }
      return true;
    });
    return found || null;
  }

  async insertOne(record: Omit<T, "id" | "createdAt">): Promise<T> {
    if (isMongoConnected && modelMap[this.collectionName]) {
      try {
        const model = modelMap[this.collectionName];
        const doc = await model.create(record);
        return mapFromMongoDoc<T>(doc);
      } catch (err) {
        console.error(`MongoDB insertOne error on ${this.collectionName}, fallback to JSON:`, err);
      }
    }

    const records = this.read();
    const newRecord = {
      id: "id_" + Math.random().toString(36).substr(2, 9),
      ...record,
      createdAt: new Date().toISOString(),
    } as unknown as T;

    records.push(newRecord);
    this.write(records);
    return newRecord;
  }

  async updateOne(filter: Partial<T>, update: Partial<Omit<T, "id">>): Promise<T | null> {
    if (isMongoConnected && modelMap[this.collectionName]) {
      try {
        const model = modelMap[this.collectionName];
        const mongoFilter = mapToMongoFilter(filter);
        const doc = await model.findOneAndUpdate(mongoFilter, update, { new: true });
        return doc ? mapFromMongoDoc<T>(doc) : null;
      } catch (err) {
        console.error(`MongoDB updateOne error on ${this.collectionName}, fallback to JSON:`, err);
      }
    }

    const records = this.read();
    const index = records.findIndex((rec: any) => {
      for (const key in filter) {
        if (rec[key] !== filter[key]) return false;
      }
      return true;
    });

    if (index === -1) return null;
    records[index] = { ...records[index], ...update };
    this.write(records);
    return records[index];
  }

  async deleteOne(filter: Partial<T>): Promise<boolean> {
    if (isMongoConnected && modelMap[this.collectionName]) {
      try {
        const model = modelMap[this.collectionName];
        const mongoFilter = mapToMongoFilter(filter);
        const result = await model.deleteOne(mongoFilter);
        return result.deletedCount > 0;
      } catch (err) {
        console.error(`MongoDB deleteOne error on ${this.collectionName}, fallback to JSON:`, err);
      }
    }

    const records = this.read();
    const index = records.findIndex((rec: any) => {
      for (const key in filter) {
        if (rec[key] !== filter[key]) return false;
      }
      return true;
    });

    if (index === -1) return false;
    records.splice(index, 1);
    this.write(records);
    return true;
  }
}

// Database Entities Export Interfaces
export interface User {
  id?: string;
  fullName: string;
  email: string;
  password?: string;
  role: "user" | "admin";
  company?: string;
  avatar?: string;
  phone?: string;
  createdAt?: string;
}

export interface BookCall {
  id?: string;
  userId?: string;
  fullName: string;
  company: string;
  email: string;
  bottleneck: string;
  status: "Pending" | "Contacted" | "Meeting Scheduled" | "Completed" | "Cancelled" | "Rejected";
  consultant?: string;
  meetingDate?: string;
  createdAt?: string;
}

export interface ChatMessage {
  id?: string;
  userId: string;
  sender: "user" | "ai";
  content: string;
  createdAt?: string;
}

export interface Notification {
  id?: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt?: string;
}

export interface Message {
  id?: string;
  userId: string;
  senderId: string;
  senderName: string;
  senderRole: "user" | "admin";
  content: string;
  createdAt?: string;
}

// Initializing the collection structures
export const Users = new Collection<User>("users");
export const BookCalls = new Collection<BookCall>("book_calls");
export const Chats = new Collection<ChatMessage>("chats");
export const Notifications = new Collection<Notification>("notifications");
export const Messages = new Collection<Message>("messages");

// Seed default administrator in JSON database for local testing fallback
async function seedAdminJson() {
  const existingAdmin = await Users.findOne({ email: "admin@stellar.ai" });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin", 10);
    await Users.insertOne({
      fullName: "Stellar Administrator",
      email: "admin@stellar.ai",
      password: hashedPassword,
      role: "admin",
      company: "Stellar AI Corp",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      phone: "+1 (555) 0199",
    });
    console.log("◆ [DB] Seeded admin account in local JSON storage (admin@stellar.ai / admin)");
  }
}

seedAdminJson();
// Trigger MongoDB initialization in background safely
connectDB();
