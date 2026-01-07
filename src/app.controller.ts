import {userRouter} from "./modules/index.ts"
import cookieParser from 'cookie-parser';

function bootstrap(app: any, express: any): void{

    // MIDDLEWARES
    // middleware to parse data
    app.use(express.json());

    // cookies parser
    app.use(cookieParser());
    
    // *ROUTERS
    // user router
    app.use("/user", userRouter);
}
export default bootstrap;