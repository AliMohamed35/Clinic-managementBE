import { type Request, type Response } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import type {
  CreateUserDTO,
  UpdateUserDTO,
  User,
  UserResponseDTO,
} from "../../DB/models/user/user.types.ts";
import { db } from "../../DB/connection.ts";
import { hashPassword } from "../../utils/hash/hash.ts";

// register new user
export const register = async (req: Request, res: Response) => {
  try {
    // get data from request body
    const userData: CreateUserDTO = req.body;

    // check user existence
    const [rows] = await db.query<User[]>(
      "SELECT * FROM users WHERE email = ?",
      [req.body.email]
    );

    if (rows.length > 0) {
      return res
        .status(409)
        .json({ message: "User already exists", success: false });
    }

    // Hash password
    const hashedPassword = hashPassword(userData.password);

    const [result] = await db.execute<ResultSetHeader>(
      "INSERT INTO users (email, name, password, role) VALUES (?, ?, ?, ?)",
      [userData.email, userData.name, hashedPassword, userData.role]
    );

    // set Response DTO
    const responseDTO: UserResponseDTO = {
      id: result.insertId,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    };

    return res.status(201).json({
      message: "user created successfully",
      success: true,
      data: responseDTO,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// get all users
export const getAllusers = async (req: Request, res: Response) => {
  // Select query
  const returnedUsers = await db.query<RowDataPacket[]>("SELECT * FROM users");

  // return response
  return res.status(200).json({
    message: "Users retrieved succesffully",
    success: true,
    data: returnedUsers,
  });
};

// get user by Id
export const getUserById = async (req: Request, res: Response) => {
  try {
    // get data from body
    const { id } = req.params;

    // check user existence
    const [rows] = await db.query<User & RowDataPacket[]>(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const user = rows[0];

    return res.status(200).json({
      message: "user retrieved successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update user all fields
export const updateAllUser = async (req: Request, res: Response) => {
  try {
    // get user id from param
    const { id } = req.params;

    //check user existence
    const [rows] = await db.query<User & RowDataPacket[]>(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found", success: true });
    }

    // get user data from request
    const userData: User = req.body;

    // Hash password if provided
    if (userData.password) {
      userData.password = hashPassword(userData.password);
    }

    // update user
    const [result] = await db.query<ResultSetHeader>(
      "UPDATE users SET name = ?, email = ?, role = ?, password = ? WHERE id = ?",
      [userData.name, userData.email, userData.role, userData.password, id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "No rows updated", success: false });
    }

    res.status(200).json({
      message: "User updated successfully",
      success: true,
      insertedId: result.insertId,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }
};

// update user partially
export const updateUserPartially = async (
  req: Request<{ id: string }, {}, UpdateUserDTO>,
  res: Response
) => {
  try {
    //get user id from params
    const { id } = req.params;

    // get user data from body
    const data = req.body;

    // check user existence
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT id FROM users WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "user not found", success: false });
    }

    // update user partially
    const fields: string[] = [];
    const values: (string | number)[] = [];

    if (data.name) {
      fields.push("name = ?");
      values.push(data.name);
    }

    if (data.email) {
      fields.push("email = ?");
      values.push(data.email);
    }

    if (data.role) {
      fields.push("role = ?");
      values.push(data.role);
    }

    if (data.password) {
      const hashedPassword = await hashPassword(data.password);
      fields.push("password = ?");
      values.push(hashedPassword);
    }

    // if nothing to update
    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided for update",
      });
    }

    values.push(Number(id));

    const query = `
      UPDATE users
      SET ${fields.join(", ")}
      WHERE id = ?
    `;

    const [result] = await db.query<ResultSetHeader>(query, values);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "No rows updated", success: false });
    }

    const [updatedRows] = await db.query<RowDataPacket[]>(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [id]
    );

    const responseDTO: UserResponseDTO = updatedRows[0] as UserResponseDTO;

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: responseDTO,
    });
  } catch (error) {
    return res
      .status(404)
      .json({ message: "Internal server error", success: false });
  }
};

// delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    // get id from request
    const { id } = req.params;

    // check user existence
    const query = "SELECT * FROM users WHERE id = ?";
    const [rows] = await db.query<User & RowDataPacket[]>(query, [id]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const responseDTO: UserResponseDTO = {
      id: rows[0].id,
      name: rows[0].name,
      email: rows[0].email,
      role: rows[0].role,
    };

    // delete user
    const deleteQuery = "DELETE FROM users WHERE id = ?";
    const [result] = await db.query<User & ResultSetHeader>(deleteQuery, [id]);

    if (result.affectedRows === 0) {
      return res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }

    return res.status(200).json({
      message: "User deletd successfully",
      success: true,
      data: responseDTO,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", success: false, error: error });
  }
};
