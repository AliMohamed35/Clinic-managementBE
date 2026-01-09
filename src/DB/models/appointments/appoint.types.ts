import type { RowDataPacket } from "mysql2";

export type AppointmentStatus = "pending" | "completed";

export interface Appointment extends RowDataPacket {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
}

export interface CreatedAppointmentDTO {
  doctor_id: number;
  appointment_date: string;
  appointment_time: string;
}
