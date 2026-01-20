import {
  AppNotFoundError,
  AppointmentAlreadyExistError,
  UserNotFoundError,
} from "../../ExceptionHandler/customErrors.ts";
import logger from "../../utils/logs/logger.ts";
import { userRepository } from "../user/user.repository.ts";
import type { AppointmentsDTO, CreateAppointmentData } from "./appoint.dto.ts";
import { appointmentRepository } from "./appoint.repository.ts";
import type { Appointments } from "./appoint.types.ts";

export class AppointmentsService {
  async addAppointment(id: number, appData: AppointmentsDTO) {
    // check user existence
    const existingUser = await userRepository.findById(id);
    if (!existingUser) {
      throw new UserNotFoundError();
    }

    // check appointment existence
    const existingAppointment =
      await appointmentRepository.findConflictingAppointment(
        appData.doctor_id,
        appData.appointment_date,
        appData.appointment_time,
      );

    if (existingAppointment) {
      throw new AppointmentAlreadyExistError();
    }

    const newAppointment: CreateAppointmentData = {
      patient_id: id,
      doctor_id: appData.doctor_id,
      appointment_date: appData.appointment_date,
      appointment_time: appData.appointment_time,
      status: appData.status,
    };

    const appId = await appointmentRepository.create(newAppointment);

    logger.info(`Created Appointment: ${appId}`);

    return {
      id: appId,
      patient_id: id,
      doctor_id: appData.doctor_id,
      appointment_date: appData.appointment_date,
      appointment_time: appData.appointment_time,
      status: appData.status,
    };
  }

  async getAllAppointments() {
    const result = await appointmentRepository.findAll();

    return result;
  }

  async getById(id: number) {
    const appointment = await appointmentRepository.findById(id);

    if(!appointment){
      throw new AppNotFoundError();
    }

    return appointment;
  }

  private toResponseDTO(appointments: Appointments): AppointmentsDTO {
    return {
      id: appointments.id,
      patient_id: appointments.patient_id,
      doctor_id: appointments.doctor_id,
      appointment_date: appointments.appointment_date,
      appointment_time: appointments.appointment_time,
      status: appointments.status,
    };
  }
}

export const appointmentsService = new AppointmentsService();
