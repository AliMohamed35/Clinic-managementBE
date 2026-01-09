import { type Request, type Response } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { db } from "../../DB/connection.ts";
import type {
  CreateUserDTO,
  logInResponseDTO,
  UpdateUserDTO,
  User,
  UserResponseDTO,
} from "../../DB/models/user/user.types.ts";
import { comparePassword, hashPassword } from "../../utils/hash/hash.ts";
import { generateOTP } from "../../utils/otp/index.ts";
import { generateToken } from "../../utils/jwt/jwt.ts";

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

    // generate OTP
    const { otp, otpExpire } = generateOTP();

    // Hash password
    const hashedPassword = hashPassword(userData.password);

    const [result] = await db.execute<ResultSetHeader>(
      "INSERT INTO users (email, name, password, role, isActive, isDeleted, isVerified, otp, otpExpire) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        userData.email,
        userData.name,
        hashedPassword,
        userData.role,
        userData.isActive,
        userData.isDeleted,
        userData.isVerified,
        otp,
        otpExpire,
      ]
    );

    // if (userData.email) {
    //   await sendMail({
    //     to: userData.email,
    //     subject: "Email verification",
    //     html: `<p>Your otp to verify your account is ${otp}</p>`,
    //   });
    // }

    // set Response DTO
    const responseDTO: UserResponseDTO = {
      id: result.insertId,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      isActive: userData.isActive!,
      isDeleted: userData.isDeleted!,
      isVerified: userData.isVerified!,
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
      error,
    });
  }
};

// user login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // check user existence
  const [rows] = await db.query<User & RowDataPacket[]>(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: "User not found", success: false });
  }

  const match = comparePassword(password, rows[0].password);

  if (!match) {
    return res
      .status(401)
      .json({ message: "Invalid credentials", success: false });
  }

  if(rows[0]?.isVerified === 0){
     return res
      .status(401)
      .json({ message: "please verify your account first", success: false });
  }

  const activateUser = await db.query<User & ResultSetHeader[]>(
    "UPDATE users SET isActive = 1, isDeleted = 0 WHERE email = ?",
    [email]
  );

  const token = generateToken(rows[0].id);

  // ✅ Set token in cookie
  res.cookie("token", token, {
    httpOnly: true, // Prevents JavaScript access (XSS protection)
    secure: false,
    sameSite: "strict", // CSRF protection
    maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days in milliseconds
  });

  const responseDTO: logInResponseDTO = {
    name: rows[0].name,
    email: rows[0].email,
    role: rows[0].role,
  };

  return res.status(200).json({
    message: "user logged in successfully",
    success: true,
    data: responseDTO,
  });
};

// user logout
export const logout = async (req: Request, res: Response) => {
  const { id } = req.params;

  // check user existence
  const [rows] = await db.query<User & RowDataPacket[]>(
    "SELECT * FROM users WHERE id = ?",
    [id]
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: "User not found", success: false });
  }

  if (rows[0].isActive === 0) {
    return res
      .status(404)
      .json({ message: "You need to login to logout", success: false });
  }

  const logoutUser = await db.query<User & ResultSetHeader[]>(
    "UPDATE users SET isActive = 0 WHERE id = ?",
    [id]
  );

  const responseDTO: logInResponseDTO = {
    name: rows[0].name,
    email: rows[0].email,
    role: rows[0].role,
  };

  res.clearCookie("token");

  return res.status(200).json({
    message: "user logged out successfully",
    success: true,
    data: responseDTO,
  });
};

// get all users
export const getAllusers = async (res: Response) => {
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
      isActive: rows[0].isActive,
      isDeleted: rows[0].isDeleted,
      isVerified: rows[0].isVerified,
    };

    if (rows[0].isActive === 0) {
      return res
        .status(400)
        .json({ message: "You need to login!", success: false });
    }

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

// delete user
export const softDeleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // check user existence
    const [rows] = await db.query<User & RowDataPacket[]>(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "user not found!", success: false });
    }

    const responseDTO: UserResponseDTO = {
      id: rows[0].id,
      name: rows[0].name,
      email: rows[0].email,
      role: rows[0].role,
      isActive: rows[0].isActive,
      isDeleted: rows[0].isDeleted,
      isVerified: rows[0].isVerified,
    };

    if (rows[0].isActive === 0 || rows[0].isVerified === false) {
      return res
        .status(400)
        .json({ message: "You need to login!", success: false });
    }

    const [result] = await db.query<User & ResultSetHeader[]>(
      "UPDATE users SET isDeleted = ? WHERE id = ? ",
      [1, id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }

    res.status(200).json({
      message: "user deleted successfully",
      success: true,
      data: responseDTO,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "internal server error", success: false, error });
  }
};

// verify account
export const verifyUser = async (req: Request, res: Response) => {
  try {
    // get otp from body
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
      return res
        .status(400)
        .json({ message: "Email and OTP are required", success: false });
    }

    // Convert OTP to number for comparison
    const otpNumber = Number(otp);

    // Find user by email first
    const [result] = await db.query<User & RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    // Check if user exists
    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const user = result[0];

    // Check if already verified
    if (user.isVerified === 1) {
      return res
        .status(400)
        .json({
          message: "User already verified, you can login",
          success: false,
        });
    }

    // Check if OTP exists
    if (!user.otp || !user.otpExpire) {
      return res
        .status(400)
        .json({
          message: "No OTP found, please request a new one",
          success: false,
        });
    }

    // Check if OTP matches (compare as numbers)
    if (user.otp !== otpNumber) {
      return res.status(400).json({ message: "Invalid OTP", success: false });
    }

    // Check if OTP has expired
    const expireDate = new Date(user.otpExpire);
    const dateNow = new Date();

    if (dateNow > expireDate) {
      return res
        .status(400)
        .json({
          message: "OTP expired, please resend new OTP",
          success: false,
        });
    }

    // All checks passed - verify the user
    await db.query<ResultSetHeader>(
      "UPDATE users SET isVerified = 1, otp = NULL, otpExpire = NULL WHERE email = ?",
      [email]
    );

    return res
      .status(200)
      .json({ message: "Email verified successfully", success: true });
  } catch (error) {
    console.error("Verify user error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false, error });
  }
};

// resend OTP
export const resendOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required", success: false });
    }

    // Check user existence
    const [result] = await db.query<User & RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // Check if already verified
    if (result[0].isVerified === 1) {
      return res
        .status(400)
        .json({
          message: "User already verified, you can login",
          success: false,
        });
    }

    // Generate new OTP
    const { otp, otpExpire } = generateOTP();

    // Update user with new OTP
    await db.query<ResultSetHeader>(
      "UPDATE users SET otp = ?, otpExpire = ? WHERE email = ?",
      [otp, otpExpire, email]
    );

    // Log OTP for testing (remove in production)
    console.log(`New OTP for ${email}: ${otp}`);

    // if (email) {
    //   await sendMail({
    //     to: email,
    //     subject: "Email verification",
    //     html: `<p>Your otp to verify your account is ${otp}</p>`,
    //   });
    // }

    return res
      .status(200)
      .json({ message: "OTP sent successfully", success: true, otp });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", success: false, error });
  }
};
