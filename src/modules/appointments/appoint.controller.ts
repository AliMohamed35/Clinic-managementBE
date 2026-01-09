import { Router } from "express";
import * as appointService from "../appointments/appoint.service.ts";
import { authorizeRoles } from "../../middlewares/auth/roleCheck.middleware.ts";
import { auth } from "../../middlewares/auth/auth.middleware.ts";
import { appointment, userSchema, validate } from "../../middlewares/validation/joi.ts";

const router = Router();

router.post(
  "/add-appointment/:patientId",
  auth,
  authorizeRoles("patient"), // only patients can register
  appointService.addAppointment
);

router.get("/", auth, appointService.getAllAppointments);

// router.get(
//   "/get-all-appointments",
//   auth,
//   authorizeRoles("patient"), // only patients can register
//   appointService.addAppointment
// );

export default router;
