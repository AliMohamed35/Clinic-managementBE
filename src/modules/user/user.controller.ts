import { Router } from "express";
import * as userService from './user.service.ts'
const router = Router();


router.get("/", userService.getAllusers);
router.get("/:id", userService.getUserById);
router.put("/:id", userService.updateAllUser);
router.patch("/:id", userService.updateUserPartially);
router.delete("/:id", userService.deleteUser);
router.post("/register", userService.register);

export default router;