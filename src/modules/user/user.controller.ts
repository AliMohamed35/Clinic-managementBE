import type { Request, Response, NextFunction } from "express";
import { userService } from "./user.service.ts";
import type { AuthRequest } from "../../middlewares/auth/auth.middleware.ts";

function parseId(id: string | undefined): number {
  if (id === undefined) {
    throw new Error("ID parameter is required");
  }
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) {
    throw new Error("ID must be a valid number");
  }
  return parsedId;
}

export class UserController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const { user, token } = await userService.login(email, password);

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3 * 24 * 60 * 60 * 1000,
      });

      return res.status(202).json({
        success: true,
        message: "Login successful",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      await userService.logout(email, req.user!.id);
      res.clearCookie("token");

      return res.status(202).json({
        success: true,
        message: "Logout successful",
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = req.body;
      await userService.verifyUser(email, otp);

      return res.status(200).json({
        message: "User verified successfully",
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async resendOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const sentOTP = await userService.resendOTP(email);

      return res.status(200).json({
        message: "OTP resent successfully",
        success: true,
        data: sentOTP,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseId(req.params.id);
      const userData = req.body;
      const updatedUser = await userService.updateUser(id, userData, req.user!.id);

      return res.status(200).json({
        message: "User updated successfully",
        success: true,
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseId(req.params.id);
      await userService.deleteUser(id, req.user!.id);

      return res
        .status(200)
        .json({ message: "User deleted successfully", success: true });
    } catch (error) {
      next(error);
    }
  }

  async softDeleteUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = parseId(req.params.id);
      await userService.softDeleteUser(id, req.user!.id);

      return res
        .status(200)
        .json({ message: "User soft deleted successfully", success: true });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseId(req.params.id);
      const user = await userService.getUserById(id);

      return res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAllUsers();

      return res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { email, currentPassword, newPassword } = req.body;

      const changed = await userService.changePassword(
        email,
        currentPassword,
        newPassword,
        req.user!.id
      );

      return res.status(201).json({
        message: "Password changed successfully!",
        success: true,
        data: changed,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
