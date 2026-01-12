import type { Request, Response } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../DB/connection.ts";
import type { CreatedAppointmentDTO } from "../../DB/models/appointments/appoint.types.ts";

// add appointment
export const addAppointment = async (req: Request, res: Response) => {
  try {
    // get patient id from params
    const { patientId } = req.params;

    // get doctor id from body
    const { doctorId, appointment_date, appointment_time } = req.body;

    // check their existence
    const [patientResult] = await db.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE id = ?",
      [patientId]
    );

    const [doctorResult] = await db.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE id = ?",
      [doctorId]
    );

    if (patientResult.length === 0 || doctorResult.length === 0) {
      return res.status(404).json({ message: "Patient or Doctor not found" });
    }

    if (patientResult[0]?.role !== "patient") {
      return res.status(403).json({ message: "User is not a patient" });
    }

    if (doctorResult[0]?.role !== "doctor") {
      return res.status(403).json({ message: "User is not a doctor" });
    }

    const [existingAppointment] = await db.query<RowDataPacket[]>(
      "SELECT * FROM appointments WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ?",
      [doctorId, appointment_date, appointment_time]
    );

    if (existingAppointment.length > 0) {
      return res
        .status(400)
        .json({
          message: "this time is already booked please pick another time",
          success: false,
        });
    }

    await db.query<ResultSetHeader>(
      "INSERT INTO appointments ( patient_id , doctor_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?)",
      [patientId, doctorId, appointment_date, appointment_time, "pending"]
    );

    const createdAppointment: CreatedAppointmentDTO = {
      doctor_id: doctorId,
      appointment_date,
      appointment_time,
    };

    return res.status(200).json({
      message: "appointment created successfully",
      success: true,
      data: createdAppointment,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// get all appointments
export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    const [result] = await db.query<RowDataPacket[]>(
      "SELECT * FROM appointments"
    );

    return res.status(200).json({
      message: "all appointments retrieved successfully",
      data: result,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};