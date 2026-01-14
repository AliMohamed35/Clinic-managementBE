import type { Request, Response, NextFunction } from "express";
import { appointmentService } from "./appoint.service.ts";
import type { CreateAppointmentDTO } from "./appoint.dto.ts";

export class AppointmentController {
  async createAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.params.id ?? '', 10);
      if (isNaN(userId)) {
        return res.status(400).json({
          message: "Invalid user ID!",
          success: false,
        });
      }

      const { doctor_id, appointment_date, appointment_time, status } = req.body;

      const appointmentData: CreateAppointmentDTO = {
        doctor_id: Number(doctor_id),
        appointment_date,
        appointment_time,
        status: status || undefined,
      };

      const created = await appointmentService.createAppointment(
        userId,
        appointmentData
      );

      return res.status(201).json({
        message: "Appointment created successfully!",
        success: true,
        data: created,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const appointmentController = new AppointmentController();
