import { errorHandler } from "./ExceptionHandler/errorHandler.ts";
import { userRouter, appointmentRouter } from "./modules/index.ts";
import cookieParser from "cookie-parser";

function bootstrap(app: any, express: any): void {
  // MIDDLEWARES
  // const limiter = rateLimit({
  //   windowMs: 5 * 60 * 1000,
  //   max: 5,
  //   message: "Too many requests, please try again after 5 minutes"
  // });

  // rate limiter
  // app.use(limiter);

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
