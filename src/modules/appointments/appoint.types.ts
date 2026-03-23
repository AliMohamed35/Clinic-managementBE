export enum AppStatus {
  PENDING = "Pending",
  COMPLETED = "Completed",
}

export interface Appointments {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_date: string;
  appointment_time: string;
  status: AppStatus;
}
