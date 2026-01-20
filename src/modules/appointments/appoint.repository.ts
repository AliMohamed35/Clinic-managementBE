import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../DB/connection.ts";
import type { CreateAppointmentData } from "./appoint.dto.ts";
import type { Appointments } from "./appoint.types.ts";

export class AppointmentRepository {
  async findById(id: number): Promise<Appointments | null> {
    const [result] = await db.query<Appointments[]>(
      "SELECT * FROM appointments WHERE id = ?",
      [id],
    );

    return result[0] ?? null;
  }

  async findConflictingAppointment(
    doctor_id: number,
    appointment_date: string,
    appointment_time: string,
  ): Promise<Appointments | null> {
    const [result] = await db.query<Appointments[]>(
      "SELECT * FROM appointments WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ?",
      [doctor_id, appointment_date, appointment_time],
    );

    return result[0] ?? null;
  }

  async create(appData: CreateAppointmentData): Promise<number> {
    const [result] = await db.execute<ResultSetHeader>(
      "INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?)",
      [
        appData.patient_id,
        appData.doctor_id,
        appData.appointment_date,
        appData.appointment_time,
        appData.status,
      ],
    );

    return result.insertId;
  }

  async findAll(): Promise<Appointments[]>{
    const [result] = await db.query<Appointments[]>("SELECT * FROM appointments");
    return result;
  }
}

export const appointmentRepository = new AppointmentRepository();
