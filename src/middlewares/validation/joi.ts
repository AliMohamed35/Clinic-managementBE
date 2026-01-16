import joi from "joi";

import type { Request, Response, NextFunction } from "express";
import type { ObjectSchema } from "joi";
import { UserRoles } from "../../modules/user/user.types.ts";

export const validate =
  (schema: ObjectSchema, property: "body" | "params" | "query" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((d) => d.message),
      });
    }

    // Replace request data with validated data (includes defaults)
    req[property] = value;

    next();
  };

export const userIdSchema = joi.object({
  id: joi.number().integer().positive().required(),
});

export const userSchema = joi.object({
  // id: joi.number().integer().positive().required(),

  name: joi.string().alphanum().min(3).max(30).required(),

  password: joi
    .string()
    .min(8)
    .max(255)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      "string.min": "Password should be at least 8 characters long",
      "string.empty": "Password cannot be empty",
    }),

  email: joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),

  role: joi
    .string()
    .valid(...Object.values(UserRoles))
    .required(),

  isActive: joi.number().valid(0, 1).default(0),

  isDeleted: joi.number().valid(0, 1).default(0),

  isVerified: joi.number().valid(true, false).default(false),
});

export const appointmentSchema = joi.object({
  doctorId: joi.number().required(),
  appointment_date: joi.string(),
  appointment_time: joi.string(),
});
