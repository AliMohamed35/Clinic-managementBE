import { Router } from "express";
import * as userService from "./user.service.ts";
import {
  userSchema,
  userIdSchema,
  validate,
} from "../../middlewares/validation/joi.ts";
const router = Router();

router.get("/", userService.getAllusers);
router.get("/:id", userService.getUserById);
router.post("/register", validate(userSchema, "body"), userService.register);
router.put("/:id", userService.updateAllUser);
router.patch("/:id", userService.updateUserPartially);
router.delete("/:id", validate(userIdSchema, "params"), userService.deleteUser);

export default router;
