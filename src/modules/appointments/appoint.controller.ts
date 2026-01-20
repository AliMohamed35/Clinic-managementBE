import type { Request, Response, NextFunction } from "express";
import type { AppointmentsDTO } from "./appoint.dto.ts";
import { appointmentsService } from "./appoint.service.ts";
import { parseId } from "../../utils/parse/parseId.ts";

export class AppointmentsController {
  async createNewAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const appointmentData: AppointmentsDTO = req.body;

      const createdApp = await appointmentsService.addAppointment(
        parseId(id),
        appointmentData,
      );

      return res.status(201).json({
        success: true,
        message: "Appointment created successfully",
        data: createdApp,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllAppoints(req: Request, res: Response, next: NextFunction) {
    try {
      const retrievedAppoints = await appointmentsService.getAllAppointments();
      return res.status(200).json({
        message: "All appointments retrieved successfully",
        success: true,
        data: retrievedAppoints,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const appointment = await appointmentsService.getById(parseId(id));

      return res.status(200).json({message: "Appointments retrieved Successfully", success: true, data: appointment});
    } catch (error) {
      next(error);
    }
  }
}

export const appointmentsController = new AppointmentsController();
