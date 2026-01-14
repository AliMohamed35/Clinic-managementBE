import type { ResultSetHeader, RowDataPacket } from "mysql2";
import type { CreateAppointmentData } from "./appoint.dto.ts";
import { db } from "../../DB/connection.ts";
import type { Appointment } from "./appoint.types.ts";

export class AppointmentRepository {
  async findById(id: number): Promise<Appointment | null> {
    const [result] = await db.query<Appointment[]>(
      "SELECT * FROM appointments WHERE id = ?",
      [id]
    );
    return result[0] ?? null;
  }

  async create(appointmentData: CreateAppointmentData): Promise<number> {
    const [result] = await db.execute<ResultSetHeader>(
      "INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status) VALUES (?,?,?,?,?)",
      [
        appointmentData.patient_id,
        appointmentData.doctor_id,
        appointmentData.appointment_date,
        appointmentData.appointment_time,
        appointmentData.status,
      ]
    );

    return result.insertId;
  }

  async delete(id: number): Promise<void> {
    const [result] = await db.query<ResultSetHeader>(
      "DELETE FROM appointments WHERE id = ?",
      [id]
    );
  }

  async findByDoctorDateTime(
    doctorId: number,
    date: string,
    time: string
  ): Promise<Appointment | null> {
    const [result] = await db.query<Appointment[]>(
      "SELECT * FROM appointments WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ?",
      [doctorId, date, time]
    );
    return result[0] ?? null;
  }
}

export const appointmentRepository = new AppointmentRepository();
