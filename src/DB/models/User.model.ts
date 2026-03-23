import { DataTypes, Model, type Optional } from "sequelize";
import { sequelize } from "../connection.ts";

// User attributes interface
export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "doctor" | "patient";
  isActive: number;
  isDeleted: number;
  isVerified: number;
  otp: number | null;
  otpExpire: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// For creation, id is optional (auto-generated)
export interface UserCreationAttributes extends Optional<UserAttributes, "id" | "otp" | "otpExpire" | "createdAt" | "updatedAt"> {}

// User model class
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare role: "doctor" | "patient";
  declare isActive: number;
  declare isDeleted: number;
  declare isVerified: number;
  declare otp: number | null;
  declare otpExpire: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("doctor", "patient"),
      allowNull: false,
    },
    isActive: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
    },
    isDeleted: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
    },
    isVerified: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
    },
    otp: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    otpExpire: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
    underscored: false,
  }
);

export default User;
