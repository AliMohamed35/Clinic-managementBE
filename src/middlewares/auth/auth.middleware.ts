import type { Request, Response, NextFunction } from "express";
import { User } from "../../DB/models/index.ts";
import { verifyToken } from "../../utils/jwt/jwt.ts";

export interface AuthRequest extends Request {
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

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token provided. Access denied." });
    }

    // Verify token using centralized utility
    const decoded = verifyToken(token) as JwtPayload;

    // Get user from database using Sequelize
    const user = await User.findByPk(decoded.id, {
      attributes: ["id", "role", "isDeleted"],
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found. Access denied." });
    }

    // Check if user is soft deleted
    if (user.isDeleted === 1) {
      return res
        .status(403)
        .json({ message: "Account has been deleted. Please contact support." });
    }

    // Set user on request object
    req.user = {
      id: user.id,
      role: user.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token. Access denied." });
  }
};
