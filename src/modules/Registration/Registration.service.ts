import { UserExistsError } from "../../ExceptionHandler/customErrors.ts";
import { hashPassword } from "../../utils/hash/hash.ts";
import logger from "../../utils/logs/logger.ts";
import { generateOTP } from "../../utils/otp/index.ts";
import { doctorRepository } from "../doctors/doctor.repository.ts";
import { patientRepository } from "../patients/patient.repository.ts";
import type { CreateUserData, UserResponseDTO } from "../user/user.dto.ts";
import { userRepository } from "../user/user.repository.ts";

interface RegisterUserData extends CreateUserData {
  // doctor
  medical_field_id?: number;
  
  // patient
  date_of_birth?: string;
  gender?: string;
}

export class RegistrationService {
  async register(userData: RegisterUserData): Promise<UserResponseDTO> {
    // Check if user already exists
    const existingUser = await userRepository.findByEmail(userData.email);

    if (existingUser) {
      throw new UserExistsError();
    }

    const { otp, otpExpire } = generateOTP();

    const hashedPassword = await hashPassword(userData.password);

    // Create base user
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

    // Create role-specific profile
    try {
      switch (userData.role) {
        case "doctor":
          logger.info(`Creating doctor profile for user ID: ${userId} with medical_field_id: ${userData.medical_field_id}`);
          await doctorRepository.create(userId, userData.medical_field_id);
          logger.info(`Doctor profile created successfully`);
          break;
        case "patient":
          logger.info(`Creating patient profile for user ID: ${userId}`);
          await patientRepository.create(userId, userData.date_of_birth, userData.gender);
          logger.info(`Patient profile created successfully`);
          break;
      }
    } catch (error) {
      logger.error(`Failed to create role profile: ${error}`);
      throw error;
    }

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
}

export const registrationService = new RegistrationService();
