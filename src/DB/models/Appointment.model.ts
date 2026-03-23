import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../connection.ts";

// Appointment status enum
export enum AppStatus {
  PENDING = "Pending",
  COMPLETED = "Completed",
}

// Appointment attributes interface
export interface AppointmentAttributes {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_date: string;
  appointment_time: string;
  status: AppStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

// For creation, id is optional (auto-generated)
export interface AppointmentCreationAttributes extends Optional<AppointmentAttributes, "id" | "createdAt" | "updatedAt"> {}

// Appointment model class
export class Appointment extends Model<AppointmentAttributes, AppointmentCreationAttributes> implements AppointmentAttributes {
  declare id: number;
  declare patient_id: number;
  declare doctor_id: number;
  declare appointment_date: string;
  declare appointment_time: string;
  declare status: AppStatus;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Appointment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "patients",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    doctor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "doctors",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    appointment_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    appointment_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Pending", "Completed"),
      allowNull: false,
      defaultValue: AppStatus.PENDING,
    },
  },
  {
    sequelize,
    tableName: "appointments",
    timestamps: true,
    underscored: false,
  }
);

export default Appointment;
