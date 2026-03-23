import { Patient } from "../../DB/models/index.ts";
import type { PatientAttributes } from "../../DB/models/Patient.model.ts";

export interface PatientData extends PatientAttributes {}

export class PatientRepository {
  async create(userId: number, dateOfBirth?: string | null, gender?: string | null): Promise<number> {
    const patient = await Patient.create({
      user_id: userId,
      date_of_birth: dateOfBirth ?? null,
      gender: gender ?? null,
    });
    return patient.id;
  }

  async findByUserId(userId: number): Promise<PatientData | null> {
    const patient = await Patient.findOne({ where: { user_id: userId } });
    return patient ? patient.get({ plain: true }) : null;
  }

  async findById(id: number): Promise<PatientData | null> {
    const patient = await Patient.findByPk(id);
    return patient ? patient.get({ plain: true }) : null;
  }

  async updateById(id: number, data: Record<string, unknown>): Promise<boolean> {
    const [affectedRows] = await Patient.update(data, {
      where: { id },
    });
    return affectedRows > 0;
  }

  async deleteByUserId(userId: number): Promise<boolean> {
    const deletedCount = await Patient.destroy({
      where: { user_id: userId },
    });
    return deletedCount > 0;
  }
}

export const patientRepository = new PatientRepository();
