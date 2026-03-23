import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../connection.ts";

// Doctor attributes interface
export interface DoctorAttributes {
  id: number;
  user_id: number;
  medical_field_id: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// For creation, id is optional (auto-generated)
export interface DoctorCreationAttributes extends Optional<DoctorAttributes, "id" | "medical_field_id" | "createdAt" | "updatedAt"> {}

// Doctor model class
export class Doctor extends Model<DoctorAttributes, DoctorCreationAttributes> implements DoctorAttributes {
  declare id: number;
  declare user_id: number;
  declare medical_field_id: number | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Doctor.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    medical_field_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "doctors",
    timestamps: true,
    underscored: false,
  }
);

export default Doctor;
