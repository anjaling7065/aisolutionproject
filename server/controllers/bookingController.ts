import { Response } from "express";
import { BookCalls, Notifications } from "../config/db";
import { AuthenticatedRequest } from "../middleware/auth";

export async function getMyBookings(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Admins get everything, normal users get only their own
    let bookings;
    if (req.user.role === "admin") {
      bookings = await BookCalls.find();
    } else {
      // Find matches where email matches or userId matches
      const allBookings = await BookCalls.find();
      bookings = allBookings.filter(b => b.userId === req.user!.id || b.email.toLowerCase() === req.user!.email.toLowerCase());
    }

    res.json(bookings);
  } catch (error: any) {
    console.error("Fetch Bookings Error:", error);
    res.status(500).json({ error: "Internal Server Error fetching bookings" });
  }
}

export async function createBooking(req: AuthenticatedRequest, res: Response) {
  try {
    const { fullName, company, email, bottleneck } = req.body;

    if (!fullName || !company || !email || !bottleneck) {
      return res.status(400).json({ error: "Please enter all required fields" });
    }

    const userId = req.user ? req.user.id : undefined;

    const newBooking = await BookCalls.insertOne({
      userId,
      fullName,
      company,
      email: email.toLowerCase(),
      bottleneck,
      status: "Pending",
      consultant: "Unassigned",
    });

    // Notify any administrators or system
    await Notifications.insertOne({
      userId: "admin", // system-wide notifications
      title: "New Strategy Call Booked",
      message: `${fullName} from ${company} booked an audit for: "${bottleneck}".`,
      read: false,
    });

    res.status(201).json(newBooking);
  } catch (error: any) {
    console.error("Create Booking Error:", error);
    res.status(500).json({ error: "Internal Server Error creating booking" });
  }
}

export async function updateBooking(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { status, consultant } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const booking = await BookCalls.findOne({ id });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Non-admins can only cancel/modify their own bookings
    if (req.user.role !== "admin" && booking.userId !== req.user.id && booking.email.toLowerCase() !== req.user.email.toLowerCase()) {
      return res.status(403).json({ error: "Forbidden: You do not own this booking" });
    }

    const updateFields: any = {};
    if (status) updateFields.status = status;
    if (consultant) updateFields.consultant = consultant;

    const updated = await BookCalls.updateOne({ id }, updateFields);

    // If canceled by normal user, notify Admin
    if (status === "Rejected" && req.user.role !== "admin") {
      await Notifications.insertOne({
        userId: "admin",
        title: "Booking Canceled",
        message: `${booking.fullName} from ${booking.company} canceled their Strategy Call.`,
        read: false,
      });
    }

    res.json(updated);
  } catch (error: any) {
    console.error("Update Booking Error:", error);
    res.status(500).json({ error: "Internal Server Error updating booking" });
  }
}

export async function deleteBooking(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const booking = await BookCalls.findOne({ id });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Only admin can delete entirely, users can update status to Rejected or Cancelled
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Only admins can delete bookings" });
    }

    await BookCalls.deleteOne({ id });
    res.json({ success: true, message: "Booking removed successfully" });
  } catch (error: any) {
    console.error("Delete Booking Error:", error);
    res.status(500).json({ error: "Internal Server Error deleting booking" });
  }
}
