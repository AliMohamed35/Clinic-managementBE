// user.controller.ts - Should be like this:
import type { Request, Response, NextFunction } from "express";
import { userService } from "./user.service.ts";

// Helper function to safely parse ID from request params
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
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.register(req.body);
      return res.status(201).json({
        success: true,
        message: "User created successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

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

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const user = await userService.logout(email);
      res.clearCookie("token");

      return res.status(202).json({
        success: true,
        message: "Logout successful",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = req.body;
      const verifiedUser = await userService.verifyUser(email, otp);

      return res.status(200).json({
        message: "User verified successfully",
        success: true,
        verifiedUser,
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

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseId(req.params.id);
      const userData = req.body;
      const updatedUser = await userService.updateUser(id, userData);

      return res.status(200).json({
        message: "User updated succefully",
        success: true,
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseId(req.params.id);
      await userService.deleteUser(id);

      return res
        .status(200)
        .json({ message: "User deleted successfully", success: true });
    } catch (error) {
      next(error);
    }
  }

  async softDeleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseId(req.params.id);
      await userService.softDeleteUser(id);

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

      return res.status(302).json({
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

      return res.status(302).json({
        success: true,
        message: "Users retrieved successfully",
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, currentPassword, newPassword } = req.body;

      const changed = await userService.changePassword(
        email,
        currentPassword,
        newPassword,
      );

      return res
        .status(201)
        .json({
          message: "Password changed successfully!",
          success: true,
          data: changed,
        });
    } catch (error) {
      next(error);
    }
  }
}

// Export singleton instance
export const userController = new UserController();
