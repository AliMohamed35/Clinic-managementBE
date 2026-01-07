import jwt from "jsonwebtoken";

const maxAge = 3 * 24 * 60 * 60;
export const generateToken = (id: any) => { // will change the type later
  return jwt.sign({ id }, "secretkey", { expiresIn: maxAge });
};
