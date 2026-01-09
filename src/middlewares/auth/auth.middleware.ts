import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { RowDataPacket } from "mysql2";
import { db } from "../../DB/connection.ts";
import cookieParser from "cookie-parser";

interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

interface JwtPayload {
  id: number;
}

export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from cookies
    const token = req.cookies?.token;

    // Verify token
    const decoded = jwt.verify(token, "secretkey") as JwtPayload;

    // Get user from database
    const [users] = await db.query<RowDataPacket[]>(
      "SELECT id, role FROM users WHERE id = ?",
      [decoded.id]
    );

    if (users.length === 0) {
      return res
        .status(401)
        .json({ message: "User not found. Access denied." });
    }

    // Set user on request object
    req.user = {
      id: users[0]?.id,
      role: users[0]?.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token. Access denied." });
  }
};
