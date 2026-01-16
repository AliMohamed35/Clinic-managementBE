import mysql from "mysql2/promise";
import logger from "../utils/logs/logger.ts";

export const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "clinic",
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || "10"),
});

try {
  await db.getConnection();
  logger.info("Database connected successfully");
} catch (error) {
  logger.error("Database connection failed");
}
