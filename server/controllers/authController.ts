import { Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Users } from "../config/db";
import { AuthenticatedRequest } from "../middleware/auth";

const JWT_SECRET = process.env.JWT_SECRET || "stellar_secret_key_quantum_2099";

const generateToken = (id: string) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "30d" });
};

export async function registerUser(req: AuthenticatedRequest, res: Response) {
  try {
    const { fullName, email, password, company, avatar } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "Please enter all required fields" });
    }

    const userExists = await Users.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ error: "User already exists with that email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await Users.insertOne({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "user",
      company: company || "",
      avatar: avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    });

    res.status(201).json({
      token: generateToken(user.id!),
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        company: user.company,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Register Error:", error);
    res.status(500).json({ error: "Internal Server Error during registration" });
  }
}

export async function loginUser(req: AuthenticatedRequest, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please enter all required fields" });
    }

    const user = await Users.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({
      token: generateToken(user.id!),
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        company: user.company,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal Server Error during login" });
  }
}

export async function getUserProfile(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: req.user.id,
      fullName: req.user.fullName,
      email: req.user.email,
      role: req.user.role,
      company: req.user.company,
      avatar: req.user.avatar,
      createdAt: req.user.createdAt,
    });
  } catch (error: any) {
    console.error("Profile Fetch Error:", error);
    res.status(500).json({ error: "Internal Server Error fetching profile" });
  }
}

export async function updateUserProfile(req: AuthenticatedRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { fullName, company, email, avatar, password } = req.body;

    const updatedData: any = {};
    if (fullName) updatedData.fullName = fullName;
    if (company !== undefined) updatedData.company = company;
    if (avatar) updatedData.avatar = avatar;

    if (email && email.toLowerCase() !== req.user.email) {
      const emailExists = await Users.findOne({ email: email.toLowerCase() });
      if (emailExists) {
        return res.status(400).json({ error: "Email is already in use" });
      }
      updatedData.email = email.toLowerCase();
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await Users.updateOne({ id: req.user.id }, updatedData);

    if (!updatedUser) {
      return res.status(400).json({ error: "Update failed" });
    }

    res.json({
      id: updatedUser.id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      role: updatedUser.role,
      company: updatedUser.company,
      avatar: updatedUser.avatar,
      createdAt: updatedUser.createdAt,
    });
  } catch (error: any) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ error: "Internal Server Error updating profile" });
  }
}
