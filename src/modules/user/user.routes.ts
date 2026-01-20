import { Router } from "express";
import { userController } from "./user.controller.ts";
import {
  validate,
  userSchema,
  userIdSchema,
} from "../../middlewares/validation/joi.ts";
import { auth } from "../../middlewares/auth/auth.middleware.ts";

const router = Router();

// AUTH
router.post(
  "/register",
  validate(userSchema, "body"),
  userController.register.bind(userController),
);
router.post("/login", userController.login.bind(userController));
router.post("/logout", auth, userController.logout.bind(userController));
router.post("/resend-otp", userController.resendOTP.bind(userController));
router.post("/verify-otp", userController.verifyUser.bind(userController));
router.post(
  "/change-password",
  auth,
  userController.changePassword.bind(userController),
);

// update
router.put(
  "/update-user/:id",
  auth,
  validate(userIdSchema, "params"),
  userController.updateUser.bind(userController),
);

// delet
router.delete(
  "/:id",
  auth,
  validate(userIdSchema, "params"),
  userController.deleteUser.bind(userController),
);
router.delete(
  "/soft-delete/:id",
  auth,
  validate(userIdSchema, "params"),
  userController.softDeleteUser.bind(userController),
);

// Protected routes
router.get("/", auth, userController.getAllUsers.bind(userController));
router.get(
  "/:id",
  auth,
  validate(userIdSchema, "params"),
  userController.getUserById.bind(userController),
);

export default router;
