export enum UserRoles {
  DOCTOR = "doctor",
  PATIENT = "patient",
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRoles;
  isActive: number;
  isDeleted: number;
  isVerified: number;
  otp?: number | null;
  otpExpire?: string | null;
}
