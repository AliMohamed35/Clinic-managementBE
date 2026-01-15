import express, { type Application } from "express";
import bootstrap from "./app.controller.ts";
import { initCronJobs } from "./utils/cron/index.ts";

// initialize app
const app: Application = express();
const PORT: number = 3000;

// bootstrap function
bootstrap(app, express);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
  
  // Initialize cron jobs after server starts
  initCronJobs();
});
