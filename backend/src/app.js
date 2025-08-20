import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { globalErrorHandling } from "./middlewares/error.middleware.js";


export const app = express();

app.use(cors({
    origin:'*',
    credentials:true
}))

//for request coming in json(format)
app.use(express.json({limit:"20kb"}));

//for request coming in url%20formart%20 
//to read by backend easily
app.use(express.urlencoded({limit:"20kb",extended:true}))

//for handling static data->img,videos,pdf,etc
app.use(express.static('/public'))

//use for req parsing cookies to the backend
app.use(cookieParser())


import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import courseRouter from "./routes/course.route.js";
import enrollmentRouter from "./routes/enrollment.route.js";


app.use("/api/v1/auths",authRouter);
app.use("/api/v1/users",userRouter);
app.use("/api/v1/courses",courseRouter);
app.use("/api/v1/enrollments",enrollmentRouter);



//globalError Handling
app.use(globalErrorHandling);