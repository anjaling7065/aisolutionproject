import { Response } from "express";
import { Users, BookCalls, Chats, Notifications } from "../config/db";
import { AuthenticatedRequest } from "../middleware/auth";

export async function getAllUsers(req: AuthenticatedRequest, res: Response) {
  try {
    const allUsers = await Users.find();
    // Exclude password field from response
    const safeUsers = allUsers.map(user => {
      const { password, ...safeUser } = user;
      return safeUser;
    });
    res.json(safeUsers);
  } catch (error: any) {
    console.error("Get Users Error:", error);
    res.status(500).json({ error: "Internal Server Error fetching users list" });
  }
}

export async function deleteUser(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;

    const user = await Users.findOne({ id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ error: "Protected account: Cannot delete administrators" });
    }

    await Users.deleteOne({ id });
    res.json({ success: true, message: "User account purged successfully." });
  } catch (error: any) {
    console.error("Delete User Error:", error);
    res.status(500).json({ error: "Internal Server Error purging user" });
  }
}

export async function getAdminAnalytics(req: AuthenticatedRequest, res: Response) {
  try {
    const users = await Users.find();
    const bookings = await BookCalls.find();
    const chats = await Chats.find();

    // Group bottlenecks
    const bottleneckCounts: Record<string, number> = {};
    bookings.forEach(b => {
      const key = b.bottleneck || "Other";
      bottleneckCounts[key] = (bottleneckCounts[key] || 0) + 1;
    });

    res.json({
      totalUsers: users.length,
      totalBookings: bookings.length,
      totalChats: chats.length,
      pendingCalls: bookings.filter(b => b.status === "Pending").length,
      completedCalls: bookings.filter(b => b.status === "Completed").length,
      bottleneckStats: bottleneckCounts,
    });
  } catch (error: any) {
    console.error("Fetch Analytics Error:", error);
    res.status(500).json({ error: "Internal Server Error compiling statistics" });
  }
}

export async function getSystemNotifications(req: AuthenticatedRequest, res: Response) {
  try {
    const notifications = await Notifications.find();
    res.json(notifications);
  } catch (error: any) {
    console.error("Fetch Notifications Error:", error);
    res.status(500).json({ error: "Internal Server Error compiling notifications" });
  }
}

export async function markNotificationsRead(req: AuthenticatedRequest, res: Response) {
  try {
    const notifications = await Notifications.find();
    for (const notif of notifications) {
      await Notifications.updateOne({ id: notif.id }, { read: true });
    }
    res.json({ success: true });
  } catch (error: any) {
    console.error("Mark Read Error:", error);
    res.status(500).json({ error: "Internal Server Error marking notifications read" });
  }
}
