import { Op } from "sequelize";
import { Appointment } from "../../DB/models/index.ts";
import type { AppointmentAttributes } from "../../DB/models/Appointment.model.ts";
import type { CreateAppointmentData } from "./appoint.dto.ts";

export class AppointmentRepository {
  async findById(id: number): Promise<AppointmentAttributes | null> {
    const appointment = await Appointment.findByPk(id);
    return appointment ? appointment.get({ plain: true }) : null;
  }

  async findConflictingAppointment(
    doctor_id: number,
    appointment_date: string,
    appointment_time: string,
  ): Promise<AppointmentAttributes | null> {
    const appointment = await Appointment.findOne({
      where: {
        doctor_id,
        appointment_date,
        appointment_time,
      },
    });
    return appointment ? appointment.get({ plain: true }) : null;
  }

  async create(appData: CreateAppointmentData): Promise<number> {
    const appointment = await Appointment.create({
      patient_id: appData.patient_id,
      doctor_id: appData.doctor_id,
      appointment_date: appData.appointment_date,
      appointment_time: appData.appointment_time,
      status: appData.status,
    });
    return appointment.id;
  }

  async findAll(): Promise<AppointmentAttributes[]> {
    const appointments = await Appointment.findAll();
    return appointments.map((app) => app.get({ plain: true }));
  }

  async deleteById(id: number): Promise<void> {
    await Appointment.destroy({
      where: { id },
    });
  }

  async updateById(
    id: number,
    data: Record<string, unknown>
  ): Promise<boolean> {
    const [affectedRows] = await Appointment.update(data, {
      where: { id },
    });
    return affectedRows > 0;
  }
}

export const appointmentRepository = new AppointmentRepository();
