import type { Request, Response, NextFunction } from "express";
import {
  UserNotFoundError,
  UserExistsError,
  InvalidCredentialsError,
  UserNotVerifiedError,
  UserAlreadyVerifiedError,
  OTPNotFoundError,
  InvalidOTPError,
  OTPExpiredError,
  AppointmentAlreadyExistError,
  UserAlreadySoftDeletedError,
} from "./customErrors.ts";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[ERROR] ${error.name}: ${error.message}`);

  // Handle known errors
  if (error instanceof UserNotFoundError) {
    return res.status(404).json({ success: false, message: error.message });
  }

  if (error instanceof UserExistsError) {
    return res.status(409).json({ success: false, message: error.message });
  }

  if (error instanceof InvalidCredentialsError) {
    return res.status(401).json({ success: false, message: error.message });
  }

  if (error instanceof UserNotVerifiedError) {
    return res.status(401).json({ success: false, message: error.message });
  }
  if (error instanceof UserAlreadyVerifiedError) {
    return res.status(400).json({ success: false, message: error.message });
  }
  if (error instanceof OTPNotFoundError) {
    return res.status(400).json({ success: false, message: error.message });
  }
  if (error instanceof InvalidOTPError) {
    return res.status(400).json({ success: false, message: error.message });
  }
  if (error instanceof OTPExpiredError) {
    return res.status(400).json({ success: false, message: error.message });
  }
  if (error instanceof AppointmentAlreadyExistError) {
    return res.status(400).json({ success: false, message: error.message });
  }
  if (error instanceof UserAlreadySoftDeletedError) {
    return res.status(400).json({ success: false, message: error.message });
  }

  // Unknown error
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
