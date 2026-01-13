import type { ResultSetHeader } from "mysql2";
import { db } from "../../DB/connection.ts";
import type { User } from "../user/user.types.ts";
import type { CreateUserData } from "./user.dto.ts";


export class UserRepository {
  async findById(id: number): Promise<User | null> {
    const [rows] = await db.query<User[]>("SELECT * FROM users WHERE id = ?", [
      id,
    ]);
    return rows[0] ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await db.query<User[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    return rows[0] ?? null;
  }

  async findAll(): Promise<User[]> {
    const [rows] = await db.query<User[]>("SELECT * FROM users");
    return rows;
  }

  async create(userData: CreateUserData): Promise<number> {
    const [result] = await db.execute<ResultSetHeader>(
      `INSERT INTO users (email, name, password, role, isActive, isDeleted, isVerified, otp, otpExpire) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userData.email,
        userData.name,
        userData.password,
        userData.role,
        userData.isActive,
        userData.isDeleted,
        userData.isVerified,
        userData.otp,
        userData.otpExpire,
      ]
    );
    return result.insertId;
  }

  async updateById(
    id: number,
    data: Record<string, unknown>
  ): Promise<boolean> {
    const fields: string[] = [];
    const values: unknown[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) return false;

    values.push(id);
    const [result] = await db.query<ResultSetHeader>(
      `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  }

  async updateByEmail(
    email: string,
    data: Record<string, unknown>
  ): Promise<boolean> {
    const fields: string[] = [];
    const values: unknown[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) return false;

    values.push(email);
    const [result] = await db.query<ResultSetHeader>(
      `UPDATE users SET ${fields.join(", ")} WHERE email = ?`,
      values
    );
    return result.affectedRows > 0;
  }

  async deleteById(id: number): Promise<boolean> {
    const [result] = await db.query<ResultSetHeader>(
      "DELETE FROM users WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  }

  async verifyUser(email: string): Promise<boolean> {
    const [rows] = await db.query<ResultSetHeader>(
      "UPDATE users SET isVerified = 1, otp = NULL, otpExpire = NULL WHERE email = ?",
      [email]
    );
    return rows.affectedRows > 0;
  }
}

export const userRepository = new UserRepository();
