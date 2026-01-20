import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "secretkeyforjwt";

// 3 days in seconds
const maxAge = 15 * 60;

export const generateToken = (id: number): string => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: maxAge });
};

export const verifyToken = (token: string): jwt.JwtPayload | string => {
  return jwt.verify(token, JWT_SECRET);
};
