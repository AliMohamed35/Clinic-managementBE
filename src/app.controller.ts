import { errorHandler } from "./ExceptionHandler/errorHandler.ts";
import { userRouter, appointmentRouter } from "./modules/index.ts";
import cookieParser from "cookie-parser";

function bootstrap(app: any, express: any): void {
  // MIDDLEWARES
  // middleware to parse data
  app.use(express.json());

  // cookies parser
  app.use(cookieParser());

  // *ROUTERS
  // user router
  app.use("/user", userRouter);
  app.use("/appointment", appointmentRouter);

  // error handler
  app.use(errorHandler);
}
export default bootstrap;