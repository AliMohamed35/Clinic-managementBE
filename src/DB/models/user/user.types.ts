import type { RowDataPacket } from "mysql2";

export interface User extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface UserResponseDTO {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  role?: "admin" | "doctor" | "user";
  password?: string;
}
