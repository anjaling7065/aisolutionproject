import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Users, User } from "../config/db";

const JWT_SECRET = process.env.JWT_SECRET || "stellar_secret_key_quantum_2099";

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export async function protect(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

      const user = await Users.findOne({ id: decoded.id });
      if (!user) {
        return res.status(401).json({ error: "Not authorized, user not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("JWT Verification error:", error);
      return res.status(401).json({ error: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ error: "Not authorized, no token provided" });
  }
}

export function admin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Not authorized as an administrator" });
  }
}
