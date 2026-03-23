import { Router } from "express";
import {
    userSchema,
    validate
} from "../../middlewares/validation/joi.ts";
import { registrationController } from "./registration.controller.ts";

const router = Router();

// AUTH
router.post(
  "/register",
  validate(userSchema, "body"),
  registrationController.register.bind(registrationController),
);


export default router;
