import { Doctor } from "../../DB/models/index.ts";
import type { DoctorAttributes } from "../../DB/models/Doctor.model.ts";

export interface DoctorData extends DoctorAttributes {}

export class DoctorRepository {
  async create(userId: number, medicalFieldId?: number | null): Promise<number> {
    const doctor = await Doctor.create({
      user_id: userId,
      medical_field_id: medicalFieldId ?? null,
    });
    return doctor.id;
  }

  async findByUserId(userId: number): Promise<DoctorData | null> {
    const doctor = await Doctor.findOne({ where: { user_id: userId } });
    return doctor ? doctor.get({ plain: true }) : null;
  }

  async findById(id: number): Promise<DoctorData | null> {
    const doctor = await Doctor.findByPk(id);
    return doctor ? doctor.get({ plain: true }) : null;
  }

  async updateById(id: number, data: Record<string, unknown>): Promise<boolean> {
    const [affectedRows] = await Doctor.update(data, {
      where: { id },
    });
    return affectedRows > 0;
  }

  async deleteByUserId(userId: number): Promise<boolean> {
    const deletedCount = await Doctor.destroy({
      where: { user_id: userId },
    });
    return deletedCount > 0;
  }
}

export const doctorRepository = new DoctorRepository();
