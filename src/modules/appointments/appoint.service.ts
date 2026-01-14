import {
  AppointmentAlreadyExistError,
  UserNotFoundError,
} from "../../ExceptionHandler/customErrors.ts";
import { userRepository } from "../user/user.repository.ts";
import type {
  AppointmentResponseDTO,
  CreateAppointmentDTO,
  CreateAppointmentData,
} from "./appoint.dto.ts";
import { appointmentRepository } from "./appoint.repository.ts";
import type { Appointment } from "./appoint.types.ts";

export class AppointmentService {
  async createAppointment(
    id: number,
    appointmentData: CreateAppointmentDTO
  ): Promise<AppointmentResponseDTO> {
    // check user Existence
    const existingUser = await userRepository.findById(id);
    if (!existingUser) {
      throw new UserNotFoundError();
    }

    // check appoint existence
    const existingAppointment =
      await appointmentRepository.findByDoctorDateTime(
        appointmentData.doctor_id,
        appointmentData.appointment_date,
        appointmentData.appointment_time
      );

    if (existingAppointment) {
      throw new AppointmentAlreadyExistError();
    }

    // Prepare data for repository
    const createData: CreateAppointmentData = {
      patient_id: id,
      doctor_id: appointmentData.doctor_id,
      appointment_date: appointmentData.appointment_date,
      appointment_time: appointmentData.appointment_time,
      status: appointmentData.status || "Pending",
    };

    const appointmentId = await appointmentRepository.create(createData);
    
    return this.toResponseDTO({
      id: appointmentId,
      ...createData,
    } as Appointment);
  }

  private toResponseDTO(appointment: Appointment): AppointmentResponseDTO {
    return {
      id: appointment.id,
      patient_id: appointment.patient_id,
      doctor_id: appointment.doctor_id,
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time,
      status: appointment.status,
    };
  }
}

export const appointmentService = new AppointmentService();
