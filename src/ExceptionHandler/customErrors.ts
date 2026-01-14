export class UserNotFoundError extends Error {
  constructor(message = "User not found") {
    super(message);
    this.name = "UserNotFoundError";
  }
}

export class UserExistsError extends Error {
  constructor(message = "User already exists") {
    super(message);
    this.name = "UserExistsError";
  }
}

export class InvalidCredentialsError extends Error {
  constructor(message = "Invalid Credentials") {
    super(message);
    this.name = "InvalidCredentialsError";
  }
}

export class UserNotVerifiedError extends Error{
  constructor(message = "User not verified!"){
    super(message);
    this.name = "UserNotVerifiedError"
  }
}

export class UserAlreadyVerifiedError extends Error{
  constructor(message = "User already verified!"){
    super(message);
    this.name = "UserAlreadyVerifiedError"
  }
}

export class OTPNotFoundError  extends Error{
  constructor(message = "OTP not found!"){
    super(message);
    this.name = "OTPNotFoundError"
  }
}

export class InvalidOTPError   extends Error{
  constructor(message = "Invalid OTP!"){
    super(message);
    this.name = "InvalidOTPError"
  }
}

export class OTPExpiredError    extends Error{
  constructor(message = "Expired OTP!"){
    super(message);
    this.name = "OTPExpiredError"
  }
}

export class AppointmentAlreadyExistError extends Error{
  constructor(message = "Appointment already exist!"){
    super(message);
    this.name = "AppointmentAlreadyExistError"
  }
}