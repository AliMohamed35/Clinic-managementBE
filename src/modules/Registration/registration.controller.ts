import type { Request, Response, NextFunction } from "express";
import { registrationService } from "./Registration.service.ts";

export class RegistrationController {
  
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = req.body;
      const createdUser = await registrationService.register(userData);
      
      return res.status(201).json({
        message: "User registered successfully",
        success: true,
        data: createdUser,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const registrationController = new RegistrationController();
