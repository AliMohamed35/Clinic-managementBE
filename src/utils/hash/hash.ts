import bcrypt from "bcrypt";

// is CPU-intensive and blocks Node.js from handling other requests so we used await
export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};


export const comparePassword = async (password: string, reqPassword: string) => {
  return await bcrypt.compare(password, reqPassword);
};
