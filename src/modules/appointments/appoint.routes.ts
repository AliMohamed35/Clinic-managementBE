import { Router } from "express";
import { appointmentsController } from "./appoint.controller.ts";
import { userIdSchema } from "../../middlewares/validation/joi.ts";
import { auth } from "../../middlewares/auth/auth.middleware.ts";
import { validate } from "../../middlewares/validation/joi.ts";

const router = Router();

router.post(
  "/add-appointment/:id",
  auth,
  validate(userIdSchema, "params"),
  appointmentsController.createNewAppointment.bind(appointmentsController),
);

// get all appointments
router.get("/", auth, appointmentsController.getAllAppoints.bind(appointmentsController));
router.get("/:id", auth, appointmentsController.getById.bind(appointmentsController));

export default router;
