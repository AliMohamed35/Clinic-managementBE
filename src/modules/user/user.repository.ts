import { User, Patient, Doctor, Appointment } from "../../DB/models/index.ts";
import type { UserAttributes } from "../../DB/models/User.model.ts";
import type { CreateUserData } from "./user.dto.ts";
import { sequelize } from "../../DB/connection.ts";

export class UserRepository {
  async findById(id: number): Promise<UserAttributes | null> {
    const user = await User.findByPk(id);
    return user ? user.get({ plain: true }) : null;
  }

  async findByEmail(email: string): Promise<UserAttributes | null> {
    const user = await User.findOne({ where: { email } });
    return user ? user.get({ plain: true }) : null;
  }

  async findAll(): Promise<UserAttributes[]> {
    const users = await User.findAll();
    return users.map((user) => user.get({ plain: true }));
  }

  async create(userData: CreateUserData): Promise<number> {
    const user = await User.create({
      email: userData.email,
      name: userData.name,
      password: userData.password,
      role: userData.role as "doctor" | "patient",
      isActive: userData.isActive,
      isDeleted: userData.isDeleted,
      isVerified: userData.isVerified,
      otp: userData.otp,
      otpExpire: userData.otpExpire,
    });
    return user.id;
  }

  async updateById(
    id: number,
    data: Record<string, unknown>
  ): Promise<boolean> {
    const [affectedRows] = await User.update(data, {
      where: { id },
    });
    return affectedRows > 0;
  }

  async updateByEmail(
    email: string,
    data: Record<string, unknown>
  ): Promise<boolean> {
    const [affectedRows] = await User.update(data, {
      where: { email },
    });
    return affectedRows > 0;
  }

  async deleteById(id: number): Promise<number> {
    // Use transaction to ensure atomic operation
    const transaction = await sequelize.transaction();
    
    try {
      // First, find and delete related patient/doctor records and their appointments
      const patient = await Patient.findOne({ where: { user_id: id }, transaction });
      if (patient) {
        // Delete appointments related to this patient
        await Appointment.destroy({ where: { patient_id: patient.id }, transaction });
        // Delete the patient record
        await Patient.destroy({ where: { user_id: id }, transaction });
      }

      const doctor = await Doctor.findOne({ where: { user_id: id }, transaction });
      if (doctor) {
        // Delete appointments related to this doctor
        await Appointment.destroy({ where: { doctor_id: doctor.id }, transaction });
        // Delete the doctor record
        await Doctor.destroy({ where: { user_id: id }, transaction });
      }

      // Finally delete the user
      const deletedCount = await User.destroy({
        where: { id },
        transaction,
      });

      await transaction.commit();
      return deletedCount;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async softDelete(id: number): Promise<void> {
    await User.update(
      { isActive: 0, isDeleted: 1 },
      { where: { id } }
    );
  }

  async verifyUser(email: string): Promise<boolean> {
    const [affectedRows] = await User.update(
      { isVerified: 1, otp: null, otpExpire: null },
      { where: { email } }
    );
    return affectedRows > 0;
  }

  async permanentlyDeleteSoftDeleted(): Promise<number> {
    // Use transaction to ensure atomic operation
    const transaction = await sequelize.transaction();
    
    try {
      // Find all soft-deleted users
      const softDeletedUsers = await User.findAll({
        where: { isDeleted: 1 },
        transaction,
      });

      let totalDeleted = 0;

      for (const user of softDeletedUsers) {
        // Delete related patient records and their appointments
        const patient = await Patient.findOne({ where: { user_id: user.id }, transaction });
        if (patient) {
          await Appointment.destroy({ where: { patient_id: patient.id }, transaction });
          await Patient.destroy({ where: { user_id: user.id }, transaction });
        }

        // Delete related doctor records and their appointments
        const doctor = await Doctor.findOne({ where: { user_id: user.id }, transaction });
        if (doctor) {
          await Appointment.destroy({ where: { doctor_id: doctor.id }, transaction });
          await Doctor.destroy({ where: { user_id: user.id }, transaction });
        }

        // Delete the user
        await User.destroy({ where: { id: user.id }, transaction });
        totalDeleted++;
      }

      await transaction.commit();
      return totalDeleted;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export const userRepository = new UserRepository();
