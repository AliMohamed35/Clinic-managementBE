import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

import express, { type Application } from "express";
import bootstrap from "./app.controller.ts";
import { connectDB } from "./DB/connection.ts";
import { initCronJobs } from "./utils/cron/index.ts";
import logger from "./utils/logs/logger.ts";

// Import models to initialize associations
import "./DB/models/index.ts";

// initialize app
const app: Application = express();
const PORT: number = parseInt(process.env.PORT || "3000");

// bootstrap function
bootstrap(app, express);

// Connect to database and start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    app.listen(PORT, () => {
      logger.info(`Server is running on ${PORT}`);
      
      // Initialize cron jobs after server starts
      initCronJobs();
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
