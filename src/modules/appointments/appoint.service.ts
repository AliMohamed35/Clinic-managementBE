import {
  AppNotFoundError,
  AppointmentAlreadyExistError,
  DoctorNotFoundError,
  PastDateTimeError,
  UserNotFoundError,
} from "../../ExceptionHandler/customErrors.ts";
import { checkOwnership } from "../../utils/authorization.ts";
import logger from "../../utils/logs/logger.ts";
import { userRepository } from "../user/user.repository.ts";
import { doctorRepository } from "../doctors/doctor.repository.ts";
import { patientRepository } from "../patients/patient.repository.ts";
import type {
  AppointmentsDTO,
  CreateAppointmentData,
  UpdateAppointmentDTO,
} from "./appoint.dto.ts";
import { appointmentRepository } from "./appoint.repository.ts";
import type { AppointmentAttributes } from "../../DB/models/Appointment.model.ts";

export class AppointmentsService {
  async addAppointment(id: number, appData: AppointmentsDTO) {
    this.validateAppointmentDateTime(
      appData.appointment_date,
      appData.appointment_time,
    );
    // check user existence (the patient making the appointment)
    const existingUser = await userRepository.findById(id);
    if (!existingUser) {
      throw new UserNotFoundError();
    }
    
    // Get the patient record for this user
    const patientRecord = await patientRepository.findByUserId(id);
    if (!patientRecord) {
      throw new UserNotFoundError();
    }
    
    // check if the selected doctor exists (doctor_id in request is the doctor table's id)
    const doctorRecord = await doctorRepository.findById(appData.doctor_id);
    if (!doctorRecord) {
      throw new DoctorNotFoundError();
    }
    
    // Verify the doctor's user account has doctor role
    const doctorUser = await userRepository.findById(doctorRecord.user_id);
    if (!doctorUser || doctorUser.role !== "doctor") {
      throw new DoctorNotFoundError();
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
      patient_id: patientRecord.id,  // Use patient table's id, not user id
      doctor_id: appData.doctor_id,  // This is already the doctor table's id
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

    if (!appointment) {
      throw new AppNotFoundError();
    }

    return appointment;
  }

  async deleteAppointmentById(id: number, userId: number) {
    const existingAppointment = await appointmentRepository.findById(id);

    if (!existingAppointment) {
      throw new AppNotFoundError();
    }

    // Get the patient record to verify ownership
    const patientRecord = await patientRepository.findById(existingAppointment.patient_id);
    if (!patientRecord) {
      throw new AppNotFoundError();
    }

    checkOwnership(patientRecord.user_id, userId, "You can only delete your own appointments");

    await appointmentRepository.deleteById(id);
  }

  async updateAppointment(id: number, userId: number, appData: UpdateAppointmentDTO) {
    const existingAppointment = await appointmentRepository.findById(id);

    if (!existingAppointment) {
      throw new AppNotFoundError();
    }

    // Get the patient record to verify ownership
    const patientRecord = await patientRepository.findById(existingAppointment.patient_id);
    if (!patientRecord) {
      throw new AppNotFoundError();
    }

    const appointmentDate =
      appData.appointment_date ?? existingAppointment.appointment_date;
    const appointmentTime =
      appData.appointment_time ?? existingAppointment.appointment_time;
    this.validateAppointmentDateTime(appointmentDate, appointmentTime);

    const appointmentData: Record<string, unknown> = {
      ...(appData.doctor_id && { doctor_id: appData.doctor_id }),
      ...(appData.appointment_date && {
        appointment_date: appData.appointment_date,
      }),
      ...(appData.appointment_time && {
        appointment_time: appData.appointment_time,
      }),
      ...(appData.status && { status: appData.status }),
    };

    checkOwnership(patientRecord.user_id, userId, "You can only update your own appointments");

    await appointmentRepository.updateById(id, appointmentData);

    const updatedAppointment = await appointmentRepository.findById(id);

    return this.toResponseDTO(updatedAppointment!);
  }

  private toResponseDTO(appointments: AppointmentAttributes): AppointmentsDTO {
    return {
      id: appointments.id,
      patient_id: appointments.patient_id,
      doctor_id: appointments.doctor_id,
      appointment_date: appointments.appointment_date,
      appointment_time: appointments.appointment_time,
      status: appointments.status,
    };
  }

  private validateAppointmentDateTime(date: string, time: string): void {
    const appointmentDateTime = new Date(`${date}T${time}`);
    const now = new Date();

    if (isNaN(appointmentDateTime.getTime())) {
      throw new Error("Invalid Date and Time format");
    }

    if (appointmentDateTime.getTime() <= now.getTime()) {
      throw new PastDateTimeError();
    }
  }
}

export const appointmentsService = new AppointmentsService();
