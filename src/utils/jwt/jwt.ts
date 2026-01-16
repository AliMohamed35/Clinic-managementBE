import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key_change_this_in_production";

// 3 days in seconds
const maxAge = 3 * 24 * 60 * 60;

export const generateToken = (id: number): string => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: maxAge });
};

export const verifyToken = (token: string): jwt.JwtPayload | string => {
  return jwt.verify(token, JWT_SECRET);
};
