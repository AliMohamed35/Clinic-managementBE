import joi from "joi";

import type { Request, Response, NextFunction } from "express";
import type { ObjectSchema } from "joi";

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

  password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{8,15}$")),

  email: joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),

  role: joi.string().valid("doctor", "patient").required(),

  isActive: joi.number().valid(0, 1).default(0),

  isDeleted: joi.number().valid(0, 1).default(0),

  isVerified: joi.number().valid(true, false).default(false),
});
