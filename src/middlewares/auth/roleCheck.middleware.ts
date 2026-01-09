import type { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role; // Assuming auth middleware sets req.user

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions." });
    }

    next();
  };
};
