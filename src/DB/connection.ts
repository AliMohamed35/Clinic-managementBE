import { Sequelize } from "sequelize";
import logger from "../utils/logs/logger.ts";

export const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST || "localhost",
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "clinic",
  pool: {
    max: parseInt(process.env.DB_CONNECTION_LIMIT || "10"),
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: (msg) => logger.debug(msg),
});

export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    logger.info("Database connected successfully");
  } catch (error) {
    logger.error("Database connection failed:", error);
    throw error;
  }
};

// For backward compatibility, keep db export but mark as deprecated
/** @deprecated Use sequelize instance instead */
export const db = sequelize;
