import type { AppStatus } from "./appoint.types.ts";

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

// export interface CreateAppointmentData {
//   patient_id: number;
//   doctor_id: number;
//   appointment_date: string;
//   appointment_time: string;
//   status: AppStatus;
// }
