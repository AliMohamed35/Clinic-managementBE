import type { RowDataPacket } from "mysql2";

export interface User extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  isActive: number;
  isDeleted: number;
  isVerified: number;
}