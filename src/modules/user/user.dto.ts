// What CLIENT sends for registration
export interface RegisterUserDTO {
  name: string;
  email: string;
  password: string;
  role: 'doctor' | 'patient';
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: string;
  isActive: number;
  isDeleted: number;
  isVerified: number;
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

// For login request
export interface LoginDTO {
  email: string;
  password: string;
}

// For OTP verification
export interface VerifyOTPDTO {
  email: string;
  otp: number;
}

// For partial updates
export interface UpdateUserDTO {
  name?: string;
  email?: string;
  role?: 'doctor' | 'patient';
  password?: string;
}