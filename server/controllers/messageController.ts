import { Response } from "express";
import { Messages, Notifications } from "../config/db";
import { AuthenticatedRequest } from "../middleware/auth";

// ==========================================
// CLIENT-SIDE MESSAGE ACTIONS
// ==========================================

export async function getMyMessages(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const allMessages = await Messages.find();
    // Normal users can only see messages belonging to their userId
    const userMessages = allMessages.filter(msg => msg.userId === req.user!.id);
    
    // Sort chronologically (oldest first so it reads like a direct thread)
    userMessages.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeA - timeB;
    });

    res.json(userMessages);
  } catch (error: any) {
    console.error("Get My Messages Error:", error);
    res.status(500).json({ error: "Internal Server Error compiling message thread." });
  }
}

export async function submitUserMessage(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Message content cannot be blank." });
    }

    const newMsg = await Messages.insertOne({
      userId: req.user.id!,
      senderId: req.user.id!,
      senderName: req.user.fullName,
      senderRole: "user",
      content: content.trim(),
    });

    // Notify administrators of a new incoming direct message
    await Notifications.insertOne({
      userId: "admin",
      title: "New Operator Message Received",
      message: `${req.user.fullName} sent a support/consultation query: "${content.trim().substring(0, 60)}..."`,
      read: false,
    });

    res.status(201).json(newMsg);
  } catch (error: any) {
    console.error("Submit User Message Error:", error);
    res.status(500).json({ error: "Internal Server Error transmitting your message." });
  }
}

// ==========================================
// ADMIN CONTROL PORTAL ACTIONS
// ==========================================

export async function getAdminMessages(req: AuthenticatedRequest, res: Response) {
  try {
    // Admin role is guarded in middleware, double check here
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Access Denied: Administrative Clearance Required." });
    }

    const allMessages = await Messages.find();
    // Sort chronologically (oldest first)
    allMessages.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeA - timeB;
    });

    res.json(allMessages);
  } catch (error: any) {
    console.error("Admin Fetch Messages Error:", error);
    res.status(500).json({ error: "Internal Server Error listing terminal message logs." });
  }
}

export async function submitAdminReply(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ error: "Access Denied: Administrative Clearance Required." });
    }

    const { userId, content } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "Target recipient userId must be specified." });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Message content cannot be blank." });
    }

    const newMsg = await Messages.insertOne({
      userId, // Belongs to the specific user's chat thread
      senderId: req.user.id!,
      senderName: req.user.fullName,
      senderRole: "admin",
      content: content.trim(),
    });

    // Notify the user of a new direct message from admin
    await Notifications.insertOne({
      userId,
      title: "Direct Response from Stellar AI Admin",
      message: `${req.user.fullName} replied to your transmission: "${content.trim().substring(0, 60)}..."`,
      read: false,
    });

    res.status(201).json(newMsg);
  } catch (error: any) {
    console.error("Admin Submit Message Reply Error:", error);
    res.status(500).json({ error: "Internal Server Error posting administrative response." });
  }
}
