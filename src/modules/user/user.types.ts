import type { RowDataPacket } from "mysql2";

export enum UserRoles {
  DOCTOR= 'doctor',
  PATIENT= 'patient',
}

export interface User extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRoles;
  isActive: number;
  isDeleted: number;
  isVerified: number;
}