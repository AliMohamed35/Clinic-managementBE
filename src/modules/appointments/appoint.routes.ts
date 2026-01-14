import { Router } from "express";
import {
  appointmentController,
} from "./appoint.controller.ts";
import { appointmentSchema, validate } from "../../middlewares/validation/joi.ts";

const router = Router();

router.post(
  "/add-appointment/:id", validate(appointmentSchema, "body"),
  appointmentController.createAppointment.bind(appointmentController)
);

export default router;