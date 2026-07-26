import { Router } from "express";
import { protect, admin } from "../middleware/auth";
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile 
} from "../controllers/authController";
import { 
  getMyBookings, 
  createBooking, 
  updateBooking, 
  deleteBooking 
} from "../controllers/bookingController";
import { 
  getMyChats, 
  submitChatMessage, 
  clearMyChats 
} from "../controllers/chatController";
import {
  getMyMessages,
  submitUserMessage,
  getAdminMessages,
  submitAdminReply
} from "../controllers/messageController";
import { 
  getAllUsers, 
  deleteUser, 
  getAdminAnalytics,
  getSystemNotifications,
  markNotificationsRead
} from "../controllers/adminController";

const router = Router();

// =========================================
// AUTHENTICATION ROUTES
// =========================================
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

// =========================================
// BOOKING / STRATEGY CALL ROUTES
// =========================================
router.get("/bookings", protect, getMyBookings);
router.post("/bookings", (req, res, next) => {
  // Make auth optional for bookings so anonymous leads can book calls from the landing page
  if (req.headers.authorization) {
    return protect(req, res, next);
  }
  next();
}, createBooking);
router.put("/bookings/:id", protect, updateBooking);
router.delete("/bookings/:id", protect, deleteBooking);

// =========================================
// AI ASSISTANT CHAT ROUTES
// =========================================
router.get("/chats", protect, getMyChats);
router.post("/chats", protect, submitChatMessage);
router.delete("/chats", protect, clearMyChats);

// =========================================
// DIRECT SUPPORT / INTERNAL MESSAGE ROUTES
// =========================================
router.get("/messages", protect, getMyMessages);
router.post("/messages", protect, submitUserMessage);
router.get("/admin/messages", protect, admin, getAdminMessages);
router.post("/admin/messages", protect, admin, submitAdminReply);

// =========================================
// ADMIN CONTROL PANEL ROUTES
// =========================================
router.get("/admin/users", protect, admin, getAllUsers);
router.get("/admin/bookings", protect, admin, getMyBookings);
router.put("/admin/status/:id", protect, admin, updateBooking);
router.delete("/admin/users/:id", protect, admin, deleteUser);
router.get("/api/admin/bookings/:id", protect, admin, updateBooking); // Alias just in case
router.delete("/admin/bookings/:id", protect, admin, deleteBooking);
router.get("/admin/analytics", protect, admin, getAdminAnalytics);
router.get("/admin/notifications", protect, admin, getSystemNotifications);
router.post("/admin/notifications/read", protect, admin, markNotificationsRead);

export default router;
