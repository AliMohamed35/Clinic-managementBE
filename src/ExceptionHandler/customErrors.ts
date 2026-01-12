export class UserNotFoundError extends Error {
  constructor(message = "User not found") {
    super(message);
    this.name = "UserNotFoundError";
  }
}

export class UserExistsError extends Error {
  constructor(message = "User already exists") {
    super(message);
    this.name = "UserAlreadyExist";
  }
}

export class InvalidCredentialsError extends Error {
  constructor(message = "Invalid Credentials") {
    super(message);
    this.name = "UserAlreadyExist";
  }
}