import {userRouter} from "./modules/index.ts"

function bootstrap(app: any, express: any): void{

    // MIDDLEWARES
    // middleware to parse data
    app.use(express.json());
    
    // *ROUTERS
    // user router
    app.use("/user", userRouter);
}
export default bootstrap;