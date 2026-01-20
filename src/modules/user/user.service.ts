import {
  InvalidCredentialsError,
  InvalidOTPError,
  InvalidPasswordError,
  OTPExpiredError,
  OTPNotFoundError,
  UserAlreadyLoggedInError,
  UserAlreadySoftDeletedError,
  UserAlreadyVerifiedError,
  UserExistsError,
  UserNotFoundError,
  UserNotVerifiedError,
} from "../../ExceptionHandler/customErrors.ts";
import { comparePassword, hashPassword } from "../../utils/hash/hash.ts";
import { generateToken } from "../../utils/jwt/jwt.ts";
import logger from "../../utils/logs/logger.ts";
import { generateOTP } from "../../utils/otp/index.ts";
import type {
  CreateUserData,
  UpdateUserDTO,
  UserResponseDTO,
} from "./user.dto.ts";
import { userRepository } from "./user.repository.ts";
import type { User } from "./user.types.ts";

export class UserService {
  async getUserById(id: number): Promise<UserResponseDTO> {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundError();
    }

    // transform to DTO
    return this.toResponseDTO(user);
  }

  async getUserByEmail(email: string): Promise<UserResponseDTO> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new UserNotFoundError();
    }

    // transform to DTO
    return this.toResponseDTO(user);
  }

  async getAllUsers(): Promise<UserResponseDTO[]> {
    const users = await userRepository.findAll();
    return users.map((user) => this.toResponseDTO(user));
  }

  async register(userData: CreateUserData): Promise<UserResponseDTO> {
    const existingUser = await userRepository.findByEmail(userData.email);

    if (existingUser) {
      throw new UserExistsError();
    }

    // generate OTP
    const { otp, otpExpire } = generateOTP();

    // send OTP via email
    // if (userData.email) {
    //   await sendMail({
    //     to: userData.email,
    //     subject: "Veify your account",
    //     html: `<p>Your otp to verify your account is ${otp}</p>`,
    //   });
    // }

    const hashedPassword = await hashPassword(userData.password);

    // create new user
    const userId = await userRepository.create({
      ...userData,
      password: hashedPassword,
      otp,
      otpExpire,
      isActive: 0,
      isDeleted: 0,
      isVerified: 0,
    });

    logger.info(`Registered user email: ${userData.email}`);

    return {
      id: userId,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      isActive: 0,
      isDeleted: 0,
      isVerified: 0,
    };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ user: UserResponseDTO; token: string }> {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new UserNotFoundError();
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      logger.warn(`Failed to login user: ${email}`);
      throw new InvalidCredentialsError();
    }

    if (user.isVerified === 0) {
      logger.warn(`User not verified: ${email}`);
      throw new UserNotVerifiedError();
    }

    await userRepository.updateById(user.id, { isActive: 1, isDeleted: 0 });

    // generate token
    const token = generateToken(user.id);

    logger.info(`User logged in: ${email}`);

    return {
      user: this.toResponseDTO(user),
      token,
    };
  }

  async logout(email: string): Promise<void> {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new UserNotFoundError();
    }

    await userRepository.updateByEmail(email, { isActive: 0 });
  }

  async verifyUser(email: string, otp: number): Promise<void> {
    const existingUser = await userRepository.findByEmail(email);

    if (!existingUser) {
      throw new UserNotFoundError();
    }
    if (existingUser.isVerified === 1) {
      throw new UserAlreadyVerifiedError();
    }
    if (!existingUser.otp || !existingUser.otpExpire) {
      throw new OTPNotFoundError();
    }
    if (existingUser.otp !== otp) {
      throw new InvalidOTPError();
    }

    const expireDate = new Date(existingUser.otpExpire);
    const dateNow = new Date();

    if (dateNow > expireDate) {
      throw new OTPExpiredError();
    }

    await userRepository.verifyUser(email);
  }

  async resendOTP(email: string): Promise<number> {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new UserNotFoundError();
    }
    if (user.isVerified === 1) {
      throw new UserAlreadyVerifiedError();
    }

    const { otp, otpExpire } = generateOTP();

    // if (email) {
    //   await sendMail({
    //     to: email,
    //     subject: "re-sent OTP",
    //     html: `<p>Your otp to verify your account is ${otp}</p>`,
    //   });
    // }
    await userRepository.updateByEmail(email, { otp, otpExpire });

    return otp;
  }

  async updateUser(
    id: number,
    userData: UpdateUserDTO,
  ): Promise<UserResponseDTO> {
    // check existence
    const existingUser = await userRepository.findById(id);

    if (!existingUser) throw new UserNotFoundError();

    const updateData: Record<string, unknown> = {
      ...(userData.name && { name: userData.name }),
      ...(userData.email && { email: userData.email }),
      ...(userData.role && { role: userData.role }),
      ...(userData.password && {
        password: await hashPassword(userData.password),
      }),
    };

    if (userData.email && userData.email !== existingUser.email) {
      const emailTaken = await userRepository.findByEmail(userData.email);
      if (emailTaken) throw new UserExistsError();
    }

    await userRepository.updateById(id, updateData);

    const updatedUser = await userRepository.findById(id);

    return this.toResponseDTO(updatedUser!);
  }

  async softDeleteUser(id: number): Promise<void> {
    const existingUser = await userRepository.findById(id);

    if (!existingUser) throw new UserNotFoundError();

    if (existingUser.isDeleted === 1) {
      throw new UserAlreadySoftDeletedError();
    }

    await userRepository.softDelete(id);

    logger.info(`User soft deleted: ${existingUser.email}`);
  }

  async deleteUser(id: number): Promise<number> {
    const existingUser = await userRepository.findById(id);

    if (!existingUser) throw new UserNotFoundError();

    const deletedUser = await userRepository.deleteById(id);

    logger.info(`User deleted: ${existingUser.email}`);
    return deletedUser;
  }

  async changePassword(
    email: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<UserResponseDTO> {
    // user existence
    const existingUser = await userRepository.findByEmail(email);

    if (!existingUser) {
      throw new UserNotFoundError();
    }

    const isCurrentValid = await comparePassword(
      currentPassword,
      existingUser.password,
    );

    if (!isCurrentValid) {
      throw new InvalidPasswordError();
    }

    const hashedPassword = await hashPassword(newPassword);

    existingUser.password = hashedPassword;
    await userRepository.updateByEmail(email, {password: hashedPassword});

    return this.toResponseDTO(existingUser);
  }

  // Private helper to convert User to DTO (strips sensitive fields)
  private toResponseDTO(user: User): UserResponseDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      isDeleted: user.isDeleted,
      isVerified: user.isVerified,
    };
  }
}

export const userService = new UserService();
