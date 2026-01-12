export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role: string;
  isActive?: number;
  isDeleted?: number;
  isVerified?: number;
  otp: number;
  otpExpire: string;
}

export interface UserResponseDTO {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: number;
  isDeleted: number;
  isVerified: number;
}