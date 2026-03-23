import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../connection.ts";

// Patient attributes interface
export interface PatientAttributes {
  id: number;
  user_id: number;
  date_of_birth: string | null;
  gender: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// For creation, id is optional (auto-generated)
export interface PatientCreationAttributes extends Optional<PatientAttributes, "id" | "date_of_birth" | "gender" | "createdAt" | "updatedAt"> {}

// Patient model class
export class Patient extends Model<PatientAttributes, PatientCreationAttributes> implements PatientAttributes {
  declare id: number;
  declare user_id: number;
  declare date_of_birth: string | null;
  declare gender: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Patient.init(
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
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "patients",
    timestamps: true,
    underscored: false,
  }
);

export default Patient;
