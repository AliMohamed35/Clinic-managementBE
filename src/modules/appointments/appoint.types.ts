import type { RowDataPacket } from "mysql2";

export enum AppStatus{
    PENDING = "Pending",
    COMPLETED = "Completed"
}

export interface Appointments extends RowDataPacket{
    id: number,
    patient_id: number,
    doctor_id: number,
    appointment_date: string,
    appointment_time: string,
    status: AppStatus
}
