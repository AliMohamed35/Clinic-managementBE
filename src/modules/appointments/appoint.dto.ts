import { AppStatus } from "../../DB/models/Appointment.model.ts";

export interface AppointmentsDTO {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_date: string;
  appointment_time: string;
  status: AppStatus;
}

export interface CreateAppointmentData {
  patient_id: number;
  doctor_id: number;
  appointment_date: string;
  appointment_time: string;
  status: AppStatus;
}

export interface UpdateAppointmentDTO {
  doctor_id?: number;
  appointment_date?: string;
  appointment_time?: string;
  status?: AppStatus;
}
